import React from 'react';
import ReactDOM from 'react-dom';
import InsertNote from './components/InsertNote';
import NotesArea from './components/NotesArea';
import './style.scss';

const App = () => (
	<div>
		<InsertNote />
		<NotesArea />
	</div>
);

ReactDOM.render(<App />, document.getElementById('main'));
