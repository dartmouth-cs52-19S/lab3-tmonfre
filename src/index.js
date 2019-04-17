import React from 'react';
import ReactDOM from 'react-dom';
import { Map } from 'immutable';
import InsertNote from './components/InsertNote';
import Note from './components/Note';
import './style.scss';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			notes: new Map(),
			currentID: 0,
			maxZIndex: 10000,
		};
	}

	// TEMP: build some basic notes
	componentDidMount() {
		for (let i = 0; i < 5; i += 1) {
			const note = {
				title: `note asdfasda #${i}`,
				text: 'my note text goes here! and I can add lots and lots and lots to this ![](http://i.giphy.com/gyRWkLSQVqlPi.gif)',
				id: i,
				x: Math.floor(Math.random() * Math.floor(window.innerWidth) / 4),
				y: Math.floor(Math.random() * Math.floor(window.innerHeight / 4)),
				zIndex: 0,
			};

			this.setState(prevState => ({
				notes: prevState.notes.set(i, note),
				currentID: i + 1,
			}));
		}
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

	displayNotes = () => {
		return this.state.notes.entrySeq().map(([id, note]) => {
			return <Note key={id} id={id} note={note} deleteNote={this.deleteNote} updateText={this.updateText} getZIndex={this.getZIndex} />;
		});
	}

	addNote = (title, text = '') => {
		const id = this.state.currentID + 1;
		const note = {
			title,
			text,
			id,
			x: Math.floor(Math.random() * Math.floor(window.innerWidth / 4)),
			y: Math.floor(Math.random() * Math.floor(window.innerHeight / 4)),
			zIndex: 0,
		};

		this.setState(prevState => ({
			notes: prevState.notes.set(id, note),
			currentID: id,
		}));
	}

	deleteNote = (id) => {
		this.setState(prevState => ({
			notes: prevState.notes.delete(id),
		}));
	}

	updateText = (id, text, title) => {
		const fields = { text, title };
		this.setState(prevState => ({
			notes: prevState.notes.update(id, (n) => { return Object.assign({}, n, fields); }),
		}));
	}

	getZIndex = () => {
		const { maxZIndex } = this.state;
		this.setState({
			maxZIndex: maxZIndex + 1,
		});

		return maxZIndex;
	}
}

ReactDOM.render(<App />, document.getElementById('main'));
