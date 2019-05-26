/**
 * Checks availablity of given storage implementation within the browser
 * 
 * @remarks
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
 * 
 * @param storage storage to check
 * @returns whether this storage is available to use
 */
export function isStorageAvailable(storage : Storage): boolean {
    try {
        let x: string = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
};

/**
 * Creates the key identifier string to be used for identifying this movie's watched status in storage
 * 
 * @param movieSeriesName movie series name
 * @param movieID ID of movie
 * @returns movie identifier string
 */
export function createMovieStorageIdentifier(movieSeriesName : string, movieID : number) : string {
    return movieSeriesName + "." + movieID;
};

/**
 * Creates the key identifier string to be used for identifying this movie series' order in storage
 * 
 * @param movieSeriesName movie series name
 * @returns movie ordering identifier string
 */
export function createMovieOrderingIdentifier(movieSeriesName : string) {
    return movieSeriesName + ".ordering";
};
