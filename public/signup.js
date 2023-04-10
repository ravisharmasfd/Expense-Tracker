const form = document.querySelector('form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const nameInput = document.getElementById('name')
const submitBtn = document.getElementById('submit-btn');

form.addEventListener('submit', async(event) => {
	event.preventDefault();
	try {
		const res = await axios.post('/api/auth/signup',{
			email: emailInput.value,
			password: passwordInput.value,
			name: nameInput.value
		})
		if (res.status === 200) {
			alert(res.data.message)
			window.location.href = '/';
			}
	} catch (error) {
		if (error.response.status === 400) {
			alert('User already exists with this email address!');
		  } else if (error.response.status === 500) {
			alert('Server error. Please try again later.');
		  }
	}
});
2