# BookHub-front - Application Angular

## Présentation

Application réalisée dans le cadre d'un projet de groupe au sein de l'école ENI.

Elle doit être couplée avec l'API REST [BookHub-back](https://github.com/TeamZJava/BookHub-back).

Interface web développée avec Angular, permettant de gérer une bibliothèque en ligne :

- authentification et gestion du profil utilisateur
- catalogue de livres avec recherche et filtres
- emprunts et réservations
- favoris
- tableau de bord personnel

---

## ⚙️ Installation & lancement

### 1. Cloner le projet

```bash
git clone https://github.com/TeamZJava/BookHub-front.git
cd BookHub-front
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Lancer l'application

```bash
ng serve
```

L'application démarre sur `http://localhost:4200`.

> Le back-end doit tourner sur `http://localhost:8080` avant de lancer le front. Voir le README de [BookHub-back](https://github.com/TeamZJava/BookHub-back).

---

## Stack technique

| Technologie  | Version | Rôle                              |
|--------------|---------|-----------------------------------|
| Angular      | 21.2    | Framework principal               |
| TypeScript   | 5.9     | Langage                           |
| Angular Forms | —      | Formulaires template-driven       |
| Angular Router | —     | Navigation + guards               |
| HttpClient   | —       | Appels API REST + intercepteur JWT|
| Vitest       | 4.0     | Tests unitaires                   |

---

## Architecture

```
src/
├── styles.css                        → variables CSS globales + dark/light theme
├── app/
│   ├── app.config.ts                 → configuration Angular + intercepteur JWT
│   ├── app.routes.ts                 → routes + authGuard
│   ├── components/
│   │   └── navbar/                   → barre de navigation + toggle thème
│   ├── connexion/                    → page de connexion
│   ├── inscription/                  → page d'inscription
│   ├── profil/                       → page profil utilisateur
│   ├── dashboard/                    → tableau de bord utilisateur
│   ├── catalogue/                    → liste des livres
│   ├── book-detail/                  → détail d'un livre
│   ├── favoris/                      → liste des favoris
│   ├── models/                       → interfaces TypeScript
│   └── services/                     → appels HTTP vers l'API
```

---

## Pages et fonctionnalités

### Connexion / Inscription — `/connexion` `/inscription`
Formulaires avec gestion du JWT, autocomplete navigateur et gestionnaires de mots de passe.

### Catalogue — `/catalogue`
Liste des livres avec recherche, filtres par catégorie et pagination.

### Détail livre — `/books/:id`
Informations complètes, ajout aux favoris, emprunt, réservation, notes et commentaires.

### Dashboard — `/dashboard`
Emprunts en cours, réservations, favoris et historique des livres lus.

### Profil — `/profil`
Modification des informations personnelles, changement de mot de passe, suppression du compte.

---

## Sécurité

L'authentification repose sur **JWT (JSON Web Token)** fourni par le back.

- Le token est stocké dans le `localStorage` à la connexion.
- Un intercepteur HTTP l'ajoute automatiquement sur toutes les requêtes (sauf `/api/auth/`).
- Un `authGuard` protège toutes les routes privées — redirige vers `/connexion` si pas de token.
- Le token est supprimé du `localStorage` à la déconnexion.

### Rôles

| Rôle        | Accès                                                          |
|-------------|----------------------------------------------------------------|
| `USER`      | Catalogue, emprunts, réservations, favoris, profil, dashboard  |
| `LIBRARIAN` | USER + dashboard bibliothécaire                                |
| `ADMIN`     | LIBRARIAN + gestion des comptes                                |

---

## Comptes de test

| Rôle      | Email                | Mot de passe |
|-----------|----------------------|--------------|
| USER      | marie@bookhub.fr     | `User1234`   |
| USER      | lucas@bookhub.fr     | `User1234`   |
| LIBRARIAN | librarian@bookhub.fr | `User1234`   |
| ADMIN     | admin@bookhub.fr     | `User1234`   |

---

## Commandes utiles

```bash
ng serve        # lancer en développement
ng build        # build de production (dist/)
ng test         # lancer les tests unitaires (Vitest)
```
