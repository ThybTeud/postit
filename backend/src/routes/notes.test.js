import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import pool from '../config/database.js';

const API_URL = process.env.API_URL || 'http://localhost:3000';

beforeAll(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS notes (
      id SERIAL PRIMARY KEY,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
});

beforeEach(async () => {
  await pool.query('DELETE FROM notes');
});

afterAll(async () => {
  await pool.query('DROP TABLE IF EXISTS notes');
  await pool.end();
});

describe('Notes API', () => {
  describe('GET /api/notes', () => {
    it('devrait retourner un tableau vide quand il n\'y a pas de notes', async () => {
      const response = await fetch(`${API_URL}/api/notes`);
      const notes = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(notes)).toBe(true);
      expect(notes).toHaveLength(0);
    });

    it('devrait retourner toutes les notes', async () => {
      await pool.query('INSERT INTO notes (content) VALUES ($1), ($2)', [
        'Note 1',
        'Note 2'
      ]);

      const response = await fetch(`${API_URL}/api/notes`);
      const notes = await response.json();

      expect(response.status).toBe(200);
      expect(notes).toHaveLength(2);
    });
  });

  describe('POST /api/notes', () => {
    it('devrait créer une nouvelle note', async () => {
      const response = await fetch(`${API_URL}/api/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'Nouvelle note' })
      });
      const note = await response.json();

      expect(response.status).toBe(201);
      expect(note).toHaveProperty('id');
      expect(note.content).toBe('Nouvelle note');
      expect(note).toHaveProperty('created_at');
    });

    it('devrait rejeter une note avec un contenu vide', async () => {
      const response = await fetch(`${API_URL}/api/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: '' })
      });
      const result = await response.json();

      expect(response.status).toBe(400);
      expect(result).toHaveProperty('error');
    });
  });

  describe('PUT /api/notes/:id', () => {
    it('devrait mettre à jour une note existante', async () => {
      const createResult = await pool.query(
        'INSERT INTO notes (content) VALUES ($1) RETURNING *',
        ['Note originale']
      );
      const noteId = createResult.rows[0].id;

      const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'Note modifiée' })
      });
      const note = await response.json();

      expect(response.status).toBe(200);
      expect(note.content).toBe('Note modifiée');
      expect(note.id).toBe(noteId);
    });

    it('devrait rejeter une mise à jour avec un contenu vide', async () => {
      const createResult = await pool.query(
        'INSERT INTO notes (content) VALUES ($1) RETURNING *',
        ['Note originale']
      );
      const noteId = createResult.rows[0].id;

      const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: '' })
      });
      const result = await response.json();

      expect(response.status).toBe(400);
      expect(result).toHaveProperty('error');
    });
  });

  describe('DELETE /api/notes/:id', () => {
    it('devrait supprimer une note existante', async () => {
      const createResult = await pool.query(
        'INSERT INTO notes (content) VALUES ($1) RETURNING *',
        ['Note à supprimer']
      );
      const noteId = createResult.rows[0].id;

      const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
        method: 'DELETE'
      });
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result).toHaveProperty('message');

      const checkResult = await pool.query('SELECT * FROM notes WHERE id = $1', [noteId]);
      expect(checkResult.rows).toHaveLength(0);
    });
  });
});
