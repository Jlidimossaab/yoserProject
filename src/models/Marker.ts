import { Category } from "./Category";
import { Circuit } from "./Circuit";

export class Marker {
    id?: number;
    lat?: number;
    lon?: number;
    name?: string;
    description?: string;
    path?: string;
    isVisible = true;
    isStartMarker?: any;
    markerSup?: Marker;
    circuit?: Circuit;
    public constructor() { };
}