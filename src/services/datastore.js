import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyCFZ5t0LfGcJTP1IxbJ_Zw2iKj1u0Ez2Ys',
  authDomain: 'reactnotes-87114.firebaseapp.com',
  databaseURL: 'https://reactnotes-87114.firebaseio.com',
  projectId: 'reactnotes-87114',
  storageBucket: 'reactnotes-87114.appspot.com',
  messagingSenderId: '514279449933',
  appId: '1:514279449933:web:a0af7ecbe026af64210304',
  measurementId: 'G-LSWY3J2REN',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.database();

export function fetchNotes(userID, fetchCallback) {
  firebase.database().ref(`notes/${userID}`).on('value', (snapshot) => {
    const newNoteState = snapshot.val();
    fetchCallback(newNoteState);
  });
}

export function addNote(userID, title, zIndex, addCallback) {
  const newNote = {
    title,
    text: '',
    x: 0,
    y: 20,
    zIndex,
  };
  const newPostKey = database.ref().child(`notes/${userID}`).push().key;
  firebase.database().ref(`notes/${userID}`).child(newPostKey).update(newNote);
  addCallback(newPostKey, newNote);
}

export function updateNote(userID, id, fields, updateCallback) {
  firebase.database().ref(`notes/${userID}`).child(id).update(fields);
  updateCallback(id, fields);
}

export function deleteNote(userID, id, deleteCallback) {
  firebase.database().ref(`notes/${userID}`).child(id).remove();
  deleteCallback(id);
}
