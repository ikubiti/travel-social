const signupForm = document.querySelector('.signup-form');


const signupFormHandler = async (event) => {
	event.preventDefault();

	const password = document.querySelector('#password').value.trim();
	const confirmPassword = document.querySelector('#confirmPassword').value.trim();

	if (!(password === confirmPassword)) {
		alert('Passwords do not match');
		return;
	}

	const newRegistration = new FormData(signupForm);
	const response = await fetch('/api/users', {
		method: 'POST',
		body: newRegistration,
	});

	if (response.ok) {
		document.location.replace('/profile');
	} else {
		alert(response.statusText);
	}
};


signupForm.addEventListener('submit', signupFormHandler);
