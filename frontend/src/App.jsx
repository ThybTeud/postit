import { useState, useEffect } from 'react';
import NoteEditor from './components/NoteEditor';
import NotesList from './components/NotesList';
import * as api from './services/api';

function App() {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getNotes();
      setNotes(data);
    } catch (err) {
      setError('Erreur lors du chargement des notes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (content) => {
    try {
      setError(null);
      if (currentNote) {
        await api.updateNote(currentNote.id, content);
      } else {
        await api.createNote(content);
      }
      setCurrentNote(null);
      await loadNotes();
    } catch (err) {
      setError('Erreur lors de la sauvegarde de la note');
      console.error(err);
    }
  };

  const handleEdit = (note) => {
    setCurrentNote(note);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      try {
        setError(null);
        await api.deleteNote(id);
        await loadNotes();
        if (currentNote?.id === id) {
          setCurrentNote(null);
        }
      } catch (err) {
        setError('Erreur lors de la suppression de la note');
        console.error(err);
      }
    }
  };

  const handleCancel = () => {
    setCurrentNote(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          PostIt - Mes Notes
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <NoteEditor
          currentNote={currentNote}
          onSave={handleSave}
          onCancel={handleCancel}
        />

        {loading ? (
          <div className="text-center text-gray-600">Chargement...</div>
        ) : (
          <NotesList
            notes={notes}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}

export default App;
