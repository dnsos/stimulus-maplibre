import { Controller } from "@hotwired/stimulus";
import maplibregl, { Map, StyleSpecification } from "maplibre-gl";

export default class extends Controller {
  declare map: Map;

  declare styleUrlValue: string;
  declare hasStyleUrlValue: boolean;

  declare centerValue: string;
  declare hasCenterValue: boolean;

  declare zoomValue: number;
  declare hasZoomValue: boolean;

  declare minZoomValue: number;
  declare maxZoomValue: number;

  declare interactiveValue: boolean;

  declare markerCenterValue: string;
  declare hasMarkerCenterValue: boolean;

  static values = {
    center: { type: String, default: "13.404954,52.520008" },
    zoom: { type: Number, default: 11 },
    minZoom: { type: Number, default: 0 },
    maxZoom: { type: Number, default: 22 },
    styleUrl: String,
    interactive: { type: Boolean, default: true },
    markerCenter: String,
  };

  connect(): void {
    this.checkContainerDimensions();
    const hasValidCenter = this.isValidCenterString(this.centerValue);

    if (!hasValidCenter) return;

    this.map = new maplibregl.Map({
      container: this.element as HTMLElement,
      style: this.mapStyle,
      center: [this.longitude, this.latitude],
      zoom: this.zoomValue,
      minZoom: this.minZoomValue,
      maxZoom: this.maxZoomValue,
      interactive: this.interactiveValue,
    });

    if (this.hasMarkerCenterValue) {
      const hasValidMarkerCenter = this.isValidCenterString(
        this.markerCenterValue
      );

      if (!hasValidMarkerCenter) {
        console.error("The value for the marker center is not valid");
        return;
      }
      new maplibregl.Marker()
        .setLngLat([this.markerLongitude, this.markerLatitude])
        .addTo(this.map);
    }
  }

  get mapStyle(): string | StyleSpecification {
    return this.hasStyleUrlValue && this.styleUrlValue.length > 0
      ? this.styleUrlValue
      : this.defaultMapStyle;
  }

  get defaultMapStyle(): StyleSpecification {
    return {
      version: 8,
      sources: {
        osm: {
          type: "raster",
          tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
          attribution: "&copy; OpenStreetMap Contributors",
          maxzoom: 19,
        },
      },
      layers: [
        {
          id: "osm",
          type: "raster",
          source: "osm", // This must match the source key above
        },
      ],
    };
  }

  zoomValueChanged(newZoomValue: number, previousZoomValue: number): void {
    if (newZoomValue !== previousZoomValue) {
      if (!this.map) return;
      this.map.easeTo({
        zoom: newZoomValue,
      });
    }
  }

  centerValueChanged(
    newCenterValue: number,
    previousCenterValue: number
  ): void {
    if (newCenterValue !== previousCenterValue) {
      const hasValidCenter = this.isValidCenterString(this.centerValue);
      if (!this.map || !hasValidCenter) return;
      this.map.easeTo({
        center: [this.longitude, this.latitude],
      });
    }
  }

  checkContainerDimensions(): void {
    if (this.element.clientWidth === 0 || this.element.clientHeight === 0) {
      console.warn(
        "The map is not visible because either the map container's height or width is zero."
      );
    }
  }

  isValidCenterString(rawCenterString: string): boolean {
    const [longitude, latitude] = rawCenterString.split(",");
    const parsedLongitude = parseFloat(longitude);
    const parsedLatitude = parseFloat(latitude);
    if (!parsedLongitude || !parsedLatitude) {
      console.error("Please provide valid longitude and latitude values");
      return false;
    }
    return true;
  }

  get latitude(): number {
    const [, latitude] = this.centerValue.split(",");
    return parseFloat(latitude);
  }
  get longitude(): number {
    const [longitude] = this.centerValue.split(",");
    return parseFloat(longitude);
  }

  get markerLatitude(): number {
    const [, markerLatitude] = this.markerCenterValue.split(",");
    return parseFloat(markerLatitude);
  }
  get markerLongitude(): number {
    const [markerLongitude] = this.markerCenterValue.split(",");
    return parseFloat(markerLongitude);
  }
}
