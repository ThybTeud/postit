const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
// Console.log
console.log(API_URL);
//

export const getNotes = async () => {
  const response = await fetch(`${API_URL}/api/notes`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des notes');
  }
  return response.json();
};

export const createNote = async (content) => {
  const response = await fetch(`${API_URL}/api/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la création de la note');
  }
  return response.json();
};

export const updateNote = async (id, content) => {
  const response = await fetch(`${API_URL}/api/notes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la mise à jour de la note');
  }
  return response.json();
};

export const deleteNote = async (id) => {
  const response = await fetch(`${API_URL}/api/notes/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la suppression de la note');
  }
  return response.json();
};
