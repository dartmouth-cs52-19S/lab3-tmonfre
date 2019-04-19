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
	database.ref(`notes/${note.id}`).set(note);
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

export {
	fetchNotes, addNote, deleteNote, updateNoteContent, updateNotePosition,
};
