import React from 'react';

const NoteContext = React.createContext({
  notes: [],
  folders: [],
  err: null,
  handleDelete: () => {},
  handleAddFolder: () => {},
  handleAddNote: () => {}
});

export default NoteContext;
