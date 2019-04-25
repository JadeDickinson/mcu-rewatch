import MovieSeries from '../lib/MovieSeries';
declare const _default: {
    props: {
        movieModel: {
            type: () => MovieSeries;
        };
    };
    data: () => {
        orderingOptions: any;
        currentlySelected: any;
    };
    computed: {
        selected: {
            get(): any;
            set(value: string): void;
        };
    };
    created(): void;
};
export default _default;
