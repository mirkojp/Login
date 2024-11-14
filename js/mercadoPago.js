// function getCookie(name) {
//     let cookieValue = null;
//     if (document.cookie && document.cookie !== '') {
//         const cookies = document.cookie.split(';');
//         for (let i = 0; i < cookies.length; i++) {
//             const cookie = cookies[i].trim();
//             if (cookie.substring(0, name.length + 1) === (name + '=')) {
//                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                 break;
//             }
//         }
//     }
//     return cookieValue;
// }

// fetch('/get_token/')
//     .then(response => response.json())
//     .then(data => {
//         const csrfToken = data.csrf_token;
//         // Use the csrfToken in subsequent requests
//     })
//     .catch(error => console.error('Error:', error));

// // const csrftoken = getCookie('csrftoken');
// console.log(csrftoken)
// // Inicializa el SDK de MercadoPago con tu clave pública

// const mp = new MercadoPago('APP_USR-61f3d47d-4634-4a02-9185-68f2255e63c2'); 

// // Obtén el preferenceId desde Django
// fetch('https://practica-django-fxpz.onrender.com/create_preference/', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//         'X-CSRFToken': csrfToken,
//     },
//     credentials: 'include',
// })
//     .then(response => response.json())
//     .then(data => {
//         const preferenceId = data.preference_id;

//         // Carga el widget de Wallet con el preferenceId
//         mp.bricks().create("wallet", "wallet_container", {
//             initialization: {
//                 preferenceId: preferenceId
//             },
//             customization: {
//                 texts: {
//                     valueProp: 'smart_option',
//                 },
//             },
//         }).then(() => {
//             console.log("Widget de Wallet cargado correctamente");
//         }).catch(error => {
//             console.error("Error al cargar el widget de Wallet:", error);
//         });
//     });

// Function to fetch CSRF token from backend
function fetchCsrfToken() {
    return fetch('https://practica-django-fxpz.onrender.com/get_token/')
        .then(response => response.json())
        .then(data => data.csrf_token)
        .catch(error => {
            console.error('Error fetching CSRF token:', error);
            return null;
        });
}

// Initialize MercadoPago SDK with your public key
const mp = new MercadoPago('APP_USR-61f3d47d-4634-4a02-9185-68f2255e63c2');

// Fetch the CSRF token and then use it for creating the preference
fetchCsrfToken().then(csrfToken => {
    if (!csrfToken) {
        console.error("CSRF token could not be fetched.");
        return;
    }

    // Now use the CSRF token to create the MercadoPago preference
    fetch('https://practica-django-fxpz.onrender.com/create_preference/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken, // Use the fetched CSRF token here
        },
        credentials: 'include',
    })
        .then(response => response.json())
        .then(data => {
            const preferenceId = data.preference_id;

            // Load the Wallet widget using the preferenceId
            mp.bricks().create("wallet", "wallet_container", {
                initialization: {
                    preferenceId: preferenceId
                },
                customization: {
                    texts: {
                        valueProp: 'smart_option',
                    },
                },
            }).then(() => {
                console.log("Wallet widget loaded successfully");
            }).catch(error => {
                console.error("Error loading Wallet widget:", error);
            });
        })
        .catch(error => {
            console.error('Error creating preference:', error);
        });
});
