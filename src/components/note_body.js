import React from 'react';

class NoteBody extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      content: props.content,
    };
  }

  onInputChange = (event) => {
    this.setState({ content: event.target.value });
  }

  renderBody() {
    if (this.state.isEditing) {
      return <input onChange={this.onInputChange} value={this.state.content} />;
    } else {
      return <div>{this.state.content}</div>;
    }
  }

  render() {
    return (
      <div>
        {this.renderBody()}
      </div>
    );
  }
}

export default NoteBody;
