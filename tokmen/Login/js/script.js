// Alterna la visibilidad de la contraseña
function togglePasswordVisibility(inputId, iconId) {
    const passwordField = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    if (passwordField.type === "password") {
        passwordField.type = "text";
        icon.src = "img/eye.png"; 
        icon.alt = "Ocultar contraseña";
    } else {
        passwordField.type = "password";
        icon.src = "img/hidden.png";
        icon.alt = "Mostrar contraseña";
    }
}

function handleGoogleSignIn(response) {
    const idToken = response.credential;

    // Envía el token de Google al backend para verificar el inicio de sesión
    fetch('https://practica-django-fxpz.onrender.com/usuarios/register_google/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Inicio de sesión exitoso con Google.");
            localStorage.setItem('userToken', data.token);
            window.location.href = 'dashboard.html';
        } else {
            alert("Error al registrarse con Google." + data.error + "!", data.success);
        }
    })
    .catch(error => console.error('Error en el inicio de sesión con Google:', error));
}

function loginGoogleSignIn(response) {
    const idToken = response.credential;

    console.log(idToken)

    // Envía el token de Google al backend para verificar el inicio de sesión
    fetch('https://practica-django-fxpz.onrender.com/usuarios/login_google/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Inicio de sesión exitoso con Google.");
            localStorage.setItem('userToken', data.token);
            window.location.href = 'dashboard.html';
        } else if (data.status == 400) {
            alert("Error en el inicio de sesión con Google." + data.error + "!", data.success);
            window.location.href = 'index.html';
        } else {
            alert("Error en el inicio de sesión con Google." + data.error + "!", data.success);
        }
    })
    .catch(error => console.error('Error en el inicio de sesión con Google:', error));
}

function loginWithFacebook() {
    FB.login(function(response) {
        if (response.status === 'connected') {
            const accessToken = response.authResponse.accessToken;

            console.log(accessToken)

            // Envía el token de Facebook al backend para verificar el inicio de sesión
            fetch('https://practica-django-fxpz.onrender.com/usuarios/login_facebook/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: accessToken })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("Inicio de sesión exitoso con Facebook.");
                    localStorage.setItem('userToken', data.token);
                    window.location.href = 'dashboard.html';
                } else {
                    alert("Error al iniciar sesion con Facebook." + data.error + "!");
                }
            })
            .catch(error => console.error('Error en el inicio de sesión con Facebook:', error));
        } else {
            alert("No se pudo iniciar sesión con Facebook.");
        }
    }, { scope: 'public_profile,email' });
}

function registerWithFacebook() {
    FB.login(function(response) {
        if (response.status === 'connected') {
            const accessToken = response.authResponse.accessToken;

            console.log(accessToken)

            // Envía el token de Facebook al backend para verificar el inicio de sesión
            fetch('https://practica-django-fxpz.onrender.com/usuarios/register_facebook/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: accessToken })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("Inicio de sesión exitoso con Facebook.");
                    localStorage.setItem('userToken', data.token);
                    window.location.href = 'dashboard.html';
                } else {
                    alert("Error en el inicio de sesión con Facebook." + data.error + "!");
                }
            })
            .catch(error => console.error('Error en el inicio de sesión con Facebook', error));
        } else {
            alert("No se pudo iniciar sesión con Facebook.");
        }
    }, { scope: 'public_profile,email' });
}


// Función para iniciar el proceso de autenticación con Twitter
async function loginWithTwitter() {
    try {
        // Llama a la API en tu backend para obtener el enlace de autenticación de Twitter
        const response = await fetch('https://practica-django-fxpz.onrender.com/auth/twitter/');
        const data = await response.json();

        if (data.authorization_url) {
            // Redirige al usuario a la URL de autenticación de Twitter
            window.location.href = data.authorization_url;
        } else {
            console.error("No se pudo obtener la URL de autorización.");
        }
    } catch (error) {
        console.error("Error al iniciar la autenticación con Twitter:", error);
    }
}

// Al cargar la página, verifica si existen 'oauth_token' y 'oauth_verifier' en la URL de callback
window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const oauthToken = urlParams.get('oauth_token');
    const oauthVerifier = urlParams.get('oauth_verifier');
    const errorIntegridad = urlParams.get('errorIntegridad');

    if (oauthToken && oauthVerifier) {
        // Si existen, envíalos al backend para completar el proceso de autenticación
        sendTwitterToken(oauthToken, oauthVerifier);
    }
    if (errorIntegridad) {
        alert("Ya existe una cuenta con estas credenciales.");
    }
};

// Función para enviar el token de autenticación a tu backend
async function sendTwitterToken(oauthToken, oauthVerifier) {
    try {
        const response = await fetch('https://practica-django-fxpz.onrender.com/auth/twitter/callback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                oauth_token: oauthToken,
                oauth_verifier: oauthVerifier,
            }),
        });

        const data = await response.json();
        if (data.success) {
            alert("Inicio de sesión exitoso con Twitter.");
            localStorage.setItem('userToken', data.token);
            window.location.href = 'dashboard.html';
        } else {
            alert("Error en la autenticación:", data.error);
        }
    } catch (error) {
        alert("Error en la autenticacion")
    }
}

async function loginWithGitHub() {
    try {
        console.log("asd")
        // Llama a la ruta de autenticación en el backend
        const response = await fetch('https://practica-django-fxpz.onrender.com/auth/github/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            //redirect: 'follow'
        });

        const data = await response.json();  // Asumimos que la respuesta está en formato JSON

        if (data.url) {
            // Redirige al usuario a la URL de autorización de GitHub
            window.location.href = data.url;
        } else {
            console.error("No se pudo iniciar la autenticación con GitHub");
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const nombre = document.getElementById('username').value;
            const contacto = document.getElementById('telefono').value || null;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                alert("Las contraseñas no coinciden.");
                return;
            }

            // Validación del formato de contacto
            const contactoRegex = /^\+54\d{5}\d{6}$/;
            if (contacto && !contactoRegex.test(contacto)) {
                alert("El número de contacto debe estar en el formato: +54 seguido de 5 dígitos de código de área y 6 dígitos de número de teléfono.");
                return;
            }


            const data = { email, nombre, contacto, password };

            fetch('https://practica-django-fxpz.onrender.com/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.status === 201) {
                    return response.json();
                } else if (response.status === 409) {
                    throw new Error("El correo o nombre de usuario ya existe.");
                } else {
                    throw new Error("Error en la creación del usuario");
                }
            })
            .then(data => {
                console.log(data);
                alert(data.Mensaje);
                localStorage.setItem('userToken', data.Token);
                window.location.href = 'login.html';
            })
            .catch(error => {
                console.error('Error al registrar el usuario:', error);
                alert(error.message || "Hubo un problema al registrar el usuario.");
            });
        });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const credentials = { nombre: username, password };

            fetch('https://practica-django-fxpz.onrender.com/usuarios/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Credenciales incorrectas.");
                }
            })
            .then(data => {
                console.log("Usuario autenticado:", data);
                alert("Inicio de sesión exitoso.");
                localStorage.setItem('userToken', data.Token);
                window.location.href = 'dashboard.html';
            })
            .catch(error => {
                console.error('Error en el login:', error);
                alert("Usuario o contraseña incorrecta.");
            });
        });
    }
});
