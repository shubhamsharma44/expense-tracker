async function submitForm(event) { 
    const signupMsg = document.getElementById('signupMsg')
    event.preventDefault();
    const userDetails = {
        name:event.target.name.value,
        email:event.target.email.value,
        password:event.target.password.value
    }
    try {
        const response= await axios.post(`http://localhost:8000/user/signup`,userDetails);
        signupMsg.textContent = 'Sign up successful!';
        event.target.reset();
        alert('Sign up successful!')
    }
    catch(error){
        console.log(error);
        signupMsg.textContent = 'Sign up failed. Please try again.';
        alert('Sign up failed!')
    }
}
