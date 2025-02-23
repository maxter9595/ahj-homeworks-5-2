import ProductView from "../ProductView";
import ProductManager from "../ProductManager";

jest.mock("../Tooltip", () => {
  return jest.fn().mockImplementation(() => ({
    showTooltip: jest.fn(() => "tooltip-id"),
    removeTooltip: jest.fn(),
    removeAllTooltips: jest.fn(),
  }));
});

jest.mock("../ProductManager", () => {
  return jest.fn().mockImplementation(() => ({
    addProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
    getProducts: jest.fn(() => []),
    validateProduct: jest.fn(() => true),
  }));
});

describe("ProductView", () => {
  let productView;
  let managerMock;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="app"></div>
      <div id="modal">
        <input id="product-name" />
        <input id="product-price" />
        <button id="save-product"></button>
        <button id="cancel-product"></button>
      </div>
      <button id="add-product"></button>
    `;
    managerMock = new ProductManager();
    productView = new ProductView(managerMock);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("showModal", () => {
    test("should display the modal", () => {
      productView.showModal();
      const modal = document.getElementById("modal");
      expect(modal.style.display).toBe("flex");
    });

    test("should clear inputs when adding a new product", () => {
      productView.showModal();
      const nameInput = document.getElementById("product-name");
      const priceInput = document.getElementById("product-price");
      expect(nameInput.value).toBe("");
      expect(priceInput.value).toBe("");
    });

    test("should populate inputs when editing a product", () => {
      const product = { name: "Test Product", price: 100 };
      productView.showModal(product);
      const nameInput = document.getElementById("product-name");
      const priceInput = document.getElementById("product-price");
      expect(nameInput.value).toBe(product.name);
      expect(priceInput.value).toBe(product.price.toString());
    });
  });

  describe("hideModal", () => {
    test("should hide the modal", () => {
      productView.showModal();
      productView.hideModal();
      const modal = document.getElementById("modal");
      expect(modal.style.display).toBe("none");
    });
  });

  describe("saveProduct", () => {
    test("should add a product if no currentProductId is set", () => {
      const nameInput = document.getElementById("product-name");
      const priceInput = document.getElementById("product-price");
      nameInput.value = "New Product";
      priceInput.value = "100";
      productView.saveProduct();
      expect(managerMock.addProduct).toHaveBeenCalledWith("New Product", 100);
    });

    test("should update a product if currentProductId is set", () => {
      productView.currentProductId = 1;
      const nameInput = document.getElementById("product-name");
      const priceInput = document.getElementById("product-price");
      nameInput.value = "Updated Product";
      priceInput.value = "200";
      productView.saveProduct();
      expect(managerMock.updateProduct).toHaveBeenCalledWith(
        1,
        "Updated Product",
        200,
      );
    });
  });

  describe("renderProducts", () => {
    test("should render products in the table", () => {
      const products = [
        { id: 1, name: "Product 1", price: 100 },
        { id: 2, name: "Product 2", price: 200 },
      ];
      managerMock.getProducts.mockReturnValue(products);
      productView.renderProducts();
      const rows = document.querySelectorAll("#product-table-body tr");
      expect(rows).toHaveLength(2);
    });

    test("should call deleteProduct and renderProducts when delete button is clicked", () => {
      const products = [{ id: 1, name: "Product 1", price: 100 }];
      managerMock.getProducts.mockReturnValue(products);
      productView.renderProducts();
      const deleteButton = document.querySelector(".delete-btn");
      const deleteClickEvent = new Event("click");
      deleteButton.dispatchEvent(deleteClickEvent);
      expect(managerMock.deleteProduct).toHaveBeenCalledWith(1);
      expect(managerMock.getProducts).toHaveBeenCalled();
    });
  });

  test("should bind edit and delete events to buttons", () => {
    const products = [{ id: 1, name: "Product 1", price: 100 }];
    managerMock.getProducts.mockReturnValue(products);
    const showModalSpy = jest.spyOn(productView, "showModal");
    const renderProductsSpy = jest.spyOn(productView, "renderProducts");
    productView.renderProducts();
    const editButton = document.querySelector(".edit-btn");
    const deleteButton = document.querySelector(".delete-btn");
    const editClickEvent = new Event("click");
    editButton.dispatchEvent(editClickEvent);
    expect(productView.currentProductId).toBe(1);
    expect(showModalSpy).toHaveBeenCalledWith(products[0]);
    const deleteClickEvent = new Event("click");
    deleteButton.dispatchEvent(deleteClickEvent);
    expect(managerMock.deleteProduct).toHaveBeenCalledWith(1);
    expect(renderProductsSpy).toHaveBeenCalled();
    showModalSpy.mockRestore();
    renderProductsSpy.mockRestore();
  });

  describe("bindEvents", () => {
    test("should bind click event to add-product button", () => {
      const showModalSpy = jest.spyOn(productView, "showModal");
      const addButton = document.getElementById("add-product");
      const clickEvent = new Event("click");
      addButton.dispatchEvent(clickEvent);
      expect(showModalSpy).toHaveBeenCalled();
      showModalSpy.mockRestore();
    });

    test("should bind click event to save-product button", () => {
      const saveProductSpy = jest.spyOn(productView, "saveProduct");
      const saveButton = document.getElementById("save-product");
      const clickEvent = new Event("click");
      saveButton.dispatchEvent(clickEvent);
      expect(saveProductSpy).toHaveBeenCalled();
      saveProductSpy.mockRestore();
    });

    test("should bind click event to cancel-product button", () => {
      const hideModalSpy = jest.spyOn(productView, "hideModal");
      const cancelButton = document.getElementById("cancel-product");
      const clickEvent = new Event("click");
      cancelButton.dispatchEvent(clickEvent);
      expect(hideModalSpy).toHaveBeenCalled();
      hideModalSpy.mockRestore();
    });

    test("should bind click event to modal for closing", () => {
      const hideModalSpy = jest.spyOn(productView, "hideModal");
      const modal = document.getElementById("modal");
      const clickEvent = new Event("click", { bubbles: true });
      modal.dispatchEvent(clickEvent);
      expect(hideModalSpy).toHaveBeenCalled();
      hideModalSpy.mockRestore();
    });
  });
});
