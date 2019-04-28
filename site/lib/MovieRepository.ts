import { isStorageAvailable, createMovieStorageIdentifier, createMovieOrderingIdentifier } from "./util";
import { WatchMap, MovieIdentifier } from "./types";

export default class MovieRepository {

    private storage: Storage;

    public constructor(storage: Storage) {
        this.storage = storage;
    }

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

    // TODO change movieName to movieSeriesName
    public fetchCurrentOrdering(movieName : string): string {
        if (!isStorageAvailable(this.storage)) {
            throw new Error("Storage not available");
        }
        
        return this.storage.getItem(createMovieOrderingIdentifier(movieName));
    }

    public saveWatchedStatus(movieName: string, movieID: number, watched: boolean) {
        if (!isStorageAvailable(this.storage)) {
            throw new Error("Storage not available");
        }

        this.storage.setItem(createMovieStorageIdentifier(movieName, movieID), watched.toString());
    }

    public saveCurrentOrdering(movieName: string, ordering: string): void {
        if (!isStorageAvailable(this.storage)) {
            throw new Error("Storage not available");
        }
        
        this.storage.setItem(createMovieOrderingIdentifier(movieName), ordering);
    }

}