import React from 'react';
import Draggable from 'react-draggable';
import marked from 'marked';

export default class Note extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			position: {
				x: this.props.note.x,
				y: this.props.note.y,
			},
			isEditing: false,
			editTitle: this.props.note.title,
			editText: this.props.note.text,
			zIndex: this.props.note.zIndex,
		};
	}

	render() {
		if (this.state.isEditing) {
			return (
				<Draggable
					handle=".fa-arrows-alt"
					position={this.state.position}
					onDrag={this.onDrag}
				>
					<div className="note" style={{ zIndex: this.state.zIndex }}>
						<div className="title-bar">
							<textarea name="message" rows="1" cols="28" value={this.state.editTitle} onChange={this.updateEditTitle} />
							<div className="icons">
								<i className="fas fa-edit" onClick={this.onEditClick} role="button" tabIndex={0} />
								<i className="fas fa-trash" onClick={this.onDeleteClick} role="button" tabIndex={0} />
							</div>
						</div>
						<div className="bar" />
						<div className="note-content editing">
							<textarea name="message" rows="20" cols="30" value={this.state.editText} onChange={this.updateEditText} />
							<br />
							<input type="submit" onClick={this.onSubmitEditClick} />
						</div>
					</div>
				</Draggable>
			);
		} else {
			return (
				<Draggable
					handle=".title-bar"
					position={this.state.position}
					onStart={this.onStartDrag}
					onDrag={this.onDrag}
				>
					<div className="note" style={{ zIndex: this.state.zIndex }}>
						<div className="title-bar">
							<p>{this.props.note.title}</p>
							<div className="icons">
								<i className="fas fa-edit" onClick={this.onEditClick} role="button" tabIndex={0} />
								<i className="fas fa-trash" onClick={this.onDeleteClick} role="button" tabIndex={0} />
							</div>
						</div>
						<div className="bar" />
						<div className="note-content" dangerouslySetInnerHTML={{ __html: marked(this.props.note.text || '') }} />
					</div>

				</Draggable>
			);
		}
	}

	onEditClick = () => {
		const { isEditing } = this.state;

		// clear out changes if they didn't want to save
		if (isEditing) {
			this.setState({
				editTitle: this.props.note.title,
				editText: this.props.note.text,
			});
		}

		// go into editing mode either way
		this.setState({
			isEditing: !isEditing,
		});
	}

	onSubmitEditClick = () => {
		this.props.updateText(this.props.note.id, this.state.editText, this.state.editTitle);
		this.setState({
			isEditing: false,
		});
	}

	updateEditText = (e) => {
		this.setState({
			editText: e.target.value,
		});
	}

	updateEditTitle = (e) => {
		this.setState({
			editTitle: e.target.value,
		});
	}

	onDeleteClick = () => {
		this.props.deleteNote(this.props.note.id);
	}

	onStartDrag = () => {
		// move the note to the top when the user drags/moves it
		this.setState({
			zIndex: this.props.getZIndex(),
		});
	}

	onDrag = (e, ui) => {
		if (ui.lastX >= 0 && ui.lastX <= window.innerWidth && ui.lastY >= 0 && ui.lastY <= window.innerHeight) {
			this.setState({
				position: {
					x: ui.lastX,
					y: ui.lastY,
				},
			});
		}
	}
}
