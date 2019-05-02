import React, { Component } from 'react';
import cuid from 'cuid';
import NotefulForm from '../NotefulForm/NotefulForm';
import './AddFolder.css';
import NoteContext from '../NoteContext';

export default class AddFolder extends Component {
  constructor() {
    super();
    this.state = { error: null };
  }
  static contextType = NoteContext;

  handleAddFolder = event => {
    event.preventDefault();

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: cuid(),
        name: event.target.folder.value
      })
    };
    console.log(options);

    fetch('http://localhost:9090/folders', options)
      .then(res => {
        if (!res.ok) {
          throw new Error('Something went wrong');
        }
        return res;
      })
      .then(res => res.json())
      .then(data => {
        this.context.handleAddFolder(data);
      })
      .catch(err => {
        this.setState({
          error: err.message
        });
      });
  };

  render() {
    return (
      <section className='AddFolder'>
        <h2>Create a folder</h2>
        <NotefulForm
          onSubmit={event => {
            this.handleAddFolder(event);
          }}
        >
          <div className='field'>
            <label htmlFor='folder-name-input'>Name</label>
            <input type='text' id='folder-name-input' name='folder' />
          </div>
          <div className='buttons'>
            <button type='submit'>Add folder</button>
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
