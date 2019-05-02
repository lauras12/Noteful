import React, { Component } from 'react';
import NotefulForm from '../NotefulForm/NotefulForm';
import NoteContext from '../NoteContext';
import cuid from 'cuid';
import './AddNote.css';

export default class AddNote extends Component {
  constructor() {
    super();
    this.state = { error: null };
  }
  static contextType = NoteContext;
  static defaultProps = {
    folders: []
  };

  handleAddNote = event => {
    event.preventDefault();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: cuid(),
        name: event.target.note.value,
        modified: new Date(),
        folderId: event.target.folder.value,
        content: event.target.content.value
      })
    };

    fetch('http://localhost:9090/notes', options)
      .then(res => {
        if (!res.ok) {
          throw new Error('Something went wrong');
        }
        return res;
      })
      .then(res => res.json())
      .then(data => {
        this.context.handleAddNote(data);
      })
      .catch(err => {
        this.setState({ error: err.message });
      });
  };
  render() {
    return (
      <section className='AddNote'>
        <h2>Create a note</h2>
        <NotefulForm
          onSubmit={event => {
            this.handleAddNote(event);
          }}
        >
          <div className='field'>
            <label htmlFor='note-name-input'>Name</label>
            <input type='text' id='note-name-input' name='note' />
          </div>
          <div className='field'>
            <label htmlFor='note-content-input'>Content</label>
            <textarea id='note-content-input' name='content' />
          </div>
          <div className='field'>
            <label htmlFor='note-folder-select'>Folder</label>
            <select id='note-folder-select' name='folder'>
              <option value={null}>...</option>
              {this.context.folders.map(folder => (
                <option key={folder.id} name='folder' value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>
          <div className='buttons'>
            <button type='submit'>Add note</button>
          </div>
        </NotefulForm>
        {this.state.error && (
          <div>
            <p>{this.state.error}</p>
          </div>
        )}
      </section>
    );
  }
}
