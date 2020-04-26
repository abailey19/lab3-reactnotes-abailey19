/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/button-has-type */
import React from 'react';
import Draggable from 'react-draggable';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import DoneIcon from '@material-ui/icons/Done';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import marked from 'marked';
import TextareaAutosize from 'react-textarea-autosize';

import * as db from '../services/datastore';

class Note extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      title: props.note.title,
      content: props.note.text,
      isEditing: false,
    };
  }

  handleStartDrag = (e, data) => {
    db.updateNote(this.props.userID, this.state.id, { zIndex: this.props.maxZIndex + 1 }, this.props.updateNote);
  }

  handleDrag = (e, data) => {
    db.updateNote(this.props.userID, this.state.id, { x: data.x, y: data.y }, this.props.updateNote);
  }

  onEditClick = () => {
    this.setState((prevState) => ({
      isEditing: !prevState.isEditing,
    }));
    db.updateNote(this.props.userID, this.state.id, { text: this.state.content, title: this.state.title, zIndex: this.props.maxZIndex + 1 }, this.props.updateNote);
  }

  onTitleChange = (event) => {
    this.setState({ title: event.target.value });
    db.updateNote(this.props.userID, this.state.id, { title: this.state.title }, this.props.updateNote);
  }

  onBodyChange = (event) => {
    this.setState({ content: event.target.value });
    db.updateNote(this.props.userID, this.state.id, { text: this.state.content }, this.props.updateNote);
  }

  onDelete = () => {
    db.deleteNote(this.props.userID, this.state.id, this.props.onDelete);
  }

  renderEditButton = () => {
    if (this.state.isEditing) {
      return (
        <IconButton style={{ width: '3px', height: '3px' }} aria-label="done" onClick={this.onEditClick}>
          <DoneIcon style={{ color: 'black', fontSize: '20px', marginTop: '-10px' }} />
        </IconButton>
      );
    } else {
      return (
        <IconButton style={{ width: '3px', height: '3px' }} aria-label="create" onClick={this.onEditClick}>
          <CreateIcon style={{
            color: 'black', fontSize: '20px', marginTop: '-12px', marginLeft: '5px', marginRight: '15px',
          }}
          />
        </IconButton>
      );
    }
  }

  renderTitle() {
    if (this.state.isEditing) {
      return (
        <div className="note-title">
          <input value={this.state.title} onChange={this.onTitleChange} />
        </div>
      );
    } else {
      return (
        <div className="note-title" style={{ marginTop: '-15px' }}>
          <div dangerouslySetInnerHTML={{ __html: marked(this.props.note.title || '') }} />
        </div>
      );
    }
  }

  renderBody() {
    if (this.state.isEditing) {
      return (
        // TextareaAutosize code taken from https://andreypopp.com/react-textarea-autosize/
        <TextareaAutosize
          className="note-body"
          useCacheForDOMMeasurements
          value={this.state.content}
          onChange={this.onBodyChange}
        />
      );
    } else {
      return <div className="note-body" dangerouslySetInnerHTML={{ __html: marked(this.props.note.text || '') }} />;
    }
  }

  render() {
    return (
      <Draggable
        handle=".drag-icon"
        grid={[25, 25]}
        defaultPosition={{ x: 0, y: 20 }}
        position={{
          x: this.props.note.x,
          y: this.props.note.y,
        }}
        onStart={this.handleStartDrag}
        onDrag={this.handleDrag}
      >
        <div className="note"
          style={{
            width: this.props.note.text === '' ? '200px' : 'fit-content',
            height: this.props.note.text === '' ? '200px' : 'fit-content',
            zIndex: this.props.note.zIndex,
          }}
        >
          <div className="note-header">
            <div className="header-left">
              {this.renderTitle()}
              <IconButton style={{ width: '3px', height: '3px' }} aria-label="create" onClick={this.onDelete}>
                <DeleteIcon style={{
                  color: 'black', fontSize: '20px', marginTop: '-12px', marginLeft: '3px',
                }}
                />
              </IconButton>
              {this.renderEditButton()}
            </div>
            <OpenWithIcon className="drag-icon"
              style={{ color: 'black', fontSize: '20px', marginLeft: '5px' }}
            />
          </div>
          {this.renderBody()}
        </div>
      </Draggable>
    );
  }
}

export default Note;
