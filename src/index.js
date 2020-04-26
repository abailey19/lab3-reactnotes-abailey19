/* eslint-disable react/button-has-type */
/* eslint-disable new-cap */
import React from 'react';
import ReactDOM from 'react-dom';
import { Map } from 'immutable';
import firebase from 'firebase';

import './style.scss';
import AddNoteBar from './components/add_note_bar';
import Note from './components/note';
import * as db from './services/datastore';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: Map(),
      maxZIndex: 0,
      userID: null,
      loggedIn: false,
      loginEmail: '',
      loginPassword: '',
      signUpEmail: '',
      signUpPassword: '',
      loginError: null,
      signUpError: null,
    };

    // Auth code adapted from code I wrote for a React Native project
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ loggedIn: true, userID: user.uid });
        db.fetchNotes(user.uid, this.getNotes);
      } else {
        this.setState({ loggedIn: false });
      }
    });
  }

  // authUser code adapted from https://stackoverflow.com/questions/47376453/reactjs-how-to-wait-for-componentdidmount-to-finish-before-rendering
  componentDidMount() {
    this.authUser().then((user) => {
      this.setState({ userID: user.uid });
      db.fetchNotes(user.uid, this.getNotes);
    }).catch((error) => {
      console.log(error);
    });
  }

  authUser = () => {
    return new Promise(((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          resolve(user);
        } else {
          reject(Error('User not logged in'));
        }
      });
    }));
  }

  handleSignUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.signUpEmail, this.state.signUpPassword)
      .then()
      .catch((error) => this.setState({ signUpError: error.message }));
  }

  handleLogin = () => {
    firebase.auth().signInWithEmailAndPassword(this.state.loginEmail, this.state.loginPassword)
      .then()
      .catch((error) => this.setState({ loginError: error.message }));
  }

  handleSignOut = () => {
    firebase.auth().signOut();
  }

  getNotes = (notes) => {
    let maxZIndex = 0;
    if (notes) {
      Object.keys(notes).forEach((key) => {
        if (notes[key].zIndex > maxZIndex) {
          maxZIndex = notes[key].zIndex;
        }
      });
    }
    this.setState({ notes: Map(notes), maxZIndex: maxZIndex + 1 });
  }

  addNote = (id, note) => {
    this.setState((prevState) => ({
      notes: prevState.notes.set(id, note),
      maxZIndex: prevState.maxZIndex + 1,
    }));
  }

  updateNote = (id, fields) => {
    this.setState((prevState) => ({
      // eslint-disable-next-line prefer-object-spread
      notes: prevState.notes.update(id, (n) => { return Object.assign({}, n, fields); }),
    }));
  }

  deleteNote = (id) => {
    this.setState((prevState) => ({
      notes: prevState.notes.delete(id),
    }));
  }

  render() {
    if (this.state.loggedIn) {
      return (
        <div>
          <AddNoteBar id="search-bar" userID={this.state.userID} maxZIndex={this.state.maxZIndex} onSubmit={this.addNote} />
          {
            this.state.notes.entrySeq().map(([id, note]) => {
              return (
                <Note key={id}
                  userID={this.state.userID}
                  id={id}
                  note={note}
                  maxZIndex={this.state.maxZIndex}
                  updateNote={this.updateNote}
                  onDelete={this.deleteNote}
                />
              );
            })
          }
          <footer>
            <button className="auth-button" onClick={this.handleSignOut}>Sign Out</button>
          </footer>
        </div>
      );
    } else {
      return (
        <div className="auth-screen">
          <h1>Welcome to NoteBoard</h1>
          <h2>Login, or create a new account</h2>
          <div className="columns">
            <div className="column">
              <h3>Login</h3>
              {this.state.loginError
                && (
                <div style={{ width: '150px', paddingBottom: '10px' }}>
                  <div style={{ color: 'red' }}>
                    {this.state.loginError}
                  </div>
                </div>
                )}
              <input
                className="auth-input"
                autoCapitalize="none"
                placeholder="Email"
                onChange={(event) => this.setState({ loginEmail: event.target.value })}
                value={this.state.email}
              />
              <input
                className="auth-input"
                type="password"
                autoCapitalize="none"
                placeholder="Password"
                onChange={(event) => this.setState({ loginPassword: event.target.value })}
                value={this.state.password}
              />
              <button className="auth-button" onClick={this.handleLogin}>Login</button>
            </div>
            <div className="column">
              <h3>Sign Up</h3>
              {this.state.signUpError
                && (
                <p style={{ color: 'red' }}>
                  {this.state.signUpError}
                </p>
                )}
              <input
                className="auth-input"
                autoCapitalize="none"
                placeholder="Email"
                onChange={(event) => this.setState({ signUpEmail: event.target.value })}
                value={this.state.email}
              />
              <input
                className="auth-input"
                type="password"
                autoCapitalize="none"
                placeholder="Password"
                onChange={(event) => this.setState({ signUpPassword: event.target.value })}
                value={this.state.password}
              />
              <button className="auth-button" onClick={this.handleSignUp}>Sign Up</button>
            </div>
          </div>
        </div>
      );
    }
  }
}

ReactDOM.render(<App />, document.getElementById('main'));
