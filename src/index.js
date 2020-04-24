/* eslint-disable new-cap */
import React from 'react';
import ReactDOM from 'react-dom';
import { Map } from 'immutable';

import './style.scss';
import AddNoteBar from './components/add_note_bar';
import Note from './components/note';
import * as db from './services/datastore';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: Map(),
    };
  }

  componentDidMount() {
    db.fetchNotes((notes) => {
      this.setState({ notes: Map(notes) });
    });
  }

  addNote = (id, note) => {
    this.setState((prevState) => ({
      notes: prevState.notes.set(id, note),
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
    console.log(this.state.notes);
    return (
      <div>
        <AddNoteBar id="search-bar" onSubmit={this.addNote} />
        {
          this.state.notes.entrySeq().map(([id, note]) => {
            return (<Note key={id} id={id} note={note} updateNote={this.updateNote} onDelete={this.deleteNote} />);
          })
        }
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('main'));
