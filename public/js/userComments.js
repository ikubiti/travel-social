const newCommentEl = document.getElementById("newComment");
const commentTextEl = document.querySelector('#comment-text');
const tripCommentsEl = document.querySelector("#trip-comments");
const tripIndex = tripCommentsEl.getAttribute('data-trip');
const updateCommentEl = document.getElementById("updateComment");
const cancelCommentEl = document.getElementById("cancelComment");

const updatedComment = {
	commentId: '',
	location: ''
};

// Process the submission of new comments
newCommentEl.onclick = async (event) => {
	event.preventDefault();
	const newComment = commentTextEl.value.trim();
	// Return if the comment is empty
	if (newComment.length === 0) return;

	// generate random location for now, to be updated later
	const tripLocation = Math.floor(Math.random() * 15) + 1;

	// Create a new comment and send the post request.
	const addComment = {
		tripIndex: tripIndex,
		comment: newComment,
		location: tripLocation,
	};

	console.log(addComment);

	// send the add new comment request
	const response = await fetch('/api/comments/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(addComment),
	});

	if (response.ok) {
		await response.json();
		location.reload();
	} else {
		alert('Failed to add new comment!');
	}
};

tripCommentsEl.addEventListener("click", async (event) => {
	const element = event.target;
	const elementId = element.getAttribute('id');
	let commentStat = elementId === 'update' || elementId === 'delete';
	if (!commentStat) {
		return;
	}


	commentStat = element.parentElement.getAttribute('data-number');
	if (elementId === 'delete') {
		await deleteComment(commentStat);
	} else {
		let index = element.parentElement.getAttribute('data-comment');
		let location = element.parentElement.getAttribute('data-location');
		await updateComment(commentStat, index, location);
	}
});


// Update the comment
const updateComment = async (commentId, index, location) => {
	const commentIndex = 'comment' + index;
	commentTextEl.value = document.getElementById(commentIndex).textContent;
	updatedComment.commentId = commentId;
	updatedComment.location = location;
	newCommentEl.style.display = "none";
	document.getElementById("update").style.display = 'none';
	document.getElementById("delete").style.display = 'none';
	updateCommentEl.style.display = "inline-block";
	cancelCommentEl.style.display = "inline-block";
};

// Delete a comment
const deleteComment = async (commentId) => {
	const response = await fetch(`/api/comments/${commentId}`, {
		method: 'DELETE',
	});

	if (response.ok) {
		location.reload();
	} else {
		displayError('Failed to add delete the comment!');
	}
};

cancelCommentEl.onclick = (event) => {
	location.reload();
};

// Process the submission of updated comments
updateCommentEl.onclick = async (event) => {
	event.preventDefault();
	let newComment = commentTextEl.value.trim();
	// Return if the comment is empty
	if (newComment.length === 0) return;

	// Create a new comment and send the post request.
	const newNote = {
		tripIndex: tripIndex,
		comment: newComment,
		location: updatedComment.location,
		date: new Date().toISOString(),
	};

	// send the update request
	const response = await fetch(`/api/comments/${updatedComment.commentId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(newNote),
	});

	// If successful, update the browser to display the new comments
	if (response.ok) {
		await response.json();
		location.reload();
	} else {
		displayError('Failed to update the comment!');
	}
};