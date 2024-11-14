// Inicializa el SDK de MercadoPago con tu clave pública
const mp = new MercadoPago('APP_USR-61f3d47d-4634-4a02-9185-68f2255e63c2'); // Reemplaza con tu clave pública

// Obtén el preferenceId desde Django
fetch('/create_preference/')
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
