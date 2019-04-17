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
				<input type="text" value={this.state.title} onChange={this.onInputChange} onClick={this.selectText} />
				<button onClick={this.onAddNoteClick} type="submit">Add Note</button>
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
		console.log(`add a note with value ${this.state.title}`);
	}
}
