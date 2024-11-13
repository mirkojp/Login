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
    fetch('https://practica-django-fxpz.onrender.com/usuarios/google/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Inicio de sesión exitoso con Google.");
            localStorage.setItem('userToken', data.Token);
            window.location.href = 'dashboard.html';
        } else {
            alert("Error en el inicio de sesión con Google.");
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
            fetch('https://practica-django-fxpz.onrender.com/usuarios/facebook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: accessToken })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("Inicio de sesión exitoso con Facebook.");
                    localStorage.setItem('userToken', data.Token);
                    window.location.href = 'dashboard.html';
                } else {
                    alert("Error en el inicio de sesión con Facebook.");
                }
            })
            .catch(error => console.error('Error en el inicio de sesión con Facebook:', error));
        } else {
            alert("No se pudo iniciar sesión con Facebook.");
        }
    }, { scope: 'public_profile,email' });
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
