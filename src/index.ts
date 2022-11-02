import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  connect(): void {
    console.log("Connected Maplibre controller");
  }

  greet(): void {
    console.log("Hey from the map!");
  }
}
