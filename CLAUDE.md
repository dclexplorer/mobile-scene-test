# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Decentraland SDK7 scene project. Decentraland uses an Entity-Component-System (ECS) architecture where entities are just IDs (numbers), components are pure data containers, and systems are functions that process entities with specific components.

## Development Commands

**Start development server:**
```bash
npm run start
```

**Build the scene:**
```bash
npm run build
```

**Deploy to Decentraland:**
```bash
npm run deploy
```

**Upgrade SDK:**
```bash
npm run upgrade-sdk          # Latest stable
npm run upgrade-sdk:next     # Next/beta version
```

## Architecture & Key Concepts

### Entity-Component-System (ECS) Pattern

**Entities** are abstract IDs (numbers) created via `engine.addEntity()`. There is no "Entity class" - just a numeric reference.

**Components** are data-only containers (no functions). They are added to entities using the component type as the entry point:
```ts
Transform.create(myEntity, { position: Vector3.create(1, 2, 3) })
```

**Systems** are pure functions added to the engine that process entities with specific components:
```ts
function mySystem(dt: number) {
  for (const [entity, transform, velocity] of engine.getEntitiesWith(Transform, Velocity)) {
    // Process entities
  }
}
engine.addSystem(mySystem)
```

### Mutability

SDK7 distinguishes between immutable and mutable component access for performance:
- `.get()` returns an immutable (read-only) component
- `.getMutable()` returns a mutable component for modifications

Only use `.getMutable()` when actually making changes to a component.

### Custom Components

Custom components require:
1. A unique numeric ID (2001+ as 1-2000 are reserved)
2. A schema definition using `Schemas.Map()` or other schema types
3. Registration via `engine.defineComponent()`

Example:
```ts
const VelocitySchema = Schemas.Map({
  x: Schemas.Float,
  y: Schemas.Float,
  z: Schemas.Float
})
const VelocityComponent = engine.defineComponent(VelocitySchema, 2008)
```

## Project Structure

- `src/index.ts` - Main entry point with `main()` function
- `scene.json` - Scene configuration (parcels, spawn points, metadata)
- `bin/` - Compiled JavaScript output (auto-generated)
- `assets/` - Scene assets (models, textures, etc.)

## Scene Configuration

The `scene.json` file defines:
- Scene metadata (title, description, thumbnail)
- Parcel coordinates and base parcel
- Spawn points with position and camera target
- Feature toggles (voice chat, portable experiences)
- Runtime version (must be "7" for SDK7)

## TypeScript Configuration

The project extends `@dcl/sdk/types/tsconfig.ecs7.json` with strict mode enabled. All TypeScript files in `src/**/*.ts` are included in compilation.

## Context & Documentation

This project includes a `cursor.config` that references external Decentraland SDK7 documentation and examples. When working with this codebase, refer to the official Decentraland documentation for SDK7-specific patterns and best practices at https://docs.decentraland.org/creator/.
