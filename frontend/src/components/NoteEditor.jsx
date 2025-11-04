import { useState, useEffect } from 'react';

export default function NoteEditor({ currentNote, onSave, onCancel }) {
  const [content, setContent] = useState('');

  useEffect(() => {
    setContent(currentNote?.content || '');
  }, [currentNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onSave(content);
      setContent('');
    }
  };

  const handleCancel = () => {
    setContent('');
    onCancel();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {currentNote ? 'Modifier la note' : 'Nouvelle note'}
      </h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Écrivez votre note ici..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            disabled={!content.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {currentNote ? 'Mettre à jour' : 'Sauvegarder'}
          </button>
          {currentNote && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
