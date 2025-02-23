class ProductManager {
  constructor() {
    this.products = [];
  }

  addProduct(name, price) {
    if (!this.validateProduct(name, price)) {
      return false;
    }
    this.products.push({ id: Date.now(), name, price });
    return true;
  }

  updateProduct(id, name, price) {
    if (!this.validateProduct(name, price)) {
      return false;
    }
    const product = this.products.find((p) => p.id === id);
    if (product) {
      product.name = name;
      product.price = price;
      return true;
    }
    return false;
  }

  deleteProduct(id) {
    this.products = this.products.filter((p) => p.id !== id);
  }

  getProducts() {
    return this.products;
  }

  validateProduct(name, price) {
    if (!name || typeof name !== "string" || name.trim() === "") {
      return false;
    }
    if (isNaN(price) || price <= 0) {
      return false;
    }
    return true;
  }
}

export default ProductManager;
