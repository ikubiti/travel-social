const tripCreateForm = document.querySelector('.tripCreate-form');


const tripCreateFormHandler = async (event) => {
	event.preventDefault();

	const newTrip = new FormData(tripCreateForm);
	const response = await fetch('/api/trips', {
		method: 'POST',
		body: newTrip,
	});

	if (response.ok) {
		const aTrip = await response.json();
		document.location.replace(`/trips/${aTrip.id}`);
	} else {
		alert(response.statusText);
	}
};


tripCreateForm.addEventListener('submit', tripCreateFormHandler);