import { Category } from "./Category";
import { Level } from "./Level";
import { Marker } from "./Marker";

export class Circuit {
    id?: Number;
    level?: Level;
    category?: Category;
    markers?: Marker[];

    public constructor(){
        
    }
}