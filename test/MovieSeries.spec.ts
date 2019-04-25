import { expect } from "chai";
import { SinonStub, SinonMock } from "sinon";
import * as sinon from "sinon";
import * as sinonTest from "sinon-test";
import MovieSeries from "../site/lib/MovieSeries";
import MovieRepository from "../site/lib/MovieRepository";
import { Movie, WatchMap } from "../site/lib/types";
import { OrderingMap } from "../site/lib/types";

const test = sinonTest.configureTest(sinon);

describe("MovieSeries", () => {

    const MOVIE_SERIES_NAME_FIXTURE : string = "test";
    const FIRST_MOVIE: Movie = {
        title: "Test",
        id: 1
    };
    const SECOND_MOVIE: Movie = {
        title: "Test 2",
        id: 2
    };
    const DEFAULT_ORDER_NAME = "release";
    const ALTERNATIVE_ORDER_NAME = "another-ordering";
    const MOVIES_FIXTURE : Movie[] = [FIRST_MOVIE, SECOND_MOVIE];
    const ORDERINGS_FIXTURE : OrderingMap = {
        [DEFAULT_ORDER_NAME]: [0,1],
        [ALTERNATIVE_ORDER_NAME]: [1,0]
    };
    const MOVIE_REPOSITORY_MOCK : MovieRepository = new MovieRepository(null);

    let movieSeries: MovieSeries;

    beforeEach(test(function() {
        movieSeries = new MovieSeries(MOVIE_SERIES_NAME_FIXTURE, MOVIES_FIXTURE, ORDERINGS_FIXTURE, MOVIE_REPOSITORY_MOCK);
    }));

    describe("verifyOrdering", () => {
        it("should correctly verify an ordering that exists in ordering array", () => {
            expect(movieSeries.verifyOrdering(DEFAULT_ORDER_NAME)).to.equal(true);
        });

        it("should return false for ordering that does not exist in ordering array", () => {
            expect(movieSeries.verifyOrdering("not-an-ordering")).to.equal(false);
        });

        it("should return false after attempting to verify ordering in empty ordering array", () => {
            movieSeries = new MovieSeries(MOVIE_SERIES_NAME_FIXTURE, MOVIES_FIXTURE, {}, MOVIE_REPOSITORY_MOCK);
            
            expect(movieSeries.verifyOrdering(DEFAULT_ORDER_NAME)).to.equal(false);
        });
    });

    describe("getMoviesByOrder", () => {
        it("should return correct ordering of movies given an ordering configuration", () => {
            let movieSeq = movieSeries.getMoviesByOrder(ALTERNATIVE_ORDER_NAME);

            expect(movieSeq.length).to.equal(MOVIES_FIXTURE.length);
            expect(movieSeq[0].title).to.equal(SECOND_MOVIE.title);
            expect(movieSeq[1].title).to.equal(FIRST_MOVIE.title);
        });

        it("should throw an exception if attempting to get movies by an ordering that does not exist", () => {
            expect.fail();
        });
    });

    describe("getOrderingOptions", () => {
        it("should return a list of all ordering names", test(function() {
            let orderNames: string[] = movieSeries.getOrderingOptions();

            expect(orderNames).to.contain(DEFAULT_ORDER_NAME);
            expect(orderNames).to.contain(ALTERNATIVE_ORDER_NAME);
        }));

        it("should return an empty array if there aren't any orderings", test(function() {
            movieSeries = new MovieSeries(MOVIE_SERIES_NAME_FIXTURE, MOVIES_FIXTURE, {}, MOVIE_REPOSITORY_MOCK);

            expect(movieSeries.getOrderingOptions().length).to.equal(0);
        }));
    });

    describe("getCurrentOrderingName", () => {
        it("should get movie ordering preference from repository", test(function() {
            let fetchMovieOrderingStub : SinonStub = this.stub(MovieRepository.prototype, "fetchCurrentOrdering");
            fetchMovieOrderingStub.returns(DEFAULT_ORDER_NAME);

            expect(movieSeries.getCurrentOrderingName()).to.equal(DEFAULT_ORDER_NAME);
        }));

        it("should return first value from ordering array as fallback if repository not available", () => {
            expect.fail();
        });
    });

    describe("getMovieWatchedData", () => {
        it("should get watch data for all movies from repository", test(function() {
            let fetchMovieDataStub : SinonStub = this.stub(MovieRepository.prototype, "fetchMovieWatchData");
            fetchMovieDataStub.returns(MOVIES_FIXTURE.reduce((obj, currVal): WatchMap => {
                obj[currVal.id] = true;
                return obj;
            }, <WatchMap>{}));

            let watchData: WatchMap = movieSeries.getMovieWatchedData();

            MOVIES_FIXTURE.forEach((elem) => {
                expect(watchData[elem.id]).to.equal(true);
            });
        }));

        it("should return a fallback array with all watched values set to false if there was an error with repository", test(function() {
            expect.fail();
        }));
    });

    describe("saveMCUStatus", () => {
        it("should save watched status of a movie to repository", test(function() {
            let saveWatchedStatusMock : SinonMock = this.mock(MovieRepository.prototype);

            saveWatchedStatusMock.expects("saveWatchedStatus").once().withExactArgs(MOVIE_SERIES_NAME_FIXTURE, FIRST_MOVIE.id, true);

            movieSeries.saveWatchedStatus(FIRST_MOVIE.id, true);

            saveWatchedStatusMock.verify();
        }));

        it("should not attempt to save watch status of a movie if repository not available", test(function() {
            expect.fail();
        }));
    });

    describe("saveCurrentOrdering", () => {
        it("should save movie ordering preference to repository", test(function() {
            let saveOrderingMock : SinonMock = this.mock(MovieRepository.prototype);

            saveOrderingMock.expects("saveCurrentOrdering").once().withExactArgs(MOVIE_SERIES_NAME_FIXTURE, ALTERNATIVE_ORDER_NAME);

            movieSeries.saveCurrentOrdering(ALTERNATIVE_ORDER_NAME);

            saveOrderingMock.verify();
        }));

        it("should not attempt to save movie ordering preference if repository not available", () => {
            expect.fail();
        });
    });

});