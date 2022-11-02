import { Controller } from "@hotwired/stimulus";
import maplibregl, { Map } from "maplibre-gl";

export default class extends Controller {
  map: Map;

  connect(): void {
    console.log("Connected Maplibre controller");

    this.map = new maplibregl.Map({
      container: "map",
      style: "https://demotiles.maplibre.org/style.json", // stylesheet location
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 5, // starting zoom
    });
  }

  greet(): void {
    console.log("Hey from the map!");
  }
}
