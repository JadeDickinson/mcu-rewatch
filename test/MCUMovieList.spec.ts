import Vue from "Vue";
import { shallowMount, Wrapper, WrapperArray } from "@vue/test-utils";
import { expect } from "chai";
import MCUMovieList from "../site/components/MCUMovieList.vue";

describe("MCUMovieList", () => {
    let wrapper: Wrapper<Vue>;

    beforeEach(() => {
        wrapper = shallowMount(MCUMovieList);
    });

    it("has a containing div", () => {
        expect(wrapper.element.nodeName).to.equal("DIV");
    });

    it("should contain a complete listing of movies given an ordering configuration", () => {
        expect.fail();
    });

    it("should not have any movie elements on page if no ordering configuration provided", () => {
        expect.fail();
    });

    it("should not have any movie elements on page if ordering configuration provided is an empty array", () => {
        expect.fail();
    });
    
});