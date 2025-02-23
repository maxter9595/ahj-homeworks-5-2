import Tooltip from "../Tooltip";

class ResizeObserverMock {
  observe() {}
  disconnect() {}
}

beforeAll(() => {
  global.ResizeObserver = ResizeObserverMock;
});

describe("Tooltip", () => {
  let tooltip;
  let testElement;

  beforeEach(() => {
    tooltip = new Tooltip();
    testElement = document.createElement("div");
    testElement.style.width = "100px";
    testElement.style.height = "50px";
    document.body.appendChild(testElement);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("showTooltip", () => {
    test("should create and append a tooltip to the parent element", () => {
      const message = "Test tooltip message";
      const tooltipId = tooltip.showTooltip(message, testElement);
      const tooltipElement =
        testElement.parentElement.querySelector(".form-error");
      expect(tooltipElement).not.toBeNull();
      expect(tooltipElement.textContent).toBe(message);
      expect(tooltip._tooltips).toHaveLength(1);
      expect(tooltip._tooltips[0].id).toBe(tooltipId);
    });

    test("should position the tooltip correctly", () => {
      const message = "Test tooltip message";
      tooltip.showTooltip(message, testElement);
      const tooltipElement =
        testElement.parentElement.querySelector(".form-error");
      expect(tooltipElement.style.position).toBe("absolute");
      expect(tooltipElement.style.left).toBe(`${testElement.offsetLeft}px`);
      expect(tooltipElement.style.top).toBe(
        `${testElement.offsetTop + testElement.offsetHeight + 5}px`,
      );
    });
  });

  describe("removeTooltip", () => {
    test("should remove the tooltip from the DOM and stop observing", () => {
      const tooltipId = tooltip.showTooltip(
        "Test tooltip message",
        testElement,
      );
      tooltip.removeTooltip(tooltipId);
      const tooltipElement =
        testElement.parentElement.querySelector(".form-error");
      expect(tooltipElement).toBeNull();
      expect(tooltip._tooltips).toHaveLength(0);
    });

    test("should log a warning if tooltip with given id is not found", () => {
      const consoleWarnSpy = jest
        .spyOn(console, "warn")
        .mockImplementation(() => {});
      tooltip.removeTooltip(999);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Tooltip with id 999 not found.",
      );
      consoleWarnSpy.mockRestore();
    });
  });

  describe("removeAllTooltips", () => {
    test("should remove all tooltips from the DOM and stop observing", () => {
      tooltip.showTooltip("Tooltip 1", testElement);
      tooltip.showTooltip("Tooltip 2", testElement);
      tooltip.removeAllTooltips();
      const tooltipElements =
        testElement.parentElement.querySelectorAll(".form-error");
      expect(tooltipElements).toHaveLength(0);
      expect(tooltip._tooltips).toHaveLength(0);
    });
  });
});
