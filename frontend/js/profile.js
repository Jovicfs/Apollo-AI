document.addEventListener('DOMContentLoaded', function (){
    const myUser = document.getElementById('my-user');
    const uploadImage = document.getElementById('uploadProfile');
    const selectProfileImage = document.getElementById('predefined-userImages');
    
  
      async function saveProfileImage(imageProfile){
          try{
              const response = await fetch('/wallpaper.js/save',{
                  method: 'POST',
                  headers:{
                      'Content-Type':'aplication/json'
                  },
                  body:JSON.stringify({
                      imageProfile
                  })
              });
              const responseJson = await response.json();
              console.log('Image saved, notify the user')
          }  catch (e) {
              console.error("Error while saving an image", e.message);
          }
      }
      uploadImage.addEventListener('change', function(event) {
          const file = event.target.files[0];
          const reader = new FileReader();
          reader.onload = function(e) {
              const imageProfile = e.target.result;
              myUser.style.backgroundImage = `url(${imageProfile})`;
              // Send the image to the server
              saveProfileImage(imageProfile);
          };
          reader.readAsDataURL(file);
      });
  
      selectProfileImage.addEventListener('change', function(event) {
          const selectProfileImage = event.target.value;
          myUser.style.backgroundImage = `url(${selectProfileImage})`;
          // Send the selected image to the server
          saveProfileImage(selectProfileImage);
      });
  
      function fetchUserData() {
          fetch('/wallpaper/load',{
              method: 'GET',
          })
          .then(response => {
              if (!response.ok) {
                  console.error('Failed to retrieve user data');
                  return;
              }
              return response.json();
          })
          .then(data => {
              const imageProfile = data.imageProfile;
              if (imageProfile) {
                  // Criar ou modificar o conteúdo do pseudo-elemento ::before
                  const style = document.createElement('style');
                  style.innerHTML = `#my-user::before { content: '${imageProfile}'; }`;
                  document.head.appendChild(style);
              }
          })
          .catch(error => console.error('Error fetching user data:', error));
      }
  
      // Chamar a função para buscar os dados do usuário ao carregar o documento
      fetchUserData();
  
  })