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

  declare styleSpecificationValue: object;
  declare hasStyleSpecificationValue: boolean;

  static values = {
    center: { type: String, default: "13.404954,52.520008" },
    zoom: { type: Number, default: 11 },
    minZoom: { type: Number, default: 0 },
    maxZoom: { type: Number, default: 22 },
    styleUrl: String,
    interactive: { type: Boolean, default: true },
    markerCenter: String,
    styleSpecification: Object,
  };

  declare readonly hasMapContainerTarget: boolean;
  declare readonly mapContainerTarget: HTMLElement;
  declare readonly mapContainerTargets: HTMLElement[];

  static targets = ["mapContainer"];

  connect(): void {
    const hasValidMapContainer = this.mapContainerTargetIsValid();
    const hasValidMapContainerSize = this.mapContainerTargetHasValidSize();
    const hasValidCenter = this.isValidCenterString(this.centerValue);

    if (!hasValidMapContainer || !hasValidMapContainerSize || !hasValidCenter)
      return;

    const hasValidStyle = this.hasValidStyle();

    if (!hasValidStyle) return;

    this.map = new maplibregl.Map({
      container: this.mapContainerTarget,
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

  hasValidStyle(): boolean {
    if (
      this.hasStyleSpecificationValue &&
      this.hasStyleUrlValue &&
      this.styleUrlValue.length > 0
    ) {
      console.warn(
        "You provided both a style URL and a style specification. In this case the style URL is used, but you might want to resolve this double assignment."
      );
    }

    if (!this.hasStyleSpecificationValue && !this.hasStyleUrlValue) {
      console.error("No style value was provided");
      return false;
    } else {
      return true;
    }
  }

  /**
   * The map's style. Style URL is used if provided.
   * Otherwise, falls back to style specification.
   */
  get mapStyle(): string | StyleSpecification {
    return (
      this.styleUrlValue || (this.styleSpecificationValue as StyleSpecification)
    );
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

  mapContainerTargetHasValidSize(): boolean {
    if (
      this.mapContainerTarget.clientWidth === 0 ||
      this.mapContainerTarget.clientHeight === 0
    ) {
      console.error(
        "The map was not rendered because either the map container's height or width is zero."
      );
      return false;
    } else {
      return true;
    }
  }

  mapContainerTargetIsValid(): boolean {
    switch (true) {
      case !this.hasMapContainerTarget:
        console.error(
          `No map container was found. Please add an element with the property data-maplibre-target="mapContainer".`
        );
        return false;
      case this.mapContainerTargets.length > 1:
        console.error(
          `Multiple map containers were found. Please define only one element with the property data-maplibre-target="mapContainer".`
        );
        return false;
      default:
        return true;
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
