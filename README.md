# Stimulus MapLibre controller

A Stimulus controller that registers a MapLibre map with some configurations.

> **Attention**: This library is still in early development. Expect breaking changes and incomplete documentation.

## What is this?

Basically, this is a wrapper around [MapLibre GL JS](https://maplibre.org/maplibre-gl-js-docs/api/). It handles some boilerplate that is needed for most maps. The idea is to use this as a base and write controllers that extend this one to add more features to the map.

You can currently:

- define a map center
- define a zoom level
- define a min and max zoom level
- define if the map should be interactive
- use your own style URL or style specification

![Stimulus MapLibre hero image](/images/stimulus-maplibre-hero.png)

## Todo's

- [x] Remove default OSM style and require active provision of style URL? (see the [OSM policy](https://operations.osmfoundation.org/policies/tiles/))
- [x] general housekeeping
- [x] figure out NPM publishing
- [ ] enhance docs
- [x] setup GitHub Action for CI
- [ ] improve error messages (more specific)
- [ ] Validate lat/lng so they only allow realistic values (-90 - 90 and -180 - 180)
- [x] consider removing marker functionaloty as it may be too specific (this should really only handle the basics)

## Developing

Install dependencies:

```bash
npm install
```

Start a development server:

```bash
npm run dev
```

Run the tests:

```bash
npm run test
```

## Usage

### Prerequisites

- The Maplibre CSS has to be present in your own HTML
- Peer dependencies? Which?
- Node v16 or higher
