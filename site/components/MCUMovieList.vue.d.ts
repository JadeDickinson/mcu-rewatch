import MovieSeries from '../lib/MovieSeries';
declare const _default: {
    props: {
        ordering: StringConstructor;
        movieModel: {
            type: () => MovieSeries;
        };
    };
    data: () => {
        watched: any;
        show: boolean[];
    };
    computed: {
        items: () => any;
    };
    components: {
        "mcu-movie": {
            props: {
                movieId: NumberConstructor;
                show: BooleanConstructor;
                presetWatched: BooleanConstructor;
                movieModel: {
                    type: () => MovieSeries;
                };
            };
            data: () => {
                loaded: boolean;
                watched: boolean;
            };
            computed: {
                url: () => string;
            };
            methods: {
                toggleWatch: () => void;
            };
            created: () => void;
        };
    };
    created: () => void;
};
export default _default;
