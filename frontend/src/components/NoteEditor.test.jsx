import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NoteEditor from './NoteEditor';

describe('NoteEditor', () => {
  it('devrait rendre le composant avec un textarea vide', () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();

    render(<NoteEditor onSave={onSave} onCancel={onCancel} />);

    expect(screen.getByPlaceholderText('Écrivez votre note ici...')).toBeInTheDocument();
    expect(screen.getByText('Sauvegarder')).toBeInTheDocument();
  });

  it('devrait désactiver le bouton sauvegarder si le contenu est vide', () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();

    render(<NoteEditor onSave={onSave} onCancel={onCancel} />);

    const saveButton = screen.getByText('Sauvegarder');
    expect(saveButton).toBeDisabled();
  });

  it('devrait activer le bouton sauvegarder si le contenu n\'est pas vide', () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();

    render(<NoteEditor onSave={onSave} onCancel={onCancel} />);

    const textarea = screen.getByPlaceholderText('Écrivez votre note ici...');
    fireEvent.change(textarea, { target: { value: 'Test note' } });

    const saveButton = screen.getByText('Sauvegarder');
    expect(saveButton).not.toBeDisabled();
  });

  it('devrait appeler onSave avec le contenu lors de la soumission', () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();

    render(<NoteEditor onSave={onSave} onCancel={onCancel} />);

    const textarea = screen.getByPlaceholderText('Écrivez votre note ici...');
    fireEvent.change(textarea, { target: { value: 'Test note' } });

    const saveButton = screen.getByText('Sauvegarder');
    fireEvent.click(saveButton);

    expect(onSave).toHaveBeenCalledWith('Test note');
  });

  it('devrait afficher "Modifier la note" en mode édition', () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();
    const currentNote = { id: 1, content: 'Existing note' };

    render(<NoteEditor currentNote={currentNote} onSave={onSave} onCancel={onCancel} />);

    expect(screen.getByText('Modifier la note')).toBeInTheDocument();
    expect(screen.getByText('Mettre à jour')).toBeInTheDocument();
    expect(screen.getByText('Annuler')).toBeInTheDocument();
  });

  it('devrait charger le contenu de la note existante', () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();
    const currentNote = { id: 1, content: 'Existing note' };

    render(<NoteEditor currentNote={currentNote} onSave={onSave} onCancel={onCancel} />);

    const textarea = screen.getByPlaceholderText('Écrivez votre note ici...');
    expect(textarea).toHaveValue('Existing note');
  });

  it('devrait appeler onCancel lors du clic sur Annuler', () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();
    const currentNote = { id: 1, content: 'Existing note' };

    render(<NoteEditor currentNote={currentNote} onSave={onSave} onCancel={onCancel} />);

    const cancelButton = screen.getByText('Annuler');
    fireEvent.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
  });
});
