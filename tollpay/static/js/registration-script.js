// Password visibility toggle logic
document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordField = document.getElementById('password');
    const type = passwordField.type === "password" ? "text" : "password";
    passwordField.type = type;

    // Toggle eye icon class
    this.classList.toggle('fa-eye-slash');
});

// Registration form submission logic
document.querySelector('.registration-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent default form submission behavior

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const licenseNumber = document.getElementById('license_number').value;
    const password = document.getElementById('password').value; 

    if (username && email && licenseNumber && password) {
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, license_number: licenseNumber, password })
            });

            const result = await response.json();
            console.log('Response:', result); // Debugging line

            if (response.ok) {
                // Show the popup
                const popupContainer = document.getElementById('popupContainer');
                popupContainer.style.display = 'flex';

                // Add event listener to "Go to Login" button
                document.getElementById('goToLogin').addEventListener('click', function () {
                    window.location.href = 'login.html'; // Redirect to login page
                });
            } else {
                console.error('Error:', result.error); // Log the error to the console
                alert(result.error);
            }
        } catch (error) {
            console.error('Error:', error); // Log the error to the console
            alert('An error occurred. Please try again.');
        }
    } else {
        alert('Please fill in all the fields correctly.');
    }
});