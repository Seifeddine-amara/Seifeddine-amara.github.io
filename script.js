document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("searchBar");
  const shopForm = document.getElementById("shopForm");
  const resultTable = document
    .getElementById("resultTable")
    .getElementsByTagName("tbody")[0];
  const exportButton = document.getElementById("exportButton");
  const openImportPopup = document.getElementById("openImportPopup");
  const closeImportPopup = document.getElementById("closeImportPopup");
  const importPopup = document.getElementById("importPopup");
  const importButton = document.getElementById("importButton");
  const importFile = document.getElementById("importFile");

  // Ajouter des données au tableau
  shopForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(shopForm);
    const phoneNumber = formData.get("num_tel");

    if (isPhoneNumberUnique(phoneNumber)) {
      addRowToTable(formData);
      shopForm.reset();
      showPopup("Données ajoutées avec succès !", true);
    } else {
      showPopup("Le numéro de téléphone existe déjà.", false);
    }
  });

  // Ajouter une ligne au tableau
  const addRowToTable = (formData) => {
    const newRow = resultTable.insertRow();
    const cells = [
      formData.get("Produit"),
      formData.get("Nom"),
      formData.get("num_tel"),
      formData.get("adresse"),
      formData.get("quantité"),
      formData.get("prix"),
      formData.get("etat"),
    ];

    cells.forEach((cellData, index) => {
      const newCell = newRow.insertCell(index);
      newCell.textContent = cellData;
    });

    const actionCell = newRow.insertCell(cells.length);

    // Créer le bouton "Éditer"
    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fas fa-edit"></i> Modifier';
    editButton.className =
      "editButton bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition-colors mr-2";

    // Créer le bouton "Supprimer"
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fas fa-trash"></i> Supprimer';
    deleteButton.className =
      "deleteButton bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition-colors";

    // Ajouter les boutons à la cellule d'action
    actionCell.appendChild(editButton);
    actionCell.appendChild(deleteButton);
  };

  // Vérifier si le numéro de téléphone est unique
  const isPhoneNumberUnique = (phoneNumber) => {
    const rows = resultTable.getElementsByTagName("tr");
    for (const row of rows) {
      const phoneCell = row.getElementsByTagName("td")[2];
      if (phoneCell && phoneCell.textContent === phoneNumber) {
        return false;
      }
    }
    return true;
  };

  // Gérer les clics sur les boutons "Supprimer" et "Modifier"
  const confirmDeletePopup = document.getElementById("confirmDeletePopup");
  const confirmDeleteButton = document.getElementById("confirmDeleteButton");
  const cancelDeleteButton = document.getElementById("cancelDeleteButton");
  let rowToDelete = null; // Pour stocker la ligne à supprimer
  resultTable.addEventListener("click", (event) => {
    const target = event.target;

    // Supprimer une ligne
    if (target.classList.contains("deleteButton")) {
      rowToDelete = target.closest("tr"); // Stocker la ligne à supprimer
      confirmDeletePopup.style.display = "flex"; // Afficher la popup de confirmation
    }

    // Modifier une ligne
    if (target.classList.contains("editButton")) {
      const row = target.closest("tr");
      editRow(row);
    }
  });

  // Confirmer la suppression
  confirmDeleteButton.addEventListener("click", () => {
    if (rowToDelete) {
      rowToDelete.remove(); // Supprimer la ligne
      showPopup("Ligne supprimée avec succès !", true); // Afficher un message de succès
    }
    confirmDeletePopup.style.display = "none"; // Masquer la popup
    rowToDelete = null; // Réinitialiser la variable
  });

  // Annuler la suppression
  cancelDeleteButton.addEventListener("click", () => {
    confirmDeletePopup.style.display = "none"; // Masquer la popup
    rowToDelete = null; // Réinitialiser la variable
  });

  // Modifier une ligne
  const editRow = (row) => {
    const cells = row.getElementsByTagName("td");
    document.getElementsByName("Produit")[0].value = cells[0].textContent;
    document.getElementsByName("Nom")[0].value = cells[1].textContent;
    document.getElementsByName("num_tel")[0].value = cells[2].textContent;
    document.getElementsByName("adresse")[0].value = cells[3].textContent;
    document.getElementsByName("quantité")[0].value = cells[4].textContent;
    document.getElementsByName("prix")[0].value = cells[5].textContent;
    document.querySelector(
      `input[name="etat"][value="${cells[6].textContent}"]`
    ).checked = true;

    // Supprimer la ligne après l'avoir modifiée
    row.remove();
    showPopup("Ligne prête à être modifiée !", true);
  };

  // Exporter les données vers Excel
  exportButton.addEventListener("click", () => {
    const dataToExport = [];
    const headers = [];
    resultTable.querySelectorAll("thead th").forEach((header, index) => {
      if (index < resultTable.querySelectorAll("thead th").length - 1) {
        headers.push(header.textContent);
      }
    });
    dataToExport.push(headers);

    const rows = resultTable.getElementsByTagName("tr");
    for (const row of rows) {
      const rowData = [];
      const cells = row.getElementsByTagName("td");
      for (let i = 0; i < cells.length - 1; i++) {
        rowData.push(cells[i].textContent);
      }
      dataToExport.push(rowData);
    }

    const worksheet = XLSX.utils.aoa_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const currentDate = new Date();
    const filename = `MondoShop_${currentDate
      .toISOString()
      .slice(
        0,
        10
      )}_${currentDate.getHours()}-${currentDate.getMinutes()}.xlsx`;
    XLSX.writeFile(workbook, filename);
    showPopup("Données exportées avec succès !", true);
  });

  // Importer des données depuis Excel
  importButton.addEventListener("click", () => {
    const file = importFile.files[0];
    if (!file) {
      showPopup("Veuillez sélectionner un fichier Excel.", false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      jsonData.forEach((rowData, index) => {
        if (index === 0) return; // Ignorer l'en-tête
        const newRow = resultTable.insertRow();
        rowData.forEach((cellData, cellIndex) => {
          const newCell = newRow.insertCell(cellIndex);
          newCell.textContent = cellData;
        });

        const actionCell = newRow.insertCell(rowData.length);
        actionCell.innerHTML = `
    <button class="editButton bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition-colors">
        <i class="fas fa-edit"></i> Modifier
    </button>
    <button class="deleteButton bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition-colors">
        <i class="fas fa-trash"></i> Supprimer
    </button>
`;
      });

      showPopup("Données importées avec succès !", true);
      importFile.value = "";
      importPopup.style.display = "none";
    };
    reader.readAsArrayBuffer(file);
  });

  // Gérer la popup d'importation
  openImportPopup.addEventListener("click", () => {
    importPopup.style.display = "flex";
  });

  closeImportPopup.addEventListener("click", () => {
    importPopup.style.display = "none";
  });

  // Afficher un toast (message de feedback)
  const messagePopup = document.getElementById("messagePopup");
  const popupMessage = document.getElementById("popupMessage");
  const closeMessagePopup = document.getElementById("closeMessagePopup");

  // Afficher la popup avec un message
  const showPopup = (message, isSuccess) => {
    popupMessage.textContent = message;
    if (isSuccess) {
      popupMessage.classList.remove("text-red-600");
      popupMessage.classList.add("text-green-600");
    } else {
      popupMessage.classList.remove("text-green-600");
      popupMessage.classList.add("text-red-600");
    }
    messagePopup.style.display = "flex";
  };

  // Fermer la popup
  closeMessagePopup.addEventListener("click", () => {
    messagePopup.style.display = "none";
  });
});
const searchBar = document.getElementById("searchBar");

searchBar.addEventListener("input", () => {
    const searchTerm = searchBar.value.toLowerCase();
    filterTable(searchTerm);
});

const filterTable = (searchTerm) => {
    const rows = resultTable.getElementsByTagName("tr");

    for (const row of rows) {
        const cells = row.getElementsByTagName("td");
        let shouldDisplay = false;

        for (let i = 0; i < cells.length - 1; i++) {
            const cellText = cells[i].textContent.toLowerCase();
            if (cellText.includes(searchTerm)) {
                shouldDisplay = true;
                break;
            }
        }

        row.style.display = shouldDisplay ? "" : "none";
    }
};

// Optionnel : Fonction pour normaliser le texte (ignorer les accents)
const normalizeText = (text) => {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
};