import React from 'react';
import ReactDOM from 'react-dom';
import { Map, Stack } from 'immutable';
import InsertNote from './components/InsertNote';
import Note from './components/Note';
import User from './components/User';
import SignIn from './components/SignIn';
import './style.scss';

import * as db from './services/datastore';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			notes: new Map(),
			undoStack: new Stack(),
			maxZIndex: 0,
			signIn: false,
			user: db.getCurrentUser(),
		};
	}

	// grab notes from firebase and store in state
	componentDidMount() {
		db.fetchNotes((notes) => {
			// push old state to stack and clear notes
			this.setState({
				undoStack: this.state.undoStack.push(this.state),
				notes: new Map(),
				user: db.getCurrentUser(),
			}, () => {
				// maximum zIndex in the collection
				let max = this.state.maxZIndex;

				// add each note to map
				Object.keys(notes).forEach((key) => {
					// determine if we've found a higher zIndex
					if (notes[key].zIndex > max) { max = notes[key].zIndex; }

					// store the note
					this.setState(prevState => ({
						notes: prevState.notes.set(key, notes[key]),
					}));
				});

				// update the max zIndex for bring to front
				this.setState({
					maxZIndex: max,
				});
			});
		});
	}

	render() {
		return (
			<div>
				<div id="user-area">
					{this.state.signIn ? <SignIn closeModal={this.requestSignIn} setUser={this.setUser} /> : null}
					<User user={this.state.user} setUser={this.setUser} signIn={this.requestSignIn} signOut={this.requestSignOut} />
				</div>
				{this.state.user ? <InsertNote addNote={this.addNote} undoChanges={this.undoChanges} /> : null }
				<div id="notes-area">
					{this.displayNotes()}
				</div>
			</div>
		);
	}

	// construct Note components
	displayNotes = () => {
		return this.state.notes.entrySeq().map(([id, note]) => {
			return (
				<Note
					key={id}
					note={note}
					deleteNote={db.deleteNote}
					updateNoteContent={db.updateNoteContent}
					updateNotePosition={db.updateNotePosition}
					getTopZIndex={this.getTopZIndex}
					user={this.state.user}
				/>
			);
		});
	}

	setUser = (user) => {
		this.setState({
			user,
		});
	}

	requestSignIn = () => {
		this.setState({
			signIn: !this.state.signIn,
		});
	}

	requestSignOut = () => {
		db.signOut()
			.then(() => {
				this.setState({
					user: null,
					signIn: false,
				});
			});
	}

	// pop from the stack, and return user to previous state
	undoChanges = () => {
		const prevState = this.state.undoStack.pop();

		// as long as there is something to pop
		if (prevState._head) {
			// update the stack then reset the notes in firebase
			this.setState({
				undoStack: prevState._head.value.undoStack,
			}, () => {
				db.resetNotes(prevState._head.value.notes);
			});
		}
	}

	// add a note to the screen and pick random location in user view to start with
	addNote = (title, text = '') => {
		const note = {
			title,
			text,
			x: Math.floor(Math.random() * Math.floor(window.innerWidth / 4)),
			y: Math.floor(Math.random() * Math.floor(window.innerHeight / 4)),
			zIndex: this.getTopZIndex(this.state.maxZIndex),
			userID: this.state.user.uid,
		};

		db.addNote(note);
	}

	// returns a new z index integer that places the attached note above all others
	getTopZIndex = (curr) => {
		if (curr <= this.state.maxZIndex) {
			const { maxZIndex } = this.state;
			this.setState({
				maxZIndex: maxZIndex + 1,
			});
			return maxZIndex + 1;
		} else {
			return curr;
		}
	}
}

ReactDOM.render(<App />, document.getElementById('main'));
