class Tooltip {
  constructor() {
    this._tooltips = [];
  }

  showTooltip(message, element) {
    const tooltipElement = document.createElement("div");
    tooltipElement.classList.add("form-error");
    tooltipElement.textContent = message;
    element.parentElement.appendChild(tooltipElement);
    element.parentElement.style.position = "relative";
    const updateTooltipPosition = () => {
      tooltipElement.style.position = "absolute";
      tooltipElement.style.left = `${element.offsetLeft}px`;
      tooltipElement.style.top = `${element.offsetTop + element.offsetHeight + 5}px`;
    };
    const resizeObserver = new ResizeObserver(updateTooltipPosition);
    resizeObserver.observe(element);
    const id = performance.now();
    this._tooltips.push({
      id,
      element: tooltipElement,
      resizeObserver,
    });
    updateTooltipPosition();
    return id;
  }

  removeTooltip(id) {
    const tooltipIndex = this._tooltips.findIndex((t) => t.id === id);
    if (tooltipIndex !== -1) {
      const { element, resizeObserver } = this._tooltips[tooltipIndex];
      element.remove();
      resizeObserver.disconnect();
      this._tooltips.splice(tooltipIndex, 1);
    } else {
      console.warn(`Tooltip with id ${id} not found.`);
    }
  }

  removeAllTooltips() {
    this._tooltips.forEach(({ element, resizeObserver }) => {
      element.remove();
      resizeObserver.disconnect();
    });
    this._tooltips = [];
  }
}

export default Tooltip;
