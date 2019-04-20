import firebase from 'firebase';

// set the configuration for the app
const config = {
	apiKey: 'AIzaSyDCEnVqd_S6_Ra7o4FelYKeeCN4iq_fwpE',
	authDomain: 'cs52-lab3-d6145.firebaseapp.com',
	databaseURL: 'https://cs52-lab3-d6145.firebaseio.com',
	projectId: 'cs52-lab3-d6145',
	storageBucket: 'cs52-lab3-d6145.appspot.com',
	messagingSenderId: '611703282057',
};

firebase.initializeApp(config);
const database = firebase.database();

// get all notes in the database
function fetchNotes(callback) {
	database.ref('notes').on('value', (snapshot) => {
		const newNoteState = snapshot.val();
		callback(newNoteState);
	});
}

// add a new note to firebase
function addNote(note) {
	// add the note and have firebase generate a unique id
	database.ref('notes').push(note)
		.then((added) => {
			// add the unique id into the note so we can store it
			database.ref(`notes/${added.key}`).update({
				id: added.key,
			});
		}).catch((err) => {
			console.error(err);
		});
}

// remove a note from firebase
function deleteNote(id) {
	firebase.database().ref(`notes/${id}`).remove();
}

// update the title and text of a note in firebase
function updateNoteContent(id, text, title) {
	database.ref(`notes/${id}`).update({
		text,
		title,
	});
}

function updateNotePosition(id, x, y, zIndex) {
	database.ref(`notes/${id}`).update({
		x,
		y,
		zIndex,
	});
}

// if the user chose to press undo, update the location of the notes in firebase
function resetNotes(notesToSet) {
	notesToSet.entrySeq().forEach(([id, note]) => {
		database.ref(`notes/${id}`).set(note);
	});
}

function signUp(email, password) {
	firebase.auth().createUserWithEmailAndPassword(email, password)
		.then(() => {
			return firebase.auth().currentUser;
		})
		.catch((error) => {
			return error;
		});
}

function signIn(email, password) {
	return new Promise((resolve, reject) => {
		firebase.auth().signInWithEmailAndPassword(email, password)
			.then(() => {
				resolve();
			})
			.catch((error) => {
				if (error.code === 'auth/user-not-found') {
					firebase.auth().createUserWithEmailAndPassword(email, password)
						.then(() => {
							resolve();
						})
						.catch((err) => {
							console.log(err);
							reject();
						});
				} else {
					console.log(error);
					reject();
				}
			});
	});
}

function getCurrentUser() {
	return firebase.auth().currentUser;
}

// promise syntax adapted from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
function signOut() {
	return new Promise((resolve, reject) => {
		firebase.auth().signOut()
			.then(() => {
				resolve();
			})
			.catch(() => {
				reject();
			});
	});
}

export {
	fetchNotes, addNote, deleteNote, updateNoteContent, updateNotePosition, resetNotes, signIn, signUp, signOut, getCurrentUser,
};
