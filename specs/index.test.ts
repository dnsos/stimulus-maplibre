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

  test("errors with invalid latitude or longitude", async () => {
    document.body.innerHTML = `
      <div
        style="width: 500px; height: 500px;"
        data-controller="maplibre"
        data-maplibre-center-value="abc,52.12345"
      ></div>.
    `;

    await waitFor(() => {
      expect(console.error).toHaveBeenLastCalledWith(
        "Please provide valid longitude and latitude in the shape of `13.123456,52.123456` for the center value"
      );
    });
  });
});
