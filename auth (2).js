document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Show corresponding form
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${button.dataset.tab}Form`);
        });
    });
});

async function handleAuth(event, endpoint) {
    event.preventDefault();
    const form = event.target;
    const errorMessage = form.querySelector('.error-message');
    
    try {
        const response = await fetch(`/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: form.username.value,
                password: form.password.value
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            window.location.href = '/';
        } else {
            errorMessage.textContent = data.message || `${endpoint} failed`;
        }
    } catch (error) {
        errorMessage.textContent = 'An error occurred. Please try again.';
    }
}

document.getElementById('loginForm').addEventListener('submit', (e) => handleAuth(e, 'login'));
document.getElementById('registerForm').addEventListener('submit', (e) => handleAuth(e, 'register'));
