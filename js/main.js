// Function to include HTML content
function loadHTML(elementId, filePath) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error loading ${filePath}: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        })
        .catch(error => console.error('There was an error!', error));
}

// Include header and footer
document.addEventListener('DOMContentLoaded', function() {
    loadHTML('header', 'includes/header.html');
    loadHTML('footer', 'includes/footer.html');

    // Tabs (buttons) functionality
    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const link = tab.getAttribute('data-link');
            window.location.href = link;
        });
    });
});
