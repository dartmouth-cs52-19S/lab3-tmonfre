import React from 'react';
import Draggable from 'react-draggable';
import marked from 'marked';
import ReactTooltip from 'react-tooltip';

export default class Note extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			position: {
				x: this.props.note.x,
				y: this.props.note.y,
			},
			isEditing: this.props.note.isEditing,
			editTitle: this.props.note.title,
			editText: this.props.note.text,
			zIndex: this.props.note.zIndex,
		};
	}

	render() {
		return (
			<div>
				{this.renderNote()}
			</div>
		);
	}

	renderNote() {
		if (this.props.user) {
			if (this.props.user.uid === this.props.note.userID) {
				if (this.state.isEditing) {
					return (
						<Draggable
							handle=".title-bar p"
							position={this.state.position}
							onDrag={this.onDrag}
						>
							<div className="note" style={{ zIndex: this.state.zIndex }}>
								<div className="title-bar">
									<textarea name="message" rows="1" cols="28" value={this.state.editTitle} onChange={this.updateEditTitle} />
									<div className="icons">
										{this.renderIcons()}
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
							handle=".title-bar p"
							position={this.state.position}
							onStart={this.onStartDrag}
							onDrag={this.onDrag}
							onStop={this.onStopDrag}
						>
							<div className="note" style={{ zIndex: this.state.zIndex }} onClick={this.onNoteClick} role="button" tabIndex={0}>
								<div className="title-bar">
									<p>{this.props.note.title}</p>
									<div className="icons">
										{this.renderIcons()}
									</div>
								</div>
								<div className="bar" />
								<div className="note-content" dangerouslySetInnerHTML={{ __html: marked(this.props.note.text || '') }} />
							</div>
						</Draggable>
					);
				}
			} else {
				return (
					<Draggable disabled position={this.state.position}>
						<div className="note" style={{ zIndex: this.state.zIndex }} onClick={this.onNoteClick} role="button" tabIndex={0}>
							<div className="title-bar">
								<p>{this.props.note.title}</p>
								<div className="icons">
									{this.renderIcons()}
								</div>
							</div>
							<div className="bar" />
							<div className="note-content" dangerouslySetInnerHTML={{ __html: marked(this.props.note.text || '') }} />
						</div>
					</Draggable>
				);
			}
		} else {
			return (
				<Draggable disabled position={this.state.position}>
					<div className="note" style={{ zIndex: this.state.zIndex }} onClick={this.onNoteClick} role="button" tabIndex={0}>
						<div className="title-bar">
							<p>{this.props.note.title}</p>
							<div className="icons">
								{this.renderIcons()}
							</div>
						</div>
						<div className="bar" />
						<div className="note-content" dangerouslySetInnerHTML={{ __html: marked(this.props.note.text || '') }} />
					</div>
				</Draggable>
			);
		}
	}

	renderIcons() {
		if (this.props.user) {
			if (this.props.user.uid === this.props.note.userID) {
				return (
					<div>
						<i className="fas fa-edit" onClick={this.onEditClick} role="button" tabIndex={0} />
						<i className="fas fa-trash" onClick={this.onDeleteClick} role="button" tabIndex={0} />
					</div>
				);
			} else {
				const dataTipValue = this.props.note.isEditing ? `Currently editing: ${this.props.note.displayName}` : `Created by: ${this.props.note.displayName}`;
				return (
					<div>
						<i className="fas fa-lock" data-tip={dataTipValue} />
						<ReactTooltip />
					</div>
				);
			}
		} else {
			const dataTipValue = this.props.note.isEditing ? `Currently editing: ${this.props.note.displayName}` : `Created by: ${this.props.note.displayName}`;
			return (
				<div>
					<i className="fas fa-lock" data-tip={dataTipValue} />
					<ReactTooltip />
				</div>
			);
		}
	}

	onEditClick = () => {
		// clear out changes if they didn't want to save (i.e. was editing and requested to stop)
		if (this.state.isEditing) {
			this.setState({
				editTitle: this.props.note.title,
				editText: this.props.note.text,
			});
		}

		// swap editing states
		this.props.setNoteEditingState(this.props.note.id, !this.state.isEditing);
	}

	// update note content and render note
	onSubmitEditClick = () => {
		this.props.updateNoteContent(this.props.note.id, this.state.editText, this.state.editTitle);
		this.setState({
			isEditing: false,
		});

		this.props.setNoteEditingState(this.props.note.id, false);
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

	// move the note to the top when the user drags/moves it
	onStartDrag = (e, ui) => {
		this.setState({
			zIndex: this.props.getTopZIndex(this.state.zIndex),
		});
	}

	// update local position as the user drags, but don't propogate to firebase (in case poor network connection)
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

	// when user chooses a final location, update the note's position in firebase (one time)
	onStopDrag = (e, ui) => {
		setTimeout(() => {
			this.props.updateNotePosition(this.props.note.id, ui.lastX, ui.lastY, this.state.zIndex);
		}, 0);
	}
}
