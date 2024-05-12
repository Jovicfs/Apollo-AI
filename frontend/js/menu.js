document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.getElementById('menu-button');
    const menuContainer = document.getElementById('menuContainer');

    menuButton.addEventListener('click', function(e) {
        e.preventDefault(); 
        menuContainer.classList.toggle('show-menu'); 
    });
});
 