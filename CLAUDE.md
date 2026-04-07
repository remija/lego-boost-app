# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production (runs tsc + vite build)
npm run lint         # Run ESLint
npm run test         # Run tests with Vitest (vitest run)
npm run preview      # Preview production build
```

## Project Overview

React TypeScript application for controlling LEGO Boost Move Hub via Web Bluetooth API. Features a dedicated R2-D2 controller interface for the Star Wars LEGO Boost set. Requires a compatible browser (Chrome, Edge, Opera) and HTTPS/localhost.

## Architecture

```
src/
├── components/              # UI components (BEM naming convention)
│   ├── Header/             # App header with title
│   ├── ConnectionMenu/     # Global connection menu (top-right dropdown)
│   ├── ConnectionCard/     # Connection status card (test page)
│   ├── MotorControls/      # Directional pad for motors A/B
│   ├── ExternalMotors/     # Sliders for motors C/D
│   ├── LedControl/         # LED color picker
│   ├── DistanceSensor/     # Distance sensor display
│   ├── TiltSensor/         # Tilt sensor with visual indicator
│   ├── LogsPanel/          # Connection event logs
│   ├── InfoFooter/         # Browser compatibility info
│   ├── LanguageSwitcher/   # FR/EN language toggle
│   ├── CodeLab/            # Visual block programming components
│   │   ├── Block/          # Individual draggable block
│   │   ├── BlockEditor/    # Block parameter editor
│   │   ├── BlockPalette/   # Available blocks panel
│   │   ├── ProgramCanvas/  # Drop zone for building programs
│   │   ├── ProgramControls/ # Run/stop/clear controls
│   │   └── SaveLoadModal/  # Save and load programs
│   └── R2D2/               # R2-D2 specific components
│       ├── Joystick.tsx    # Virtual joystick for movement
│       ├── HeadControl.tsx # Head rotation control (Port D)
│       ├── ObstacleDetector.tsx  # Distance-based obstacle detection
│       └── R2D2LedEffects.tsx    # LED animation effects
├── pages/
│   ├── R2D2Page/           # Dedicated R2-D2 controller interface
│   ├── TestPage/           # Feature testing page
│   └── CodeLabPage/        # Visual block programming interface
├── context/
│   ├── LegoBoostContextDef.ts  # Context type definition and createContext
│   ├── LegoBoostContext.tsx    # Context provider
│   ├── useLegoBoostContext.ts  # Custom hook to consume context
│   └── index.ts
├── hooks/
│   ├── useLegoBoost.ts     # Bluetooth connection logic and LEGO protocol
│   ├── useDragDrop.ts      # Drag-and-drop logic for block programming
│   └── useProgramExecutor.ts  # Executes block programs on the hub
├── types/
│   ├── index.ts            # TypeScript types
│   └── blocks.ts           # Block programming types
├── constants/
│   ├── colors.ts           # LED color constants
│   └── index.ts
├── i18n/
│   ├── index.ts            # i18next setup (FR/EN, browser detection)
│   └── locales/
│       ├── fr.json
│       └── en.json
├── utils/
│   └── programStorage.ts   # localStorage save/load for programs
├── test/
│   ├── helpers/
│   │   └── renderWithProviders.tsx  # Test utility with context providers
│   ├── mocks/
│   │   ├── i18n.ts                  # i18n mock
│   │   ├── legoBoostContext.ts      # Context mock
│   │   └── webBluetooth.ts         # Web Bluetooth API mock
│   └── setup.ts
└── styles/
    └── global.css          # Global styles and shared .brick class
```

## LEGO Boost Protocol

### Connection
- Service UUID: `00001623-1212-efde-1623-785feabcd123`
- Characteristic UUID: `00001624-1212-efde-1623-785feabcd123`
- Device name prefixes: `LEGO Move Hub`, `Boost`

### Port IDs
- `0x00` - Motor A (internal)
- `0x01` - Motor B (internal)
- `0x02` - Port C (external)
- `0x03` - Port D (external)
- `0x32` - Built-in RGB LED
- `0x3A` - Built-in tilt sensor

### Commands
- Motor speed: `[len, 0x00, 0x81, port, 0x11, 0x07, 0x00, speed]`
- Dual motors: `[len, 0x00, 0x81, 0x39, 0x11, 0x0A, speedA, speedB, 0x64, 0x7F, 0x03]`
- LED color: `[0x08, 0x00, 0x81, 0x32, 0x11, 0x51, 0x00, colorIndex]`
- Subscribe sensor: Port Input Format Setup message

### LED Colors (index)
0=Off, 1=Pink, 2=Purple, 3=Blue, 4=LightBlue, 5=Cyan, 6=Green, 7=Yellow, 8=Orange, 9=Red, 10=White

## Key Patterns

- **Styling**: CSS files with BEM naming (e.g., `.connection-card__button--disabled`)
- **State**: React Context (`LegoBoostContext`) shares hub state across pages
- **Hook**: `useLegoBoost` encapsulates all Bluetooth operations and protocol logic
- **Type imports**: Use `import type` for type-only imports (verbatimModuleSyntax enabled)
- **i18n**: react-i18next with FR/EN support, browser language detection, fallback FR. Use `useTranslation()` hook.
- **Routing**: React Router with three pages (R2-D2, Test, CodeLab)

## R2-D2 Configuration

- Head motor: Port D
- Distance sensor: Port C (auto-subscribed on connection)
- Movement: Internal motors A/B via virtual joystick

## CI/CD

Three GitHub Actions workflows:

- **CI** (`.github/workflows/ci.yml`): Runs on PRs to `main`/`develop`. Three parallel jobs: lint, test, build. Node 22 with npm cache.
- **Deploy** (`.github/workflows/deploy.yml`): Runs on push to `main`. Builds and deploys `dist/` to S3 + CloudFront invalidation. Requires secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET`, `CLOUDFRONT_DIST_ID`.
- **PR Agent** (`.github/workflows/pr-agent.yml`): Automated code review with Codium PR Agent + Gemini 2.5 Flash. Config in `.pr_agent.toml`. Requires secret: `GOOGLE_API_KEY`.
