import React from 'react';
import signInWithGoogleButton from './assets/google-signin.png';
import * as db from '../services/datastore';

const User = (props) => {
	const signInWithGoogle = () => {
    	db.signInWithGoogle()
    	.then((user) => {
    		props.setUser(user);
    	});
	};
	if (props.user) {
		return (
			<div id="user-info">
				<h1>Welcome to React Notes!</h1>
				<h3>{`Hello ${props.user.displayName || props.user.email}!`}</h3>
				<p>Click on the note titles to drag them around, and insert new notes below. You can only edit notes you've created!</p>
				<p>Click <span className="auth-button" onClick={props.signOut} role="button" tabIndex={0}>here</span> to sign out.</p>
			</div>
		);
	} else {
		return (
			<div id="user-info">
				<h1>Welcome to React Notes!</h1>
				<h3>Looks like you're not signed in.</h3>
				<img src={signInWithGoogleButton} alt="sign in with google" onClick={signInWithGoogle} />
				<p>You can also click <span className="auth-button" onClick={props.signIn} role="button" tabIndex={0}>here</span> to create an account and add notes!</p>
				<div className="bar" />
			</div>
		);
	}
};

export default User;
