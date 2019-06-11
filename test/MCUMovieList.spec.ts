import { shallowMount, Wrapper, WrapperArray } from "@vue/test-utils";
import { expect } from "chai";
import { stub, SinonStub } from "sinon";
import { Movie, OrderingMap } from "../site/lib/types";
import MCUMovieList from "../site/components/MCUMovieList.vue";
import MovieSeries from "../site/lib/MovieSeries";

describe("MCUMovieList", () => {
    let wrapper: Wrapper<MCUMovieList>;

    let movieModelStub: MovieSeries;
    let mockGetMovieWatchedData: SinonStub;

    const TEST_MOVIES: Movie[] = [
        {
            title: "Movie 1",
            id: 1
        },
        {
            title: "Movie 2",
            id: 2
        }
    ];

    const TEST_ORDERINGS: OrderingMap = {
        "test": [1,2]
    };

    beforeEach(() => {
        mockGetMovieWatchedData = stub(MovieSeries.prototype, "getMovieWatchedData");
        mockGetMovieWatchedData.returns([false, false]);

        movieModelStub = new MovieSeries("test", [], {}, null);
        
        wrapper = shallowMount(MCUMovieList, {
            propsData: {
                movieModel: movieModelStub
            },
            computed: {
                items: function() {
                    return TEST_MOVIES.map((elem: any) => {
                        return elem;
                    });
                }
            },
            mocks: {
                watched: [false, false],
                show: [false, false]
            }
        });
    });

    it("has a containing div", () => {
        expect(wrapper.element.nodeName).to.equal("DIV");
    });

    it("should contain a complete listing of movies given an ordering configuration", () => {
        movieModelStub = new MovieSeries("test", TEST_MOVIES, TEST_ORDERINGS, null);

        wrapper = shallowMount(MCUMovieList, {
            propsData: {
                movieModel: movieModelStub,
                ordering: "test"
            },
            mocks: {
                watched: [false, false],
                show: [false, false]
            }
        });

        TEST_MOVIES.forEach((elem: Movie, index) => {
            expect(wrapper.vm.items[index].id).to.equal(elem.id);
        });
    });

    it("should not have any movie elements on page if no ordering configuration provided", () => {
        movieModelStub = new MovieSeries("test", TEST_MOVIES, {}, null);

        wrapper = shallowMount(MCUMovieList, {
            propsData: {
                movieModel: movieModelStub,
                ordering: "test"
            },
            mocks: {
                watched: [false, false],
                show: [false, false]
            }
        });

        expect(wrapper.vm.items.length).to.equal(0);
    });

    it("should not have any movie elements on page if ordering configuration provided is an empty array", () => {
        movieModelStub = new MovieSeries("test", TEST_MOVIES, {"test": []}, null);

        wrapper = shallowMount(MCUMovieList, {
            propsData: {
                movieModel: movieModelStub,
                ordering: "test"
            },
            mocks: {
                watched: [false, false],
                show: [false, false]
            }
        });

        expect(wrapper.vm.items.length).to.equal(0);
    });

    afterEach(() => {
        mockGetMovieWatchedData.restore();
    });
    
});