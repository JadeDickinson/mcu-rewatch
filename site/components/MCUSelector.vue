<template>
    <div id="mcuordering">
        <select v-model="selected">
            <option v-bind:key="option" v-for="option in orderingOptions" v-bind:value="option">{{ option }}</option>
        </select>
    </div>
</template>

<script lang="ts">
import MovieSeries from '../lib/MovieSeries';
import { DEFAULT_MCU_ORDER } from '../lib/constants';

const UPDATE_ORDER_ACTION = "update-order";

export default {
    props: {
        movieModel: {
            type: Object as () => MovieSeries
        }
    },
    data: function () {
        return {
            orderingOptions: this.movieModel.getOrderingOptions(),
            currentlySelected: !this.movieModel.verifyOrdering(this.movieModel.getCurrentOrderingName()) ? DEFAULT_MCU_ORDER : this.movieModel.getCurrentOrderingName()
        };
    },
    computed: {
        selected: {
            get() {
                return this.currentlySelected;
            },
            set(value : string) {
                this.currentlySelected = value;
                this.movieModel.saveCurrentOrdering(value);
                this.$emit(UPDATE_ORDER_ACTION, value);
            }
        }
    },
    created() {
        this.$emit(UPDATE_ORDER_ACTION, this.currentlySelected);
    }
}
</script>
