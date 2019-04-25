import Vue from "Vue";
import { shallowMount, Wrapper, WrapperArray } from "@vue/test-utils";
import { expect } from "chai";
import { createSandbox, SinonStub, SinonSandbox } from "sinon";
import MCUSelector from "../site/components/MCUSelector.vue";
import MovieSeries from "../site/lib/MovieSeries";
import { DEFAULT_MCU_ORDER } from "../site/lib/constants"; 
import * as sinonTest from "sinon-test";
import * as sinon from "sinon";

const test = sinonTest.configureTest(sinon);

describe("MCUSelector", () => {
    let wrapper : Wrapper<Vue>;

    let movieModelStub : MovieSeries;

    const TEST_OPTIONS : string[] = ["test1", "test2"];

    beforeEach(test(function() {
        movieModelStub = new MovieSeries("test", [], {}, null);
        movieModelStub.getCurrentOrderingName = this.stub().returns("");
        movieModelStub.verifyOrdering = this.stub().returns(true);
        movieModelStub.getOrderingOptions = this.stub().returns([]);

        wrapper = shallowMount(MCUSelector, {
            propsData: {
                movieModel: movieModelStub
            }
        });
        wrapper.setData({
            orderingOptions: Array.of(...TEST_OPTIONS),
            currentlySelected: TEST_OPTIONS[0]
        });
    }));

    it("has a containing div", () => {
        expect(wrapper.element.nodeName).to.equal("DIV");
    });

    it("should populate the dropdown with options", () => {
        let resultArr : WrapperArray<Vue> = wrapper.findAll("option");

        expect(resultArr.length).to.equal(TEST_OPTIONS.length);

        for (let i = 0; i < TEST_OPTIONS.length; i++) {
            expect(resultArr.at(i).text()).to.equal(TEST_OPTIONS[i]);
        }
    });

    it("should invoke save operation for correct ordering preference when selected", test(function() {
        let saveOrderingStub : SinonStub = this.stub(MovieSeries.prototype, "saveCurrentOrdering");
        
        const OPTION_TO_SAVE: string = TEST_OPTIONS[1];

        let selector: Wrapper<Vue> = wrapper.find("select");
        selector.setValue(OPTION_TO_SAVE);
        
        expect(saveOrderingStub.callCount).to.equal(1);
        
        let firstCallArgs : any[] = saveOrderingStub.args[0];
        expect(firstCallArgs.length).to.equal(1);
        expect(firstCallArgs[0]).to.equal(OPTION_TO_SAVE, "did not invoke save for the correct ordering");
    }));

    it("should contain the currently selected order in its state if it's a valid ordering", test(function() {
        verifyMCUSelectorCurrentlySelected(wrapper, this, TEST_OPTIONS, true);
    }));

    it("should fallback to default ordering as currently selected order if ordering name from local storage is invalid", test(function() {
        verifyMCUSelectorCurrentlySelected(wrapper, this, TEST_OPTIONS, false);
    }));
});

function verifyMCUSelectorCurrentlySelected(wrapper : Wrapper<Vue>, sandbox : SinonSandbox, optionFixtures : string[], mockedVerifyResult : boolean) : void {
    let verifyStub: SinonStub = sandbox.stub(MovieSeries.prototype, "verifyOrdering");
    let orderingStub: SinonStub = sandbox.stub(MovieSeries.prototype, "getCurrentOrderingName");
    let orderingOptionsStub : SinonStub = sandbox.stub(MovieSeries.prototype, "getOrderingOptions");

    const CURR_SELECTED : string = optionFixtures[0];

    verifyStub.returns(mockedVerifyResult);
    orderingStub.returns(CURR_SELECTED);
    orderingOptionsStub.returns(Array.of(...optionFixtures));

    wrapper = shallowMount(MCUSelector, {
        propsData: {
            movieModel: new MovieSeries("test", [], {}, null)
        }
    });

    expect(wrapper.vm.$data["currentlySelected"]).to.equal(mockedVerifyResult ? CURR_SELECTED : DEFAULT_MCU_ORDER);
}
