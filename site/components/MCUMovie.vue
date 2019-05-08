<template>
    <div id="mcumovie">
        <transition appear name="fade">
            <img v-show="loaded && show"
                v-bind:class="{movie: true, grayscale: !watched}"
                v-bind:src="url" v-on:click="toggleWatch" v-on:load="loaded = true" />
        </transition>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import MovieSeries from '../lib/MovieSeries';
import { VueConstructor } from "vue";

export const MCUMovieVue = Vue.extend({
    props: {
        movieId: Number,
        show: Boolean,
        presetWatched: Boolean,
        movieModel: {
            type: Object as () => MovieSeries
        }
    }
});

@Component
export default class MCUMovie extends MCUMovieVue {

    loaded: boolean = false;
    watched: boolean = false;

    get url () {
        return "assets/img/" + this.movieId + ".jpg";
    }

    toggleWatch () {
        var newWatched = (this.watched) ? false : true;
        this.$set(this, "watched", newWatched);
        this.movieModel.saveWatchedStatus(this.movieId, newWatched);
    }

    created () {
        this.watched = this.presetWatched;
        this.show = true;
    }

};
</script>

<style scoped lang="css">
    .movie {
        height: 160px;
        width: 112px;
    }

    .movie:hover {
        cursor: pointer;
    }

    .grayscale {
        filter: grayscale(100%);
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity 1.5s ease-in-out;
    }

    .fade-enter-to, .fade-leave {
        opacity: 1;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>