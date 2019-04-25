import { isStorageAvailable, createMovieStorageIdentifier, createMovieOrderingIdentifier } from "./util";
import { WatchMap, MovieIdentifier } from "./types";

export default class MovieRepository {

    private storage: Storage;

    public constructor(storage: Storage) {
        this.storage = storage;
    }

    public fetchMovieWatchData(identifiers: MovieIdentifier[]): WatchMap {
        if (!isStorageAvailable(this.storage)) {
            console.error("Storage not available");
            return;
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
        return this.storage.getItem(createMovieOrderingIdentifier(movieName));
    }

    public saveWatchedStatus(movieName: string, movieID: number, watched: boolean) {
        if (!isStorageAvailable(this.storage)) {
            console.error("Local storage not available, cannot save");
            return;
        }
        this.storage.setItem(createMovieStorageIdentifier(movieName, movieID), watched.toString());
    }

    public saveCurrentOrdering(movieName: string, ordering: string): void {
        this.storage.setItem(createMovieOrderingIdentifier(movieName), ordering);
    }

}