<template>
    <div id="mculist">
        <mcu-movie v-bind:movieModel="movieModel" v-for="(item, index) in items" v-bind:key="item.id" 
            v-bind:movie-id="item.id" v-bind:show="show[index]" v-bind:preset-watched="watched[item.id]"></mcu-movie>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import MCUMovie from "./MCUMovie.vue";
import MovieSeries from '../lib/MovieSeries';
import { Movie } from "../lib/types";
import { VueConstructor } from "vue";

/**
 * Props for the MCU movie list component
 */
export const MCUMovieListVue = Vue.extend({
    props: {
        ordering: String,
        movieModel: {
            type: Object as () => MovieSeries
        }
    }
})

/**
 * Represents a list of MCU movies on the UI.
 * Movies are displayed in the order specified by the `ordering` prop,
 * and they are transitioned in through a sequence defined in the `created` mount.
 */
@Component({
    components: {
        "mcu-movie": MCUMovie
    },    
})
export default class MCUMovieList extends MCUMovieListVue {

    watched: any = this.movieModel.getMovieWatchedData();

    show: any = (<Array<boolean>>new Array(this.movieModel.getNumberOfMovies())).fill(false);
    
    get items () : Movie[] {
        return this.movieModel.getMoviesByOrder(this.ordering);
    }
    
    created () {
        for (let i : number = 0; i < this.movieModel.getNumberOfMovies(); i++) {
            let initialSeconds : number = (200 * (i + 1));
            let speedupFactor : number = 1 + (i / 14);
            setTimeout((index : number) => {
                Vue.set(this.show, index, true);
            }, initialSeconds / speedupFactor, i)
        }
    }
    
};
</script>

<style scoped lang="css">
    #mculist {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
</style>
