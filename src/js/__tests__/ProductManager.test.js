import ProductManager from "../ProductManager";

describe("ProductManager", () => {
  let manager;

  beforeEach(() => {
    manager = new ProductManager();
  });

  test("should add a valid product", () => {
    const result = manager.addProduct("Product 1", 100);
    expect(result).toBe(true);
    expect(manager.getProducts()).toHaveLength(1);
  });

  test("should not add a product with invalid name", () => {
    const result = manager.addProduct("", 100);
    expect(result).toBe(false);
    expect(manager.getProducts()).toHaveLength(0);
  });

  test("should not add a product with invalid price", () => {
    const result = manager.addProduct("Product 1", -10);
    expect(result).toBe(false);
    expect(manager.getProducts()).toHaveLength(0);
  });

  test("should update a product", () => {
    manager.addProduct("Product 1", 100);
    const productId = manager.getProducts()[0].id;
    const result = manager.updateProduct(productId, "Updated Product", 200);
    expect(result).toBe(true);
    const updatedProduct = manager.getProducts()[0];
    expect(updatedProduct.name).toBe("Updated Product");
    expect(updatedProduct.price).toBe(200);
  });

  test("should not update a product with invalid name", () => {
    manager.addProduct("Product 1", 100);
    const productId = manager.getProducts()[0].id;
    const result = manager.updateProduct(productId, "", 200);
    expect(result).toBe(false);
    const product = manager.getProducts()[0];
    expect(product.name).toBe("Product 1");
    expect(product.price).toBe(100);
  });

  test("should not update a product with invalid price", () => {
    manager.addProduct("Product 1", 100);
    const productId = manager.getProducts()[0].id;
    const result = manager.updateProduct(productId, "Updated Product", -10);
    expect(result).toBe(false);
    const product = manager.getProducts()[0];
    expect(product.name).toBe("Product 1");
    expect(product.price).toBe(100);
  });

  test("should not update a non-existent product", () => {
    const result = manager.updateProduct(999, "Updated Product", 200);
    expect(result).toBe(false);
  });

  test("should delete a product", () => {
    manager.addProduct("Product 1", 100);
    const productId = manager.getProducts()[0].id;
    manager.deleteProduct(productId);
    expect(manager.getProducts()).toHaveLength(0);
  });

  test("should not throw error when deleting a non-existent product", () => {
    expect(() => manager.deleteProduct(999)).not.toThrow();
  });

  test("should validate product with valid name and price", () => {
    const result = manager.validateProduct("Valid Product", 100);
    expect(result).toBe(true);
  });

  test("should not validate product with empty name", () => {
    const result = manager.validateProduct("", 100);
    expect(result).toBe(false);
  });

  test("should not validate product with non-string name", () => {
    const result = manager.validateProduct(123, 100);
    expect(result).toBe(false);
  });

  test("should not validate product with negative price", () => {
    const result = manager.validateProduct("Valid Product", -10);
    expect(result).toBe(false);
  });

  test("should not validate product with non-number price", () => {
    const result = manager.validateProduct("Valid Product", "not a number");
    expect(result).toBe(false);
  });
});
