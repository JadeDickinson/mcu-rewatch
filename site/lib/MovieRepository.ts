import { isStorageAvailable, createMovieStorageIdentifier, createMovieOrderingIdentifier } from "./util";
import { WatchMap, MovieIdentifier } from "./types";

/**
 * High-level mechanism to retrieve and store
 * movie watched data to a data store.
 */
export default class MovieRepository {

    private storage: Storage;

    /**
     * Construct an instance of {@link MovieRepository}
     * 
     * @param storage data store
     */
    public constructor(storage: Storage) {
        this.storage = storage;
    }

    /**
     * Fetches movie watched data from storage
     * 
     * @param identifiers a set of movie identifiers to retrieve watched data for
     * @returns a map of movie ID -> watched key-value pairs
     */
    public fetchMovieWatchData(identifiers: MovieIdentifier[]): WatchMap {
        if (!isStorageAvailable(this.storage)) {
            throw new Error("Storage not available");
        }
        
        var watched: WatchMap = {};

        for (let i = 0; i < identifiers.length; i++) {
            let value: string = this.storage.getItem(identifiers[i].storageID);
            watched[identifiers[i].id] = (value === "true");
        }

        return watched;
    }

    /**
     * Given a movie series name, fetches the current ordering setting from storage
     * 
     * @param movieSeriesName movie series name to fetch current ordering for
     * @returns the current ordering of this movie series from storage
     */
    public fetchCurrentOrdering(movieSeriesName : string): string {
        if (!isStorageAvailable(this.storage)) {
            throw new Error("Storage not available");
        }
        
        return this.storage.getItem(createMovieOrderingIdentifier(movieSeriesName));
    }

    /**
     * Given a movie series and movie ID, saves the given watched status
     * 
     * @param movieSeriesName movie series name
     * @param movieID ID of movie
     * @param watched whether this movie is watched
     */
    public saveWatchedStatus(movieSeriesName: string, movieID: number, watched: boolean): void {
        if (!isStorageAvailable(this.storage)) {
            throw new Error("Storage not available");
        }

        this.storage.setItem(createMovieStorageIdentifier(movieSeriesName, movieID), watched.toString());
    }

    /**
     * Saves new ordering setting given movie series
     * 
     * @param movieSeriesName movie series name
     * @param ordering new ordering
     */
    public saveCurrentOrdering(movieSeriesName: string, ordering: string): void {
        if (!isStorageAvailable(this.storage)) {
            throw new Error("Storage not available");
        }
        
        this.storage.setItem(createMovieOrderingIdentifier(movieSeriesName), ordering);
    }

}