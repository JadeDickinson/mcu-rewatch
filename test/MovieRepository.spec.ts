import { SinonMock, mock } from "sinon";
import { createMovieOrderingIdentifier } from "../site/lib/util";
import { expect } from "chai";
import MovieRepository from "../site/lib/MovieRepository";

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

describe("MovieRepository", () => {

    let movieRepository : MovieRepository;
    let storage : MockStorage;
    let storageMock : SinonMock;

    beforeEach(() => {
        storageMock = mock(MockStorage.prototype);
        storage = new MockStorage();
        movieRepository = new MovieRepository(storage);
    });
    
    describe("fetchMovieWatchData", () => {

        it("should get the movie watch data from storage", () => {
            expect.fail();
        });

        it("should throw an error if storage not available", () => {
            expect.fail();
        });

        it("should throw an error if there was an error getting movie watch data from storage", () => {
            expect.fail();
        });

        it("should throw an error if null is returned from storage", () => {
            expect.fail();
        });

    });

    describe("fetchCurrentOrdering", () => {
        const MOVIE_SERIES_NAME : string = "movie-series";
        const EXPECTED_ARG : string = createMovieOrderingIdentifier(MOVIE_SERIES_NAME);
        const ORDERING_FIXTURE : string = "my-ordering";

        it("should get the current ordering name from storage", () => {
            storageMock.expects("getItem").once().withExactArgs(EXPECTED_ARG).returns(ORDERING_FIXTURE);
            
            let currOrdering : string = movieRepository.fetchCurrentOrdering(MOVIE_SERIES_NAME);

            storageMock.verify();
            expect(currOrdering).to.equal(ORDERING_FIXTURE);
        });

        it("should throw an error if storage not available", () => {
            expect.fail();
        });

        it("should throw an error if there was an error getting current ordering name from storage", () => {
            expect.fail();
        });

        it("should throw an error if null is returned from storage", () => {
            expect.fail();
        });

    });

    describe("saveWatchedStatus", () => {
        
        it("should save watch data to storage", () => {
            expect.fail();
        });

        it("should throw an error if storage not available", () => {
            expect.fail();
        });

        it("should throw an error if there was an error saving watch data to storage", () => {
            expect.fail();
        });

    });

    describe("saveCurrentOrdering", () => {

        it("should save ordering name to storage", () => {
            expect.fail();
        });

        it("should throw an error if storage not available", () => {
            expect.fail();
        });

        it("should throw an error if there was an error saving ordering name to storage", () => {
            expect.fail();
        });

    });

    afterEach(() => {
        storageMock.restore();
    });

});