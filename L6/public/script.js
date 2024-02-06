async function loadImage(person, newCard) {
    return new Promise((resolve) => {
        // Get the profile picture element
        const profilePicture = newCard.querySelector('.profile-picture img');

        // Fetch the actual image
        const actualImage = new Image();
        actualImage.src = `/picture/${person}`;

        // Replace the placeholder with the actual image once it's loaded
        actualImage.onload = function () {
            // Check if the card still exists in the DOM
            if (document.body.contains(newCard)) {
                // Replace the placeholder image with the actual image
                profilePicture.src = actualImage.src;

                // Remove the 'loading' class only if the actual image is loaded successfully
                if (actualImage.width > 0 && actualImage.height > 0) {
                    profilePicture.parentElement.classList.remove('loading');
                }
            }

            // Resolve the Promise
            resolve();
        };

        // Resolve the Promise even if the image is not found
        actualImage.onerror = function () {
            // Remove the 'loading' class as the image is not found
            profilePicture.parentElement.classList.remove('loading');
            resolve();
        };
    });
}


async function loadCards() {
    // Enable loading screen
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.remove('hidden');

    // Fetch people.json
    try {
        const response = await fetch('/people.json');
        const data = await response.json();
        const people = JSON.parse(data);

        // For each person in the response, create a new card
        const cardsContainer = document.querySelector('.cards-container');
        const cardTemplate = document.getElementById('card-template');

        // Use Promise.all to wait for all promises to be resolved
        await Promise.all(people.map(async person => {
            // Clone the card template
            const newCard = cardTemplate.cloneNode(true);
            newCard.removeAttribute('id'); // Remove id to make it unique

            // Set the name in the card
            const nameElement = newCard.querySelector('.name');
            nameElement.textContent = person;

            // Append the new card to the container
            cardsContainer.appendChild(newCard);

            // Load the image for the person
            await loadImage(person, newCard);
        }));

        // When all images are loaded (or not found), disable the loading screen
        loadingScreen.classList.add('hidden');
    } catch (error) {
        console.error('Error loading cards:', error);
        loadingScreen.classList.add('hidden'); // Make sure loading screen is hidden in case of error
    }
}

window.onload = loadCards;
