# LEGO Boost Controller

Application React pour contrôler le LEGO Boost Move Hub via Web Bluetooth, avec une interface dédiée pour le R2-D2 du set Star Wars.

## Fonctionnalités

- **Connexion Bluetooth** - Menu de connexion global accessible depuis n'importe quelle page
- **Interface R2-D2** - Joystick virtuel, contrôle de la tête, détection d'obstacles, effets LED
- **CodeLab** - Programmation visuelle par blocs : créer, sauvegarder et exécuter des programmes
- **Page de test** - Contrôle individuel de tous les composants (moteurs, LED, capteurs)
- **Capteurs** - Support du capteur de distance et du capteur d'inclinaison intégré
- **Multilingue** - Interface disponible en français et en anglais (détection automatique)

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
4. Utilisez l'interface R2-D2, la page de test ou le CodeLab

## Configuration R2-D2

- **Moteur de la tête** : Port D
- **Capteur de distance** : Port C
- **Moteurs de déplacement** : Moteurs internes A et B

## Structure du projet

```
src/
├── components/     # Composants UI réutilisables (dont CodeLab/)
├── pages/          # Pages de l'application (R2D2, Test, CodeLab)
├── context/        # Context React pour l'état partagé
├── hooks/          # Logique Bluetooth, drag-and-drop, exécution de programmes
├── types/          # Types TypeScript
├── constants/      # Constantes (couleurs LED…)
├── i18n/           # Internationalisation (FR/EN)
├── utils/          # Utilitaires (sauvegarde des programmes)
├── test/           # Helpers et mocks pour les tests
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
- react-i18next (internationalisation FR/EN)
- Vitest (tests unitaires)
- Playwright (tests d'interface)
- GitHub Actions (CI/CD)

## Protocole LEGO

L'application utilise le protocole LEGO Wireless Protocol 3.0 pour communiquer avec le hub via Bluetooth Low Energy (BLE).
