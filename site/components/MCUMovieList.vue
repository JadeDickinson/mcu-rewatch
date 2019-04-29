<template>
    <div id="mculist">
        <mcu-movie v-bind:movieModel="movieModel" v-for="(item, index) in items" v-bind:key="item.id" 
            v-bind:movie-id="item.id" v-bind:show="show[index]" v-bind:preset-watched="watched[item.id]"></mcu-movie>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import MCUMovie from "./MCUMovie.vue";
import MovieSeries from '../lib/MovieSeries';
import { Movie } from "../lib/types";
import { NUMBER_OF_MCU_MOVIES } from '../lib/constants';

export default {
    props: {
        ordering: String,
        movieModel: {
            type: Object as () => MovieSeries
        }
    },
    data: function() {
        return {
            watched: this.movieModel.getMovieWatchedData(),
            show: (<Array<boolean>>new Array(NUMBER_OF_MCU_MOVIES)).fill(false)
        }
    },
    computed: {
        items: function() : Movie[] {
            return this.movieModel.getMoviesByOrder(this.ordering);
        },
    },
    components: {
        "mcu-movie": MCUMovie
    },
    created: function() {
        for (let i : number = 0; i < NUMBER_OF_MCU_MOVIES; i++) {
            let initialSeconds : number = (200 * (i + 1));
            let speedupFactor : number = 1 + (i / 14);
            setTimeout((index : number) => {
                Vue.set(this.show, index, true);
            }, initialSeconds / speedupFactor, i)
        }
    },
};
</script>

<style scoped lang="css">
    #mculist {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
</style>
