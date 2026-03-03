# EnzouletteBlog

Blog full-stack sur le football — passion, potins & culture.

Thème couleurs : Seleção brésilienne (vert #009C3B, jaune #FFDF00, bleu nuit #002776).

---

## Stack

| Côté | Techno |
|------|--------|
| Backend | Ruby on Rails 8.1.2 (API-only) + PostgreSQL |
| Auth | `has_secure_password` + `ruby-jwt` (JWT manuel) |
| Photos | Active Storage (disk local) |
| Frontend | Next.js 16.1.6 (App Router) + React 19 |
| UI | shadcn/ui + Tailwind CSS v4 + Radix UI |
| État | TanStack Query v5 |
| Formulaires | React Hook Form + Zod |

---

## Structure du projet

```
API_RAILSful/
├── blog_api/        # Rails API (port 3001)
└── blog-frontend/   # Next.js (port 3000)
```

---

## Lancer le projet

### Prérequis

- Ruby 3.4.2
- Node.js 20+
- PostgreSQL en cours d'exécution

### Backend

```bash
cd blog_api
bundle install
rails db:create db:migrate db:seed
rails server -p 3001
```

### Frontend

```bash
cd blog-frontend
npm install
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

---

## Endpoints API

Tous les endpoints sont préfixés par `/api/v1`.

### Auth

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/signup` | — | Crée un compte, retourne un JWT |
| POST | `/login` | — | Connexion, retourne un JWT |
| DELETE | `/logout` | JWT | Invalide le token (rotation `jti`) |

### Articles

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/articles` | — | Liste tous les articles publics |
| GET | `/articles/:id` | — | Détail d'un article |
| POST | `/articles` | JWT | Crée un article |
| PUT | `/articles/:id` | JWT (auteur) | Modifie un article |
| DELETE | `/articles/:id` | JWT (auteur) | Supprime un article |

### Commentaires

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/articles/:id/comments` | — | Liste les commentaires |
| POST | `/articles/:id/comments` | JWT | Ajoute un commentaire |
| DELETE | `/articles/:id/comments/:id` | JWT (auteur) | Supprime un commentaire |

### Photos

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/photos` | JWT | Liste les photos de l'utilisateur |
| POST | `/photos` | JWT | Upload une photo |
| DELETE | `/photos/:id` | JWT | Supprime une photo |

### Stats

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/stats` | — | Nombre d'articles, photos, membres |

---

## Auth JWT

- Le token est retourné dans le header `Authorization: Bearer <token>` à la connexion/inscription.
- Le frontend le stocke dans `localStorage` et le renvoie à chaque requête protégée.
- Le logout invalide le token côté serveur par rotation du champ `jti` (UUID).

---

## Variables d'environnement

### Frontend (`blog-frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### Backend

Les secrets Rails sont gérés via `config/credentials.yml.enc`.

---

## Fonctionnalités

- Inscription / connexion / déconnexion
- CRUD articles (avec option article privé)
- Commentaires sur les articles
- Galerie photos personnelle (upload via Active Storage)
- Page d'accueil magazine avec article "À la une" et stats
- Thème sombre forcé aux couleurs de la Seleção
