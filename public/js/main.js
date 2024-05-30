document.addEventListener("DOMContentLoaded", function() {
    // Search functionality
    const searchInput = document.querySelector('.header-search input');
    const searchIcon = document.querySelector('.header-search .material-icons');

    searchIcon.addEventListener('click', function() {
        alert(`Searching for: ${searchInput.value}`);
    });

    // Header options interactivity
    const headerOptions = document.querySelectorAll('.headerOption');
    
    headerOptions.forEach(option => {
        option.addEventListener('click', function() {
            alert(`Clicked on: ${this.querySelector('h3').innerText}`);
        });
    });

    // Dropdown interactivity
    const dropdowns = document.querySelectorAll('.dropdown-me');
    
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', function() {
            alert(`Selected: ${this.options[this.selectedIndex].text}`);
        });
    });
});