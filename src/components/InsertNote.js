import React from 'react';

export default class InsertNote extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			title: '',
		};
	}

	render() {
		return (
			<div id="new-note-area">
				<h3>add note:</h3>
				<input id="new-note-input" type="text" value={this.state.title} onChange={this.onInputChange} onClick={this.selectText} onKeyUp={this.pressedEnter} />
				<button onClick={this.onAddNoteClick} type="submit">Add Note</button>
				<i className="fas fa-undo-alt" onClick={this.props.undoChanges} role="button" tabIndex={0} />
			</div>
		);
	}

	// select the text in the input bar when the user clicks in it
	selectText = (event) => {
		event.target.select();
	}

	// set state for input field
	onInputChange = (event) => {
		this.setState({
			title: event.target.value,
		});
	}

	// add a note to the screen
	onAddNoteClick = () => {
		this.props.addNote(this.state.title);
	}

	// if user presses enter in input field, add the note as if they pressed the button
	// adapted from: https://www.w3schools.com/howto/howto_js_trigger_button_enter.asp
	pressedEnter = (event) => {
		if (event.keyCode === 13) {
			this.onAddNoteClick();
		}
	}
}
