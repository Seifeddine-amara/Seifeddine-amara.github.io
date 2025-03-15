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
      showToast("Données ajoutées avec succès !", true);
    } else {
      showToast("Le numéro de téléphone existe déjà.", false);
    }
  });

  // Ajouter une ligne au tableau
  const addRowToTable = (formData) => {
    const newRow = resultTable.insertRow();
    const cells = [
        formData.get('Produit'),
        formData.get('Nom'),
        formData.get('num_tel'),
        formData.get('adresse'),
        formData.get('quantité'),
        formData.get('prix'),
        formData.get('etat')
    ];

    cells.forEach((cellData, index) => {
        const newCell = newRow.insertCell(index);
        newCell.textContent = cellData;
    });

    const actionCell = newRow.insertCell(cells.length);

    // Créer le bouton "Éditer"
    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="fas fa-edit"></i> Modifier';
    editButton.className = 'editButton bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition-colors mr-2';

    // Créer le bouton "Supprimer"
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fas fa-trash"></i> Supprimer';
    deleteButton.className = 'deleteButton bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition-colors';

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
  resultTable.addEventListener("click", (event) => {
    const target = event.target;

    // Supprimer une ligne
    if (target.classList.contains("deleteButton")) {
      const row = target.closest("tr");
      row.remove();
      showToast("Ligne supprimée avec succès !", true);
    }

    // Modifier une ligne
    if (target.classList.contains("editButton")) {
      const row = target.closest("tr");
      editRow(row);
    }
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
    showToast("Ligne prête à être modifiée !", true);
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
    showToast("Données exportées avec succès !", true);
  });

  // Importer des données depuis Excel
  importButton.addEventListener("click", () => {
    const file = importFile.files[0];
    if (!file) {
      showToast("Veuillez sélectionner un fichier Excel.", false);
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

      showToast("Données importées avec succès !", true);
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
  const showToast = (message, isSuccess) => {
    const toast = document.createElement("div");
    toast.className = `toast ${isSuccess ? "success" : "error"}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  };
});
