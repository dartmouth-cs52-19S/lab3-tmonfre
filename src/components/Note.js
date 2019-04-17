import React from 'react';
import Draggable from 'react-draggable';

export default class Note extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			position: {
				x: this.props.note.x,
				y: this.props.note.y,
			},
		};

		console.log(this.state.position);
	}

	render() {
		return (
			<Draggable
				handle=".fa-arrows-alt"
				defaultPosition={{ x: 20, y: 20 }}
				position={this.state.position}
				onDrag={this.onDrag}
			>
				<div className="note" style={{ zIndex: this.props.note.zIndex }}>
					<div className="title-bar">
						<p>{this.props.note.title}</p>
						<div className="icons">
							<i className="fas fa-edit" onClick={this.onEditClick} role="button" tabIndex={0} />
							<i className="fas fa-trash" onClick={this.onDeleteClick} role="button" tabIndex={0} />
							<i className="fas fa-arrows-alt" role="button" tabIndex={0} />
						</div>
					</div>
					<div className="bar" />
					<div className="note-content">
						<p>{this.props.note.text}</p>
						<img src="http://i.giphy.com/gyRWkLSQVqlPi.gif" alt="gif" />
					</div>
				</div>

			</Draggable>
		);
	}

	onEditClick = () => {
		console.log(`edit: ${this.props.note.id}`);
	}

	onDeleteClick = () => {
		console.log(`delete: ${this.props.note.id}`);
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
