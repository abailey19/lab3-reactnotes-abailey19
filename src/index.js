import React from 'react';
import ReactDOM from 'react-dom';
import { Map } from 'immutable';

import './style.scss';

import AddNoteBar from './components/add_note_bar';
import Note from './components/note';

class App extends React.Component {
  constructor(props) {
    super(props);

    // // eslint-disable-next-line new-cap
    // const originalMap = Map();
    // const newMap = originalMap.set('1', { title: 'My Note' });
    // const newerMap = newMap.set('2', { title: 'Note 2' });

    this.state = {
      // eslint-disable-next-line new-cap
      notes: Map(),
      new_id: 1,
    };
  }

  addNote = (title) => {
    const newNote = {
      id: this.state.new_id,
      title,
      text: '',
      x: 0,
      y: 20,
      zIndex: 0,
    };
    this.setState((prevState) => ({
      notes: prevState.notes.set(prevState.new_id, newNote),
      new_id: prevState.new_id + 1,
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
    // console.log(this.state.notes);
    return (
      <div>
        <AddNoteBar id="search-bar" onSubmit={this.addNote} />
        {
          this.state.notes.entrySeq().map(([id, note]) => {
            return (<Note key={id} note={note} updateNote={this.updateNote} onDelete={this.deleteNote} />);
          })
        }
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('main'));
