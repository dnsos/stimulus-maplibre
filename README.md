# Stimulus MapLibre controller

A Stimulus controller that registers a MapLibre map with some configurations.

## What is this?

Basically, this is a wrapper around [MapLibre GL JS](https://maplibre.org/maplibre-gl-js-docs/api/). It handles some boilerplate that is needed for most maps. The idea is to use this as a base and write controllers that extend this one to add more features to the map.

You can currently:

- define a map center
- define a zoom level
- define a min and max zoom level
- define if the map should be interactive
- use your own style URL (defaults to a basic Open Street Maps raster tile)
- define coordinates which should display a marker

![Stimulus MapLibre hero image](/images/stimulus-maplibre-hero.png)

## Todo's

- [ ] Remove default OSM style and require active provision of style URL? (see the [OSM policy](https://operations.osmfoundation.org/policies/tiles/))
- [ ] figure out NPM publishing
- [ ] enhance docs

## Developing

Install dependencies:

```bash
yarn install
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
