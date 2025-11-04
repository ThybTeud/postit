import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NotesList from './NotesList';

describe('NotesList', () => {
  it('devrait afficher un message si aucune note', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(<NotesList notes={[]} onEdit={onEdit} onDelete={onDelete} />);

    expect(screen.getByText('Aucune note pour le moment')).toBeInTheDocument();
  });

  it('devrait afficher toutes les notes', () => {
    const notes = [
      { id: 1, content: 'Note 1', created_at: new Date().toISOString() },
      { id: 2, content: 'Note 2', created_at: new Date().toISOString() }
    ];
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(<NotesList notes={notes} onEdit={onEdit} onDelete={onDelete} />);

    expect(screen.getByText('Note 1')).toBeInTheDocument();
    expect(screen.getByText('Note 2')).toBeInTheDocument();
  });

  it('devrait appeler onEdit lors du clic sur une note', () => {
    const notes = [
      { id: 1, content: 'Note 1', created_at: new Date().toISOString() }
    ];
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(<NotesList notes={notes} onEdit={onEdit} onDelete={onDelete} />);

    const noteElement = screen.getByText('Note 1').closest('div[class*="bg-white"]');
    fireEvent.click(noteElement);

    expect(onEdit).toHaveBeenCalledWith(notes[0]);
  });

  it('devrait appeler onDelete lors du clic sur le bouton supprimer', () => {
    const notes = [
      { id: 1, content: 'Note 1', created_at: new Date().toISOString() }
    ];
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(<NotesList notes={notes} onEdit={onEdit} onDelete={onDelete} />);

    const deleteButton = screen.getByLabelText('Supprimer la note');
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith(1);
    expect(onEdit).not.toHaveBeenCalled();
  });
});
