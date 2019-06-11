import { createMovieStorageIdentifier } from "./util";
import MovieRepository from "./MovieRepository";
import { Movie, OrderingMap, WatchMap, MovieIdentifier } from "./types";

/**
 * Represents a movie series, with ordering, movies, and a reference
 * to the high-level {@link MovieRepository} object to load/retrieve data from store.
 */
export default class MovieSeries {

    private name : string;
    private movies : Movie[];
    private orderings : OrderingMap;
    private repository : MovieRepository;

    /**
     * Constructs a {@link MovieSeries} instance
     * 
     * @param name name of movie series
     * @param movies movies that are a part of this series
     * @param orderings a map of watch orders
     * @param repository high-level data repository
     */
    public constructor(name : string, movies : Movie[], orderings : OrderingMap, repository : MovieRepository) {
        this.name = name;
        this.movies = movies;
        this.orderings = orderings;
        this.repository = repository;
    }

    /**
     * Get the total number of movies in this series
     * 
     * @returns number representing total number of movies
     */
    public getNumberOfMovies() : number {
        return this.movies.length;
    }

    /**
     * Verify that given movie ordering is a valid ordering for this movie series
     * 
     * @param ordering name of movie series ordering
     * @returns whether this order is a valid ordering name for this movie series
     */
    public verifyOrdering(ordering: string): boolean {
        return (ordering in this.orderings);
    }

    /**
     * Given a movie ordering, returns array of movies respecting the order
     * 
     * @param orderName name of movie series ordering
     * @returns array of movies sorted by the given movie ordering
     */
    public getMoviesByOrder(orderName: string): Movie[] {
        if (!this.verifyOrdering(orderName)) {
            return [];
        }

        return this.orderings[orderName].map((movieID) => {
            return this.movies[movieID - 1];
        });
    }

    /**
     * Get the names of all the ordering options available for this movie series
     * 
     * @returns array of ordering names for this movie series
     */
    public getOrderingOptions(): string[] {
        return Object.keys(this.orderings);
    }

    /**
     * Get the name of the current ordering from the data store
     * 
     * @returns current ordering or empty string if no current ordering available
     */
    public getCurrentOrderingName() : string {
        let currentOrdering: string = this.repository.fetchCurrentOrdering(this.name);
        return currentOrdering != null ? currentOrdering : "";
    }

    /**
     * Get the movie watched data from the data store
     * 
     * @returns map of movie ID to watched pairs
     */
    public getMovieWatchedData() : WatchMap {
        return this.repository.fetchMovieWatchData(this.generateMovieIdentifiers());
    }

    /**
     * Saves given changes to watch status to data store for given movie ID
     * 
     * @param movieID ID of movie to update status for
     * @param watched whether this movie is now watched or not
     */
    public saveWatchedStatus(movieID : number, watched : boolean) : void {
        this.repository.saveWatchedStatus(this.name, movieID, watched);
    }

    /**
     * Saves new current ordering for this movie series to the data store
     * 
     * @param orderingName name of new current ordering for this movie series
     */
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
