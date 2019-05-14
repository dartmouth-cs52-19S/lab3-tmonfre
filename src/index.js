import React from 'react';
import ReactDOM from 'react-dom';
import { Map } from 'immutable';
import io from 'socket.io-client';

import InsertNote from './components/InsertNote';
import Note from './components/Note';
import './style.scss';

// const socketserver = 'http://localhost:9090';
const socketserver = 'https://cs52-websockets.herokuapp.com/';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			notes: new Map(),
			maxZIndex: 0,
		};

		this.socket = io(socketserver);
		this.socket.on('connect', () => { console.log('socket.io connected'); });
		this.socket.on('disconnect', () => { console.log('socket.io disconnected'); });
		this.socket.on('reconnect', () => { console.log('socket.io reconnected'); });
		this.socket.on('error', (error) => { console.log(error); });
	}

	// grab notes from firebase and store in state
	componentDidMount() {
		this.socket.on('notes', (notes) => {
			// push old state to stack and clear notes
			this.setState({
				notes: new Map(),
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
					<h1>Welcome to React Notes!</h1>
					<p>Click on the note titles to drag them around, and insert new notes below.</p>
				</div>
				<InsertNote addNote={this.addNote} />
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
					deleteNote={this.deleteNote}
					updateNoteContent={this.updateNoteContent}
					updateNotePosition={this.updateNotePosition}
					getTopZIndex={this.getTopZIndex}
				/>
			);
		});
	}

	deleteNote = (id) => {
		this.socket.emit('deleteNote', id);
	}

	updateNoteContent = (id, text, title) => {
		this.socket.emit('updateNote', id, { text, title });
	}

	updateNotePosition = (id, x, y, zIndex) => {
		this.socket.emit('updateNote', id, { x, y, zIndex });
	}

	// add a note to the screen and pick random location in user view to start with
	addNote = (title, text = '') => {
		const note = {
			title,
			text,
			x: Math.floor(Math.random() * Math.floor(window.innerWidth / 4)),
			y: Math.floor(Math.random() * Math.floor(window.innerHeight / 4)),
			zIndex: this.getTopZIndex(this.state.maxZIndex),
		};

		this.socket.emit('createNote', note);
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
