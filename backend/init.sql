-- Script d'initialisation de la base de données PostIt
-- Exécuter ce script pour créer la table notes

-- Supprimer la table si elle existe déjà
DROP TABLE IF EXISTS notes;

-- Créer la table notes
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour améliorer les performances des requêtes triées par date
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);

-- Afficher un message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Table notes créée avec succès';
END $$;
