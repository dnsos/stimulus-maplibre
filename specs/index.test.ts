/**
 * @jest-environment jsdom
 */

import { describe, expect, test } from "@jest/globals";
import Maplibre from "../src/index";
import { waitFor } from "@testing-library/dom";
import { Application } from "@hotwired/stimulus";
import { beforeEach, jest } from "@jest/globals";

jest.mock("maplibre-gl/dist/maplibre-gl", () => ({
  Map: () => ({}),
}));

const startStimulus = () => {
  const application = Application.start();
  application.register("maplibre", Maplibre);
};

const spyError = jest.spyOn(console, "error");

describe("stimulus-maplibre", () => {
  beforeEach(() => {
    spyError.mockReset();

    startStimulus();
  });

  test("errors with invalid latitude or longitude for map", async () => {
    document.body.innerHTML = `
      <div
        data-controller="maplibre"
        data-maplibre-center-value="abc,52.12345"
      >
        <div
          data-maplibre-target="mapContainer"
          style="width: 500px; height: 500px;"
        ></div>
      </div>.
    `;

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Please provide valid longitude and latitude values"
      );
    });
  });

  test("errors with invalid latitude or longitude for marker", async () => {
    document.body.innerHTML = `
      <div
        data-controller="maplibre"
        data-maplibre-center-value="13.12345,52.12345"
        data-maplibre-marker-center-value="13.12345,abc"
      >
      <div
        data-maplibre-target="mapContainer"
        style="width: 500px; height: 500px;"
      ></div>
      </div>.
    `;

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Please provide valid longitude and latitude values"
      );
    });
  });

  test("errors without a style value (either style URL or style spec)", async () => {
    document.body.innerHTML = `
      <div
        style="width: 500px; height: 500px;"
        data-controller="maplibre"
        data-maplibre-center-value="13.12345,52.12345"
        data-maplibre-marker-center-value="13.12345,52.12345"
      ></div>.
    `;

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("No style value was provided");
    });
  });
});
