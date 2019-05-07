import Vue from "vue";
import { Movie } from "../lib/types";
import { VueConstructor } from "vue";
export declare const MCUMovieListVue: VueConstructor<{
    ordering: any;
    movieModel: any;
} & Vue>;
export default class MCUMovieList extends MCUMovieListVue {
    watched: any;
    show: any;
    readonly items: Movie[];
    created(): void;
}
