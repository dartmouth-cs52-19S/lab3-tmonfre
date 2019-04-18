import React from 'react';
import ReactDOM from 'react-dom';
import { Map } from 'immutable';
import InsertNote from './components/InsertNote';
import Note from './components/Note';
import './style.scss';

import * as db from './services/datastore';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			notes: new Map(),
			maxZIndex: 0,
		};
	}

	// grab notes from firebase and store in state
	componentDidMount() {
		db.fetchNotes((notes) => {
			// clear map
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
				<InsertNote addNote={this.addNote} />
				<div id="notes-area">
					{this.displayNotes()}
				</div>
			</div>
		);
	}

	// construct Note objects
	displayNotes = () => {
		return this.state.notes.entrySeq().map(([id, note]) => {
			return <Note key={id} id={id} note={note} deleteNote={db.deleteNote} updateNoteContent={db.updateNoteContent} updateNotePosition={db.updateNotePosition} getZIndex={this.getZIndex} />;
		});
	}

	// add a note to the screen (currently does not add to firebase)
	addNote = (title, text = '') => {
		const note = {
			title,
			text,
			id: Math.random().toString(36).substring(7), // random string adapted from: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
			x: Math.floor(Math.random() * Math.floor(window.innerWidth / 4)),
			y: Math.floor(Math.random() * Math.floor(window.innerHeight / 4)),
			zIndex: this.getZIndex(this.state.maxZIndex),
		};

		db.addNote(note);
	}

	// returns a new z index integer that places the attached note above all others
	getZIndex = (curr) => {
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
