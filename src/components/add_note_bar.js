/* eslint-disable react/button-has-type */
import React from 'react';

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
    this.props.onSubmit(this.state.title);
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
