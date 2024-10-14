document.addEventListener('DOMContentLoaded', function() {
    const loginMsg = document.getElementById('loginMsg');

    document.getElementById('loginForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await axios.get(`http://localhost:8000/user/login/${email}/${password}` );
            console.log(response);
            localStorage.setItem('token' , response.data.token);
            alert('Login successful');
           window.location.href='../expense/expense.html';
        } catch (error) {
            console.error( error);
            if (error.response && error.response.status === 404) {
                loginMsg.textContent = 'Invalid email. Please try again.';
            } else if (error.response && error.response.status === 401) {
                loginMsg.textContent = 'User not authorized.';
            } else {
                loginMsg.textContent = 'An error occurred. Please try again.';
            }
            alert('An error occurred. Please try again.');
        }
    });
});

async function sendForm(){
    document.getElementById('emailForm').style.display='block';
}

async function submitEmailForm(event){
    event.preventDefault();
    const email = document.getElementById('emailForgt').value;

    try{
        const response = await axios.post(`http://localhost:8000/password/forgotpassword` , {email});
        
        alert('Reset email sent successfully!');
        document.getElementById('emailForm').style.display = 'none';
        document.getElementById('emailForgt').value='';
    }catch (error) {
        console.error('Error sending reset email:', error);
        alert('Failed to send reset email. Please try again.');
    }
}