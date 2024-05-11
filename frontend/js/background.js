document.addEventListener('DOMContentLoaded', function () {
    const chatContainer = document.querySelector('.Chat-Bot');
    const uploadInput = document.getElementById('upload');
    const selectBackground = document.getElementById('predefined-backgrounds');

    // Function to send the image to the server
    async function saveImageToServer(imageData) {
        // Implement the code to send the image to the server here
        try {
            const response = await fetch('/wallpaper/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    imageData
                })
            });
            const responseJson = await response.json();
            console.log("Image saved, notify the user", responseJson);
        } catch (e) {
            console.error("Error while saving an image", e.message);
        }
    }

    // Event listener for changing the image via the upload input
    uploadInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = e.target.result;
            chatContainer.style.backgroundImage = `url(${imageData})`;
            // Send the image to the server
            saveImageToServer(imageData);
        };
        reader.readAsDataURL(file);
    });

    // Event listener for changing the image via the predefined backgrounds select
    selectBackground.addEventListener('change', function(event) {
        const selectedBackground = event.target.value;
        chatContainer.style.backgroundImage = `url(${selectedBackground})`;
        // Send the selected image to the server
        saveImageToServer(selectedBackground);
    });

    // Function to fetch user data from the server upon document load
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
            const backgroundImageUrl = data.backgroundImageUrl;
            if (backgroundImageUrl) {
                chatContainer.style.backgroundImage = `url(${backgroundImageUrl})`;
            }
        })
        .catch(error => console.error('Error fetching user data:', error));
    }

    // Call the function to fetch user data upon document load
    fetchUserData();
});