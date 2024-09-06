(async () => {
    const response = await fetch('http://localhost:4000/session', {
        method: 'GET',
        credentials: 'include' // Importante para enviar las cookies de sesión
    })

    console.log({ response })


    if (response.ok) {
        const data = await response.json();
        document.getElementById('user-name').innerText = data.user.username;
    } else {
        // Redirigir al usuario a la página de inicio de sesión
        window.location.href = 'index.html';
    }
})();


// Manejar el cierre de sesión
document.getElementById('logout').addEventListener('click', async () => {
    const response = await fetch('http://localhost:4000/logout', {
        method: 'POST',
        credentials: 'include'
    })
    
    if (!response.ok) {
        throw new Error('Error al cerrar sesión');
    } else {
        window.location.href = 'index.html';
    }
});

document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Validación básica
    if (!username || !password) {
        document.getElementById('message').innerText = 'Por favor, completa todos los campos.';
        return;
    }

    try {
        const response = await fetch('http://localhost:4000/login', {
            method: 'POST',
            credentials: 'include', // Importante para enviar las cookies de sesión
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        
        if(!response.ok) {
            divError.innerText = 'Credenciales inválidas';
            divError.classList.add('bg-danger', 'text-white', 'text-center', 'rounded', 'p-2', 'mt-3');
            
            setTimeout(() => {
                divError.hidden = true;
            }, 3500);
            
            return;
        }
        
        const data = await response.json();
        console.log(data);
        window.location.href = 'home.html';
        
    } catch (error) {

    }
});