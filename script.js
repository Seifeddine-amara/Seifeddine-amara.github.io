function showToast(message, isSuccess = true) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add(isSuccess ? 'bg-green-600' : 'bg-red-600');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Exemple d'utilisation
showToast("Données exportées avec succès !", true);
showToast("Erreur lors de l'importation.", false);