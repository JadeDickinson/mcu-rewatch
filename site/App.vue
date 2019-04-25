<template>
    <div id="app">
        <mcu-selector v-bind:movieModel="movieModel" v-on:update-order="updateOrderingSelection"></mcu-selector>
        <mcu-movie-list v-bind:movieModel="movieModel" v-bind:ordering="selectedOrder"></mcu-movie-list>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import MCUMovieList from "./components/MCUMovieList.vue";
import MCUSelector from "./components/MCUSelector.vue";

import MovieSeries from "./lib/MovieSeries";
import MovieRepository from "./lib/MovieRepository";
import { Movie, OrderingMap } from './lib/types';
import { NUMBER_OF_MCU_MOVIES } from './lib/constants';

import * as movies from "./assets/data/movies.json";
import * as importedOrderings from "./assets/data/orderings.json";

const orderings: OrderingMap = Object.assign(importedOrderings, {
    release: [...Array(NUMBER_OF_MCU_MOVIES).keys()]
});

const mcuMovies = new MovieSeries("mcu", movies, orderings, new MovieRepository(localStorage));

export default {
    data: function() {
        return {
            selectedOrder: "chronological",
            movieModel: mcuMovies
        }
    },
    methods: {
        updateOrderingSelection: function(variable : string) {
            this.selectedOrder = variable;
        }
    },
    components: {
        "mcu-selector": MCUSelector,
        "mcu-movie-list": MCUMovieList
    }
};
</script>

<style>
body {
    background-color: black;
}
</style>
