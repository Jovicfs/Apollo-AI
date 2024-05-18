document.addEventListener('DOMContentLoaded', function() {
    const menuCustomizeBtn = document.getElementById('customize');
    const menuCustomize = document.querySelector('.customize-menu')
    let isOpen = false
   
        menuCustomizeBtn.addEventListener('click', function(e) {
            isOpen = !isOpen
            menuCustomize.style.display = 'block'
            console.log('abriu')
        }) 
        
        menuCustomizeBtn.addEventListener('click', function(e){
            if(isOpen){
                menuCustomize.style.display = 'none'
            }
        })
      
});
 
