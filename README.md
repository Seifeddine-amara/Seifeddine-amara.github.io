<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mondo Shop</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.3/xlsx.full.min.js"></script>
    <style>
      /* Styles globaux */
body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
}

/* Contenu principal */
.content {
    text-align: center;
    background-color: #eeeeee;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    max-width: 100%; /* Largeur maximale du contenu */
    background-size: cover; /* Ajuste l'image pour couvrir toute la zone */
    background-position: center; /* Centre l'image horizontalement */
    background-repeat: no-repeat; /* Empêche la répétition de l'image */
    margin-top: 100px; /* Espacement du haut de la page */
    margin-bottom: 100px;
}

/* Logo */
img {
    max-width: 100%;
    margin-bottom: 20px;
}

/* Formulaire */
table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    overflow-x: auto; /* Ajout de la barre de défilement horizontale */
}

/* Styles spécifiques aux cellules du tableau */
th, td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
    white-space: nowrap; /* Empêcher le texte de se retourner à la ligne */
}

input[type="text"],
input[type="tel"],
input[type="number"],
button {
    width: calc(100% - 16px);
    padding: 10px;
    margin-bottom: 10px;
    box-sizing: border-box;
    border: 1px solid #ddd;
    border-radius: 5px;
}

input[type="text"]:focus,
input[type="tel"]:focus,
input[type="number"]:focus {
    outline: none;
    border-color: #4CAF50;
}

.radio-container {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.radio-container div {
    margin-right: 20px;
}

button {
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #45a049;
}

/* Liste des résultats */
.result-list {
    margin-top: 20px;
    padding: 0;
}

.result-list li {
    background-color: #ffffff;
    padding: 15px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
}

    </style>
    
</head>
<body>
    <div class="content">
        <img src="logo.jpg" alt="Mondo Shop Logo">
        
        <div>
            <form id="shopForm">
                <table>
                    <tr>
                        <th>Produit</th>
                        <th>Nom & Prénom</th>
                        <th>Téléphone</th>
                        <th>Adresse</th>
                        <th>Quantité</th>
                        <th>Prix</th>
                        <th>État</th>
                        <th>Action</th>
                    </tr>
                    <tr>
                        <td><input type="text" name="Produit" required></td>
                        <td><input type="text" name="Nom" required></td>
                        <td><input type="tel" name="num_tel" required></td>
                        <td><input type="text" name="adresse" required></td>
                        <td><input type="number" name="quantité" required></td>
                        <td><input type="number" name="prix" required></td>
                        <td>
                            <div class="radio-container">
                                <div>
                                    <input type="radio" id="option1" name="etat" value="Accepté" required>
                                    <label for="option1" class="radio-label">Accepté</label>
                                </div>
                                <div>
                                    <input type="radio" id="option2" name="etat" value="Refusé" required>
                                    <label for="option2" class="radio-label">Refusé</label>
                                </div>
                            </div>
                        </td>
                        <td>
                            <button type="submit">Submit</button>
                        </td>
                    </tr>
                </table>
            </form>
        
            <table id="resultTable" class="result-table">
                <thead>
                    <tr>
                        <th>Produit</th>
                        <th>Nom & Prénom</th>
                        <th>Téléphone</th>
                        <th>Adresse</th>
                        <th>Quantité</th>
                        <th>Prix</th>
                        <th>État</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
            
            <button id="exportButton">Exporter vers un fichier Excel</button>
        </div>
    </div>
   
    <script>
      // Gestion de la soumission du formulaire
      document.getElementById('shopForm').addEventListener('submit', function(event) {
            event.preventDefault();

            const form = event.target;
            const produit = form.Produit.value;
            const nom = form.Nom.value;
            const numTel = form.num_tel.value;
            const adresse = form.adresse.value;
            const quantite = form.quantité.value;
            const prix = form.prix.value;
            const etat = form.etat.value;

            const resultTable = document.getElementById('resultTable').getElementsByTagName('tbody')[0];

            // Vérifier si le numéro de téléphone est déjà présent
            if (isPhoneNumberUnique(numTel)) {
                // Ajouter la nouvelle entrée uniquement si le numéro de téléphone est unique
                const newRow = resultTable.insertRow();
                const cells = [produit, nom, numTel, adresse, quantite, prix, etat];

                cells.forEach((cellData, index) => {
                    const newCell = newRow.insertCell(index);
                    newCell.textContent = cellData;
                });

                form.reset();
            } else {
                alert("Le numéro de téléphone existe déjà. Veuillez saisir un numéro de téléphone différent.");
            }
        });

        // Fonction pour vérifier si le numéro de téléphone est unique
        function isPhoneNumberUnique(phoneNumber) {
            const resultTable = document.getElementById('resultTable');
            const rows = resultTable.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
            
            for (const row of rows) {
                const phoneCell = row.getElementsByTagName('td')[2]; // La troisième cellule contient le numéro de téléphone
                if (phoneCell.textContent === phoneNumber) {
                    return false; // Le numéro de téléphone existe déjà
                }
            }
            
            return true; // Le numéro de téléphone est unique
        }

        // Gestion du clic sur le bouton d'enregistrement
        document.getElementById('exportButton').addEventListener('click', function() {
            const resultTable = document.getElementById('resultTable');
            const dataToExport = [];

        // Ajouter les en-têtes au début du tableau de données
    const headers = [];
    resultTable.querySelectorAll('thead th').forEach(header => {
        headers.push(header.textContent);
    });
    dataToExport.push(headers);

            // Récupérer les données de chaque ligne du tableau
            const rows = resultTable.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
            for (const row of rows) {
                const rowData = [];
                const cells = row.getElementsByTagName('td');
                for (const cell of cells) {
                    rowData.push(cell.textContent);
                }
                dataToExport.push(rowData);
            }

            // Créer une feuille Excel
            const worksheet = XLSX.utils.aoa_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');


            // Générer le nom de fichier avec la date actuelle
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const filename = `MondoShop_${year}-${month}-${day}.xlsx`;

            // Générer le fichier Excel et le télécharger
            XLSX.writeFile(workbook, filename);
        });

        // Gestion de l'événement beforeunload pour exporter les données avant de quitter la page
        window.addEventListener('beforeunload', function(event) {
            event.preventDefault();

            const resultTable = document.getElementById('resultTable');
            const dataToExport = [];

            // Récupérer les données de chaque ligne du tableau
            const table = document.getElementById('savedDataTable');
        const rows = table.querySelectorAll('tr');
        const data = [];

        rows.forEach(function(row) {
            const rowData = [];
            row.querySelectorAll('td').forEach(function(cell) {
                rowData.push(cell.textContent);
            });
            data.push(rowData);
        });

            // Créer une feuille Excel
            const worksheet = XLSX.utils.aoa_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

            // Générer le nom de fichier avec la date actuelle
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const filename = `MondoShop_${year}${month}${day}.xlsx`;

            // Générer le fichier Excel et le télécharger
            XLSX.writeFile(workbook, filename);
        });
    </script>
</body>
</html>
