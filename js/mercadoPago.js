function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

// Inicializa el SDK de MercadoPago con tu clave pública

const mp = new MercadoPago('APP_USR-61f3d47d-4634-4a02-9185-68f2255e63c2'); 

// Obtén el preferenceId desde Django
fetch('https://practica-django-fxpz.onrender.com/create_preference/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
    },
})
    .then(response => response.json())
    .then(data => {
        const preferenceId = data.preference_id;

        // Carga el widget de Wallet con el preferenceId
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
            console.log("Widget de Wallet cargado correctamente");
        }).catch(error => {
            console.error("Error al cargar el widget de Wallet:", error);
        });
    });
