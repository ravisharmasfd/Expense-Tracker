const form = document.querySelector('form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submit-btn');

form.addEventListener('submit', async(event) => {
	event.preventDefault();
	try {
		const res = await axios.post('/api/auth/signin',{
			email: emailInput.value,
			password: passwordInput.value,
		})
		console.log(res)
		if (res.status === 200) {
			localStorage.setItem('token',res.data.token)
			alert("Sign in Successfully")
			window.location.href = '/';
			}
	} catch (error) {
		if (error.response.status === 401) {
			alert("Check your password");
		  } else if (error.response.status === 500) {
			alert('Server error. Please try again later.');
		  }else if (error.response.status === 404) {
			alert('User not found.');
		  }else if (error.response.status === 400) {
			alert('Check your credential');
		  }
	}
});
window.addEventListener('load', () => {
    try {
		const token  = localStorage.getItem('token');
		if (token) {
			window.location.href = '/';
			}
    } catch (error) {
      console.error(error);
    }
  });
