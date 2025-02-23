import ProductManager from "./ProductManager";
import ProductView from "./ProductView";

document.addEventListener("DOMContentLoaded", () => {
  const manager = new ProductManager();
  new ProductView(manager);
});
