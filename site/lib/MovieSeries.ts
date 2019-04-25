import { createMovieStorageIdentifier } from "./util";
import MovieRepository from "./MovieRepository";
import { Movie, OrderingMap, WatchMap, MovieIdentifier } from "./types";

export default class MovieSeries {

    private name : string;
    private movies : Movie[];
    private orderings : OrderingMap;
    private repository : MovieRepository;

    public constructor(name : string, movies : Movie[], orderings : OrderingMap, repository : MovieRepository) {
        this.name = name;
        this.movies = movies;
        this.orderings = orderings;
        this.repository = repository;
    }

    public verifyOrdering(ordering: string): boolean {
        return (ordering in this.orderings);
    }

    public getMoviesByOrder(orderName: string): any[] {
        return this.orderings[orderName].map((val) => {
            var movie = this.movies[val];
            return Object.assign({
                watched: false
            }, movie);
        });
    }

    public getOrderingOptions(): string[] {
        return Object.keys(this.orderings);
    }

    public getCurrentOrderingName() : string {
        return this.repository.fetchCurrentOrdering(this.name);
    }

    public getMovieWatchedData() : WatchMap {
        return this.repository.fetchMovieWatchData(this.generateMovieIdentifiers());
    }

    public saveWatchedStatus(movieID : number, watched : boolean) : void {
        this.repository.saveWatchedStatus(this.name, movieID, watched);
    }

    public saveCurrentOrdering(orderingName : string) : void {
        this.repository.saveCurrentOrdering(this.name, orderingName);
    }

    private generateMovieIdentifiers() : MovieIdentifier[] {
        return this.movies.map((movie) => {
            return {
                storageID: createMovieStorageIdentifier(this.name, movie.id),
                id: movie.id
            };
        });
    }

}
