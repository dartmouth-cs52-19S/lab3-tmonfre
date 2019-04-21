import React from 'react';
import '../style.scss';
import * as db from '../services/datastore';

export default class SignIn extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			email: '',
			password: '',
		};
	}

	// modal adapted from: https://www.w3schools.com/howto/howto_css_modals.asp
	render() {
		return (
			<div id="modal">
				<div id="sign-in">
					<span id="close" onClick={this.props.closeModal} role="button" tabIndex={0}>&times;</span>
					<p>Provide an email and password to login. If you don't have an account, we'll make you one!</p>
					<div className="bar" />
					<div id="inputs">
						<h3>Email</h3>
						<input value={this.state.email} onChange={this.emailChange} placeholder="email" />
						<h3>Password</h3>
						<input value={this.state.password} onChange={this.passwordChange} placeholder="password" type="password" />
						<br />
						<button onClick={this.signInOrCreateAccount} type="submit">Sign In/Create Account</button>
					</div>
				</div>
			</div>
		);
	}

	signInOrCreateAccount = () => {
		db.signIn(this.state.email, this.state.password)
			.then((user) => {
				this.props.setUser(user);
				this.props.closeModal();
			});
	}

	emailChange = (event) => {
		this.setState({
			email: event.target.value,
		});
	}

	passwordChange = (event) => {
		this.setState({
			password: event.target.value,
		});
	}
}
