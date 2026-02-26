# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production (runs tsc + vite build)
npm run lint         # Run ESLint
npm run test         # Run tests (placeholder for now, ready for Vitest)
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
│   └── R2D2/               # R2-D2 specific components
│       ├── Joystick/       # Virtual joystick for movement
│       ├── HeadControl/    # Head rotation control (Port C)
│       ├── ObstacleDetector/  # Distance-based obstacle detection
│       └── R2D2LedEffects/ # LED animation effects
├── pages/
│   ├── R2D2Page/           # Dedicated R2-D2 controller interface
│   └── TestPage/           # Feature testing page
├── context/
│   └── LegoBoostContext.tsx  # Shared state context for hub connection
├── hooks/
│   └── useLegoBoost.ts     # Bluetooth connection logic and LEGO protocol
├── types/
│   └── index.ts            # TypeScript types
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
- **UI text**: French language
- **Routing**: React Router with two pages (R2-D2 and Test)

## R2-D2 Configuration

- Head motor: Port D
- Distance sensor: Port C (auto-subscribed on connection)
- Movement: Internal motors A/B via virtual joystick

## CI/CD

Three GitHub Actions workflows:

- **CI** (`.github/workflows/ci.yml`): Runs on PRs to `main`/`develop`. Three parallel jobs: lint, test, build. Node 22 with npm cache.
- **Deploy** (`.github/workflows/deploy.yml`): Runs on push to `main`. Builds and deploys `dist/` to S3 + CloudFront invalidation. Requires secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET`, `CLOUDFRONT_DIST_ID`.
- **PR Agent** (`.github/workflows/pr-agent.yml`): Automated code review with Codium PR Agent + Gemini 2.5 Flash. Config in `.pr_agent.toml`. Requires secret: `GOOGLE_API_KEY`.
