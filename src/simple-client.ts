import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export type tileLoc = { zoom: number; x: number; y: number };

export class SimpleClient {
  constructor(public url: string, public clientOption?: AxiosRequestConfig) {
    this.axiosInstance = axios.create(clientOption);
  }
  axiosInstance: AxiosInstance;

  async get(zoomOrLoc: number | tileLoc, xOrOpt?: number, y?: number) {
    let tileLocation: tileLoc;

    if (typeof zoomOrLoc === "number") {
      if (typeof xOrOpt !== "number" || typeof y !== "number") {
        throw new Error("Need proper tile coordinates.");
      }
      tileLocation = { zoom: zoomOrLoc, x: xOrOpt, y: y };
    } else if (typeof zoomOrLoc === "object") {
      tileLocation = zoomOrLoc;
    } else {
      throw new Error("Wrong parameter.");
    }

    const queryUrl = this.url
      .replace(/{z}/g, tileLocation.zoom.toString())
      .replace(/{x}/g, tileLocation.x.toString())
      .replace(/{y}/g, tileLocation.y.toString());

    const response = await this.axiosInstance.get(queryUrl);
    return response;
  }
  async getByRect(
    zoom: number,
    cx: number,
    cy: number,
    width: number,
    height: number
  ) {
    const [halfWidth, halfHeight] = [
      Math.floor(width / 2),
      Math.floor(height / 2),
    ];
    const [startX, startY] = [cx - halfWidth, cy - halfHeight];

    const tileLocList = Array(height)
      .fill(null)
      .map((n, y) =>
        Array(width)
          .fill(null)
          .map((n, x) => [x + startX, y + startY])
      )
      .flat();
    const res = await Promise.all(
      tileLocList.map((loc) => this.get(zoom, loc[0], loc[1]))
    );
    return res;
  }
}
