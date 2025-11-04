# PostIt - Application de prise de notes

Application web minimaliste de prise de notes construite avec la stack PERN (PostgreSQL, Express, React, Node.js).

## Architecture

```
postit/
├── backend/          # API REST (Node.js + Express + PostgreSQL)
└── frontend/         # Interface utilisateur (React + Vite + Tailwind CSS)
```

## Fonctionnalités

- Créer une nouvelle note
- Modifier une note existante
- Supprimer une note
- Afficher toutes les notes (plus récentes en premier)
- Validation : impossible de sauvegarder une note vide
- Interface responsive et épurée

## Stack technique

### Frontend
- React 18
- Vite (build tool)
- Tailwind CSS
- Vitest + React Testing Library

### Backend
- Node.js
- Express
- PostgreSQL
- pg (node-postgres)
- Vitest

## Installation locale

### Prérequis

- Node.js 18 ou supérieur
- PostgreSQL 14 ou supérieur
- npm ou yarn

### 1. Cloner le repository

```bash
git clone <url-du-repo>
cd postit
```

### 2. Configuration du Backend

```bash
cd backend
npm install
```

Créer un fichier `.env` basé sur `.env.example` :

```bash
cp .env.example .env
```

Éditer le fichier `.env` avec vos configurations :

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/postit
DATABASE_URL_TEST=postgresql://user:password@localhost:5432/postit_test
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### 3. Configuration de la base de données

Créer les bases de données :

```bash
# Base de données principale
psql -U postgres -c "CREATE DATABASE postit;"

# Base de données de test
psql -U postgres -c "CREATE DATABASE postit_test;"
```

Initialiser la structure de la base de données :

```bash
psql -U postgres -d postit -f init.sql
psql -U postgres -d postit_test -f init.sql
```

### 4. Configuration du Frontend

```bash
cd ../frontend
npm install
```

Créer un fichier `.env` basé sur `.env.example` :

```bash
cp .env.example .env
```

Éditer le fichier `.env` :

```env
VITE_API_URL=http://localhost:3000
```

### 5. Lancer l'application en local

Terminal 1 - Backend :
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend :
```bash
cd frontend
npm run dev
```

Ouvrir le navigateur à l'adresse : `http://localhost:5173`

## Tests

### Backend

```bash
cd backend

# Lancer les tests
npm test

# Mode watch
npm run test:watch

# Couverture de code
npm run test:coverage
```

### Frontend

```bash
cd frontend

# Lancer les tests
npm test

# Mode watch
npm run test:watch

# Couverture de code
npm run test:coverage
```

## Déploiement sur Alwaysdata

### 1. Préparation

- Créer un compte sur [Alwaysdata](https://www.alwaysdata.com)
- Accéder au panel d'administration

### 2. Configuration de la base de données PostgreSQL

1. Dans le panel Alwaysdata, aller dans **Bases de données** > **PostgreSQL**
2. Créer une nouvelle base de données `postit`
3. Noter les informations de connexion (host, port, user, password, database)
4. Se connecter à la base via l'interface Web SQL ou psql
5. Exécuter le script `backend/init.sql`

### 3. Déploiement du Backend

#### A. Via SSH et Git

1. Créer un site de type **Node.js** dans Alwaysdata
2. Configurer la version Node.js (18+)
3. Se connecter en SSH :

```bash
ssh [votre-compte]@ssh-[votre-compte].alwaysdata.net
```

4. Cloner le repository et installer les dépendances :

```bash
cd ~/www
git clone <url-du-repo> postit
cd postit/backend
npm install --production
```

5. Créer le fichier `.env` avec les bonnes configurations :

```env
PORT=8080
DATABASE_URL=postgresql://user:password@postgresql-[compte].alwaysdata.net/postit
CORS_ORIGIN=https://[votre-frontend].alwaysdata.net
NODE_ENV=production
```

6. Dans le panel Alwaysdata, configurer le site :
   - **Commande** : `node src/server.js`
   - **Répertoire de travail** : `/home/[compte]/www/postit/backend`
   - **Variables d'environnement** : ajouter les variables du `.env`

#### B. Redémarrage

Redémarrer l'application dans le panel Sites > [votre-site] > Redémarrer

### 4. Déploiement du Frontend

#### A. Build local

1. Configurer l'URL du backend en production :

```bash
cd frontend
echo "VITE_API_URL=https://[votre-backend].alwaysdata.net" > .env.production
```

2. Générer le build :

```bash
npm run build
```

#### B. Upload sur Alwaysdata

1. Créer un site de type **Fichiers statiques** dans Alwaysdata
2. Configurer le répertoire racine : `/home/[compte]/www/postit-frontend`
3. Uploader le contenu du dossier `dist/` via FTP, SFTP ou SSH :

```bash
# Via SSH
scp -r dist/* [compte]@ssh-[compte].alwaysdata.net:www/postit-frontend/
```

4. Le site est maintenant accessible à l'URL configurée

### 5. Configuration CORS

Vérifier que le backend autorise les requêtes depuis le domaine du frontend.
Dans le `.env` du backend, la variable `CORS_ORIGIN` doit contenir l'URL du frontend :

```env
CORS_ORIGIN=https://[votre-frontend].alwaysdata.net
```

### 6. Maintenance et mises à jour

Pour mettre à jour l'application :

```bash
# Backend
cd ~/www/postit/backend
git pull
npm install --production
# Redémarrer depuis le panel Alwaysdata

# Frontend
cd local-frontend
git pull
npm run build
scp -r dist/* [compte]@ssh-[compte].alwaysdata.net:www/postit-frontend/
```

## Structure de la base de données

### Table `notes`

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | SERIAL | Identifiant unique (clé primaire) |
| `content` | TEXT | Contenu de la note |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de dernière modification |

## API REST

### Endpoints

#### `GET /api/notes`
Récupère toutes les notes triées par date décroissante.

**Réponse** : `200 OK`
```json
[
  {
    "id": 1,
    "content": "Ma note",
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z"
  }
]
```

#### `POST /api/notes`
Crée une nouvelle note.

**Body** :
```json
{
  "content": "Contenu de la note"
}
```

**Réponse** : `201 Created`
```json
{
  "id": 1,
  "content": "Contenu de la note",
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-01T10:00:00Z"
}
```

#### `PUT /api/notes/:id`
Met à jour une note existante.

**Body** :
```json
{
  "content": "Nouveau contenu"
}
```

**Réponse** : `200 OK`
```json
{
  "id": 1,
  "content": "Nouveau contenu",
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-01T10:30:00Z"
}
```

#### `DELETE /api/notes/:id`
Supprime une note.

**Réponse** : `200 OK`
```json
{
  "message": "Note supprimée avec succès"
}
```

## Licence

MIT
