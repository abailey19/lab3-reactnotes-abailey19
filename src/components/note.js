/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/button-has-type */
import React from 'react';
import Draggable from 'react-draggable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowsAlt, faTrashAlt, faPen, faCheck,
} from '@fortawesome/free-solid-svg-icons';
import marked from 'marked';
import TextareaAutosize from 'react-textarea-autosize';

// import NoteHeader from './note_header';
// import NoteBody from './note_body';

class Note extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.note.id,
      title: props.note.title,
      content: props.note.text,
      x_pos: props.note.x,
      y_pos: props.note.y,
      // note_width: 20,
      // note_height: 20,
      isEditing: false,
    };
  }

  handleDrag = (e, data) => {
    this.setState({ x_pos: data.x, y_pos: data.y });
  }

  onEdit = () => {
    this.setState((prevState) => ({
      isEditing: !prevState.isEditing,
    }));
  }

  onDelete = () => {
    this.props.onDelete(this.state.id);
  }

  renderEditButton = () => {
    if (this.state.isEditing) {
      return (
        <button onClick={this.onEdit}>
          <FontAwesomeIcon className="icon-button" icon={faCheck} />
        </button>
      );
    } else {
      return (
        <button onClick={this.onEdit}>
          <FontAwesomeIcon className="icon-button" icon={faPen} />
        </button>
      );
    }
  }

  onInputChange = (event) => {
    this.setState({ content: event.target.value });
    this.props.updateNote(this.state.id, { text: this.state.content });
  }

  renderBody() {
    if (this.state.isEditing) {
      return (
        // TextareaAutosize code taken from https://andreypopp.com/react-textarea-autosize/
        <TextareaAutosize
          useCacheForDOMMeasurements
          value={this.state.conent}
          onChange={this.onInputChange}
        />
      );
    } else {
      return <div className="noteBody" dangerouslySetInnerHTML={{ __html: marked(this.state.content || '') }} />;
    }
  }

  render() {
    return (
      <Draggable
        handle=".drag-icon"
        grid={[25, 25]}
        defaultPosition={{ x: 20, y: 20 }}
        position={{
          x: this.state.x_pos, y: this.state.y_pos, // width: this.state.note_width, height: this.state.note_height,
        }}
        onDrag={this.handleDrag}
      >
        <div className="note">
          {/* <NoteHeader className="header" title={this.props.note.title} /> */}
          <div className="note-header">
            <div className="header-left">
              <div className="note-title">
                {this.state.title}
              </div>
              <button onClick={this.onDelete}>
                <FontAwesomeIcon className="icon-button" icon={faTrashAlt} />
              </button>
              {this.renderEditButton()}
            </div>
            <FontAwesomeIcon className="drag-icon" icon={faArrowsAlt} />
          </div>
          {/* <NoteBody content={this.props.note.text} /> */}
          {this.renderBody()}
        </div>
      </Draggable>
    );
  }
}

export default Note;
