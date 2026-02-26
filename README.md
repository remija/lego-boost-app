# LEGO Boost Controller

Application React pour contrôler le LEGO Boost Move Hub via Web Bluetooth, avec une interface dédiée pour le R2-D2 du set Star Wars.

## Fonctionnalités

- **Connexion Bluetooth** - Menu de connexion global accessible depuis n'importe quelle page
- **Interface R2-D2** - Joystick virtuel, contrôle de la tête, détection d'obstacles, effets LED
- **Page de test** - Contrôle individuel de tous les composants (moteurs, LED, capteurs)
- **Capteurs** - Support du capteur de distance et du capteur d'inclinaison intégré

## Prérequis

- Navigateur compatible Web Bluetooth (Chrome, Edge, Opera)
- HTTPS ou localhost (requis pour Web Bluetooth)
- LEGO Boost Move Hub (set 17101 ou set Star Wars R2-D2)

## Installation

```bash
npm install
npm run dev
```

## Utilisation

1. Allumez votre hub LEGO Boost
2. Cliquez sur le menu de connexion en haut à droite
3. Cliquez sur "Se connecter" et sélectionnez votre hub dans la liste
4. Utilisez l'interface R2-D2 ou la page de test

## Configuration R2-D2

- **Moteur de la tête** : Port C
- **Capteur de distance** : Port D
- **Moteurs de déplacement** : Moteurs internes A et B

## Structure du projet

```
src/
├── components/     # Composants UI réutilisables
├── pages/          # Pages de l'application (R2D2, Test)
├── context/        # Context React pour l'état partagé
├── hooks/          # Hook useLegoBoost pour la logique Bluetooth
├── types/          # Types TypeScript
└── styles/         # Styles globaux
```

## Scripts

```bash
npm install          # Installer les dépendances
npm run dev          # Serveur de développement
npm run build        # Build de production (tsc + vite build)
npm run lint         # Lancer ESLint
npm test             # Lancer les tests
npm run preview      # Prévisualiser le build de production
```

## CI/CD

Le projet utilise GitHub Actions avec 3 workflows :

- **CI** — Lint, tests et build sur chaque PR vers `main` ou `develop`
- **Deploy** — Build et déploiement sur S3 + invalidation CloudFront au push sur `main`
- **PR Agent** — Revue de code automatique via Codium PR Agent (Gemini 2.5 Flash)

## Technologies

- React 19 + TypeScript
- Vite
- React Router
- Web Bluetooth API
- GitHub Actions (CI/CD)

## Protocole LEGO

L'application utilise le protocole LEGO Wireless Protocol 3.0 pour communiquer avec le hub via Bluetooth Low Energy (BLE).
