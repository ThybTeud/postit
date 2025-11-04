import pool from '../config/database.js';

export const getAllNotes = async () => {
  const result = await pool.query(
    'SELECT * FROM notes ORDER BY created_at DESC'
  );
  return result.rows;
};

export const createNote = async (content) => {
  const result = await pool.query(
    'INSERT INTO notes (content) VALUES ($1) RETURNING *',
    [content]
  );
  return result.rows[0];
};

export const updateNote = async (id, content) => {
  const result = await pool.query(
    'UPDATE notes SET content = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [content, id]
  );
  return result.rows[0];
};

export const deleteNote = async (id) => {
  const result = await pool.query(
    'DELETE FROM notes WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
};
