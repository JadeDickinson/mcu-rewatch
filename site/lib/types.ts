export type Movie = {
    title: string,
    id: number
};

export type Ordering = number[];

export type OrderingMap = { [orderingName: string]: Ordering };

export type WatchMap = { [movieID: number]: boolean };

export type MovieIdentifier = {
    storageID: string,
    id : number
};
