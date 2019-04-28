import { SinonMock, mock, stub } from "sinon";
import { createMovieOrderingIdentifier, createMovieStorageIdentifier } from "../site/lib/util";
import { expect } from "chai";
import MovieRepository from "../site/lib/MovieRepository";
import { MovieIdentifier, WatchMap } from "../site/lib/types";

class MockStorage implements Storage {
    [name: string]: any;
    length: number;
    clear(): void {}
    getItem(key: string): string {
        return "";
    }
    key(index: number): string {
        return "";
    }
    removeItem(key: string): void {}
    setItem(key: string, value: string): void {}
};

const REAL_IS_STORAGE_AVAILABLE = require.cache[require.resolve("../site/lib/util")].exports.isStorageAvailable;

function mockIsStorageAvailable(result : boolean) : void {
    const isStorageAvailableStub = stub();
    isStorageAvailableStub.returns(result);

    require.cache[require.resolve("../site/lib/util")].exports.isStorageAvailable = isStorageAvailableStub;
}

function clearIsStorageAvailableMock() : void {
    require.cache[require.resolve("../site/lib/util")].exports.isStorageAvailable = REAL_IS_STORAGE_AVAILABLE;
}

describe("MovieRepository", () => {

    let movieRepository : MovieRepository;
    let storage : MockStorage;
    let storageMock : SinonMock;

    const MOVIE_SERIES_NAME : string = "movie-series";

    beforeEach(() => {
        storageMock = mock(MockStorage.prototype);
        storage = new MockStorage();
        movieRepository = new MovieRepository(storage);
    });
    
    describe("fetchMovieWatchData", () => {
        const MOVIE_ID = 1;
        const EXPECTED_ARG : string = createMovieStorageIdentifier(MOVIE_SERIES_NAME, MOVIE_ID);
        const EXPECTED_RET_VALUE: string = "true";
        const MOVIE_IDENTIFIERS_FIXTURE : MovieIdentifier[] = [
            {
                id: MOVIE_ID,
                storageID: EXPECTED_ARG
            }
        ];
        const WATCH_MAP_FIXTURE : WatchMap = {
            [1]: true
        };

        it("should get the movie watch data from storage", () => {
            storageMock.expects("getItem").once().withExactArgs(EXPECTED_ARG).returns(EXPECTED_RET_VALUE);

            let watchInfo : WatchMap = movieRepository.fetchMovieWatchData(MOVIE_IDENTIFIERS_FIXTURE);

            storageMock.verify();
            expect(Object.keys(watchInfo).length).to.equal(1);
            expect(watchInfo[MOVIE_ID]).to.equal(WATCH_MAP_FIXTURE[MOVIE_ID]);
        });

        it("should throw an error if storage not available", () => {
            mockIsStorageAvailable(false);

            try {
                movieRepository.fetchMovieWatchData(MOVIE_IDENTIFIERS_FIXTURE);
                expect.fail();
            } catch (e) {
                expect(e instanceof Error);
                expect((<Error>e).message.toLowerCase()).to.contain("storage not available");
            }
        });

        it("should throw an error if there was an error getting movie watch data from storage", () => {
            storageMock.expects("getItem").once().withExactArgs(EXPECTED_ARG).throwsException("Exception");

            try {
                movieRepository.fetchMovieWatchData(MOVIE_IDENTIFIERS_FIXTURE);
                expect.fail();
            } catch (e) {
                storageMock.verify();
            }
        });

        it("should have watch data of false if null is returned from storage", () => {
            storageMock.expects("getItem").once().withExactArgs(EXPECTED_ARG).returns(null);

            let watchInfo : WatchMap = movieRepository.fetchMovieWatchData(MOVIE_IDENTIFIERS_FIXTURE);

            storageMock.verify();
            expect(Object.keys(watchInfo).length).to.equal(1);
            expect(watchInfo[MOVIE_ID]).to.equal(false);
        });

        afterEach(() => {
            clearIsStorageAvailableMock();
        });

    });

    describe("fetchCurrentOrdering", () => {
        const EXPECTED_ARG : string = createMovieOrderingIdentifier(MOVIE_SERIES_NAME);
        const ORDERING_FIXTURE : string = "my-ordering";

        it("should get the current ordering name from storage", () => {
            storageMock.expects("getItem").once().withExactArgs(EXPECTED_ARG).returns(ORDERING_FIXTURE);
            
            let currOrdering : string = movieRepository.fetchCurrentOrdering(MOVIE_SERIES_NAME);

            storageMock.verify();
            expect(currOrdering).to.equal(ORDERING_FIXTURE);
        });

        it("should throw an error if storage not available", () => {
            mockIsStorageAvailable(false);

            try {
                movieRepository.fetchCurrentOrdering(MOVIE_SERIES_NAME);
                expect.fail();
            } catch (e) {
                expect(e instanceof Error);
                expect((<Error>e).message.toLowerCase()).to.contain("storage not available");
            }
        });

        it("should throw an error if there was an error getting current ordering name from storage", () => {
            storageMock.expects("getItem").once().withExactArgs(EXPECTED_ARG).throwsException("Exception");

            try {
                movieRepository.fetchCurrentOrdering(MOVIE_SERIES_NAME);
                expect.fail();
            } catch (e) {
                storageMock.verify();
            }
        });

        afterEach(() => {
            clearIsStorageAvailableMock();
        });

    });

    describe("saveWatchedStatus", () => {
        const MOVIE_ID : number = 1;
        const WATCHED_STATUS_FIXTURE : boolean = true;
        const EXPECTED_ARGS: string[] = [createMovieStorageIdentifier(MOVIE_SERIES_NAME, MOVIE_ID), WATCHED_STATUS_FIXTURE.toString()];
        
        it("should save watch data to storage", () => {
            mockIsStorageAvailable(true);

            storageMock.expects("setItem").once().withExactArgs(...EXPECTED_ARGS);

            movieRepository.saveWatchedStatus(MOVIE_SERIES_NAME, MOVIE_ID, true);

            storageMock.verify();
        });

        it("should throw an error if storage not available", () => {
            mockIsStorageAvailable(false);

            try {
                movieRepository.saveWatchedStatus(MOVIE_SERIES_NAME, MOVIE_ID, true);
                expect.fail();
            } catch (e) {
                expect(e instanceof Error);
                expect((<Error>e).message.toLowerCase()).to.contain("storage not available");
            }
        });

        it("should throw an error if there was an error saving watch data to storage", () => {
            mockIsStorageAvailable(true);

            storageMock.expects("setItem").once().throwsException("Exception");

            try {
                movieRepository.saveWatchedStatus(MOVIE_SERIES_NAME, MOVIE_ID, true);
                expect.fail();
            } catch (e) {
                storageMock.verify();
            }
        });

        afterEach(() => {
            clearIsStorageAvailableMock();
        });

    });

    describe("saveCurrentOrdering", () => {
        const ORDERING_FIXTURE: string = "my-ordering";
        const EXPECTED_ARGS: string[] = [createMovieOrderingIdentifier(MOVIE_SERIES_NAME), ORDERING_FIXTURE];

        it("should save ordering name to storage", () => {
            mockIsStorageAvailable(true);

            storageMock.expects("setItem").once().withExactArgs(...EXPECTED_ARGS);

            movieRepository.saveCurrentOrdering(MOVIE_SERIES_NAME, ORDERING_FIXTURE);

            storageMock.verify();
        });

        it("should throw an error if storage not available", () => {
            mockIsStorageAvailable(false);

            try {
                movieRepository.saveCurrentOrdering(MOVIE_SERIES_NAME, ORDERING_FIXTURE);
                expect.fail();
            } catch (e) {
                expect(e instanceof Error);
                expect((<Error>e).message.toLowerCase()).to.contain("storage not available");
            }
        });

        it("should throw an error if there was an error saving ordering name to storage", () => {
            mockIsStorageAvailable(true);

            storageMock.expects("setItem").once().throwsException("Exception");

            try {
                movieRepository.saveCurrentOrdering(MOVIE_SERIES_NAME, ORDERING_FIXTURE);
                expect.fail();
            } catch (e) {
                storageMock.verify();
            }
        });

        afterEach(() => {
            clearIsStorageAvailableMock();
        });

    });

    afterEach(() => {
        storageMock.restore();
    });

});