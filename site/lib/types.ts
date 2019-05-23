/**
 * Represents a movie
 */
export type Movie = {
    title: string,
    id: number
};

/**
 * Represents an ordering of movies
 * Each represented in this number array by the movie index
 */
export type Ordering = number[];

/**
 * A map of orderings for a movie series
 * Each movie ordering name is mapped to an {@link Ordering}
 */
export type OrderingMap = { [orderingName: string]: Ordering };

/**
 * A map of movie watched statuses
 * Each movie ID is mapped to a watched status
 */
export type WatchMap = { [movieID: number]: boolean };

/**
 * `storageID` is a unique identifier consisting of movie series name and movie ID concatenated
 * and used to identify the movie in storage, and `id` is the ID of the movie in
 * movie series {@link WatchMap} that should have its status updated
 */
export type MovieIdentifier = {
    storageID: string,
    id : number
};
