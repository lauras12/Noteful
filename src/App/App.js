import React, { Component } from 'react';
import { Route, Link, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NoteContext from '../NoteContext';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import AddFolder from '../AddFolder/AddFolder';
import AddNote from '../AddNote/AddNote';
import { findNote, findFolder } from '../notes-helpers';
import './App.css';

class App extends Component {
  state = {
    notes: [],
    folders: [],
    err: null
  };
  FolderUrl = 'http://localhost:9090/folders';
  NoteUrl = 'http://localhost:9090/notes';

  componentDidMount() {
    fetch(this.FolderUrl)
      .then(res => {
        if (!res.ok) {
          throw new Error('Something went wrong, please try again later.');
        }
        return res;
      })
      .then(res => res.json())
      .then(data => {
        this.setState({
          folders: data,
          error: null
        });
      })
      .catch(err => {
        this.setState({
          error: err.message
        });
        console.log(err);
      });

    fetch(this.NoteUrl)
      .then(res => {
        if (!res.ok) {
          throw new Error('Something went wrong, please try again later.');
        }
        return res;
      })
      .then(res => res.json())
      .then(data => {
        this.setState({
          notes: data,
          error: null
        });
      })
      .catch(err => {
        this.setState({
          error: err.message
        });
      });
  }

  handleDeleteNote = id => {
    const newNotes = this.state.notes.filter(note => note.id !== id);
    console.log(newNotes);
    const options = {
      method: 'DELETE'
    };
    fetch(`${this.NoteUrl}/${id}`, options)
      .then(res => {
        if (!res.ok) {
          throw new Error('Something went wrong');
        }
        return res;
      })
      .then(res => res.json())
      .then(data => {
        this.setState({
          notes: newNotes,
          error: null
        });
      })
      .catch(err => {
        this.setState({
          error: err.message
        });
      });
  };

  handleAddFolder = folder => {
    console.log(this.props);
    this.setState(
      {
        folders: [...this.state.folders, folder]
      },
      () => this.props.history.replace('/')
    );
  };

  handleAddNote = note => {
    //add note to list of notes to end of notes
    this.setState({ notes: [...this.state.notes, note] }, () =>
      this.props.history.replace('/')
    );
  };

  renderNavRoutes() {
    const { notes, folders } = this.state;
    return (
      <>
        {['/', '/folder/:folderId'].map(path => (
          <Route exact key={path} path={path} component={NoteListNav} />
        ))}
        <Route
          path='/note/:noteId'
          render={routeProps => {
            const { noteId } = routeProps.match.params;
            const note = findNote(notes, noteId) || {};
            const folder = findFolder(folders, note.folderId);
            return <NotePageNav {...routeProps} folder={folder} />;
          }}
        />
        <Route path='/add-folder' component={NotePageNav} />
        <Route path='/add-note' component={NotePageNav} />
      </>
    );
  }

  renderMainRoutes() {
    return (
      <>
        {['/', '/folder/:folderId'].map(path => (
          <Route
            exact
            key={path}
            path={path}
            render={routeProps => {
              return <NoteListMain {...routeProps} />;
            }}
          />
        ))}
        <Route
          path='/note/:noteId'
          render={routeProps => {
            return <NotePageMain {...routeProps} />;
          }}
        />
        <Route path='/add-folder' component={AddFolder} />
        <Route path='/add-note' component={AddNote} />
      </>
    );
  }
  render() {
    return (
      <NoteContext.Provider
        value={{
          folders: this.state.folders,
          notes: this.state.notes,
          handleDelete: this.handleDeleteNote,
          handleAddNote: this.handleAddNote,
          handleAddFolder: this.handleAddFolder
        }}
      >
        <div className='App'>
          <nav className='App__nav'>{this.renderNavRoutes()}</nav>
          <header className='App__header'>
            <h1>
              <Link to='/'>Noteful</Link>{' '}
              <FontAwesomeIcon icon='check-double' />
            </h1>
          </header>
          <main className='App__main'>{this.renderMainRoutes()}</main>
        </div>
      </NoteContext.Provider>
    );
  }
}

export default withRouter(App);
