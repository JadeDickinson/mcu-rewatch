<template>
    <div id="mcuordering">
        <select v-model="selected">
            <option v-bind:key="option" v-for="option in orderingOptions" v-bind:value="option">{{ option }}</option>
        </select>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import MovieSeries from '../lib/MovieSeries';
import { DEFAULT_MCU_ORDER } from '../lib/constants';
import { VueConstructor } from "vue";

const UPDATE_ORDER_ACTION = "update-order";

/**
 * Props for the MCU movie order selector component
 */
export const MCUSelectorVue = Vue.extend({
    props: {
        movieModel: {
            type: Object as () => MovieSeries
        }
    }
});

/**
 * Represents the MCU movie order selector on the UI.
 */
@Component
export default class MCUSelector extends MCUSelectorVue {

    orderingOptions: string[] = this.movieModel.getOrderingOptions();

    currentlySelected: string = !this.movieModel.verifyOrdering(this.movieModel.getCurrentOrderingName()) ? DEFAULT_MCU_ORDER : this.movieModel.getCurrentOrderingName();
    
    get selected () {
        return this.currentlySelected;
    }

    set selected (value : string) {
        this.currentlySelected = value;
        this.movieModel.saveCurrentOrdering(value);
        this.$emit(UPDATE_ORDER_ACTION, value);
    }

    created () {
        this.$emit(UPDATE_ORDER_ACTION, this.currentlySelected);
    }
}
</script>
