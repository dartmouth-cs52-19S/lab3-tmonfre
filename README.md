# Thomas Monfre CS52 Lab 3 📝

## What I Did
For this assignment, I built a live notetaking app that is hosted at [cs52-react-notes.surge.sh](http://cs52-react-notes.surge.sh). Users can create notes, move them around, edit them, and delete them. Persistent storage and update of notes is hosted with Firebase. The notes have markdown support for text/visual content.

## What Worked / Didn't Work
I started by working locally, allowing a user to create notes in a session, but not store them in Firebase. To do so, I began by thinking about the component hierarchy of the project. I knew I needed to make a component for adding a new note, and I knew I needed a component for each note. I also knew I would need an `App` component to both render these components and hold in state all the notes. This baseline hierarchy made sense, as the `App` component can hold and render all the `Note` components, and the `InserNote` component can pass the information about a new note up to `App`. This meant data on each note would be stored in the state for `App`. Thinking about this component hierarchy before building the project proved very useful, as I began the development process with a plan in mind.

After I had this system working, I then implemented Firebase as a backend and added a `datastore` module for handling all backend interactions. Doing so required a bit of refactoring components, but my initial plan still stayed intact. 

Having a plan worked well for this project as well as testing and thinking out different options. In terms of what didn't work so well, I struggled a bit with getting the app to re-render after changes were made in Firebase. I eventually understood the point of the callback function after receiving a change to the snapshot from Firebase, and then was okay moving forward.

## Extra Credit

### User Authentication
Users can login with Google or provide an email and password. Doing so allows them to create and edit notes. If a user is not logged in, they can only see all the notes. They cannot move, edit, or create notes. Once a user logs in, they can only move and edit notes they previously created. They can also make as many notes as they want.

### Undo Changes
I added an undo button that allows users to undo moves/edits to notes in real-time. After making a few modifications to a note, click the undo button to go back to the previous state.

### Z Index
When you click on a note to drag it around, it is automatically brought to the top z index level of the app. This ensures whenever you drag an app around, it is always on the top level.