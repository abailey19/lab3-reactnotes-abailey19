import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsAlt } from '@fortawesome/free-solid-svg-icons';

class NoteHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: props.title,
      isEditing: false,
    };
  }

  onEdit = () => {
    this.setState((prevState) => ({
      isEditing: !prevState.isEditing,
    }));
  }

  render() {
    return (
      <div className="note-header">
        <div className="header-sides">
          <div className="note-title">{this.state.title}</div>
          <FontAwesomeIcon className="drag-icon" icon={faArrowsAlt} />
        </div>
      </div>
    );
  }
}

export default NoteHeader;
