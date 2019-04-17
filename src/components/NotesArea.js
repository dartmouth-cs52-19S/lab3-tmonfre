import React from 'react';
import { Map } from 'immutable';
import Note from './Note';

export default class NotesArea extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			notes: new Map(),
		};
	}

	// TEMP: build some basic notes
	componentDidMount() {
		for (let i = 0; i < 12; i += 1) {
			const note = {
				title: `note asdfasda #${i}`,
				text: 'my note text goes here! and I can add lots and lots and lots to this',
				id: i,
				x: Math.floor(Math.random() * 500),
				y: Math.floor(Math.random() * 500),
				zIndex: 0,
			};

			this.setState(prevState => ({
				notes: prevState.notes.set(i, note),
			}));
		}
	}

	render() {
		return (
			<div id="notes-area">
				{this.displayNotes()}
			</div>
		);
	}

	displayNotes = () => {
		return this.state.notes.entrySeq().map(([id, note]) => {
			// perhaps you might return some jsx here :-)
			// <Note id={id} note={note} ... for instance maybe
			return <Note key={id} id={id} note={note} />;
		});
	}
}
