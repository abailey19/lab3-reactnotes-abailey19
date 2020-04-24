/* eslint-disable react/button-has-type */
import React from 'react';
import * as db from '../services/datastore';

class AddNoteBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
    };
  }

  onInputChange = (event) => {
    this.setState({ title: event.target.value });
  }

  onButtonClick = () => {
    db.addNote(this.state.title, this.props.onSubmit);
    this.setState({ title: '' });
  }

  render() {
    return (
      <div>
        <input placeholder="New Note Title" onChange={this.onInputChange} value={this.state.title} />
        <button onClick={this.onButtonClick}>Submit</button>
      </div>
    );
  }
}

export default AddNoteBar;
