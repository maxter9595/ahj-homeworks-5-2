import Tooltip from "./Tooltip";

class ProductView {
  constructor(manager) {
    this.manager = manager;
    this.container = document.createElement("div");
    this.container.className = "product-container";
    this.tooltip = new Tooltip();
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="product-list">
        <table>
          <thead>
            <tr>
              <th>Название</th>
              <th>Стоимость</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody id="product-table-body"></tbody>
        </table>
      </div>
    `;
    document.getElementById("app").appendChild(this.container);
    this.bindEvents();
    this.renderProducts();
  }

  bindEvents() {
    document
      .getElementById("add-product")
      .addEventListener("click", () => this.showModal());
    document
      .getElementById("save-product")
      .addEventListener("click", () => this.saveProduct());
    document
      .getElementById("cancel-product")
      .addEventListener("click", () => this.hideModal());
    document.getElementById("modal").addEventListener("click", (e) => {
      if (e.target === document.getElementById("modal")) {
        this.hideModal();
      }
    });
  }

  showModal(product = null) {
    const modal = document.getElementById("modal");
    const nameInput = document.getElementById("product-name");
    const priceInput = document.getElementById("product-price");
    this.tooltip.removeAllTooltips();
    if (product) {
      nameInput.value = product.name;
      priceInput.value = product.price;
    } else {
      nameInput.value = "";
      priceInput.value = "";
    }
    modal.style.display = "flex";
  }

  hideModal() {
    const modal = document.getElementById("modal");
    this.currentProductId = null;
    modal.style.display = "none";
    if (this.nameErrorId) {
      this.tooltip.removeTooltip(this.nameErrorId);
      this.nameErrorId = null;
    }
    if (this.priceErrorId) {
      this.tooltip.removeTooltip(this.priceErrorId);
      this.priceErrorId = null;
    }
  }

  saveProduct() {
    const nameInput = document.getElementById("product-name");
    const priceInput = document.getElementById("product-price");
    const name = nameInput.value;
    const price = parseFloat(priceInput.value);
    if (this.nameErrorId) {
      this.tooltip.removeTooltip(this.nameErrorId);
      this.nameErrorId = null;
    }
    if (this.priceErrorId) {
      this.tooltip.removeTooltip(this.priceErrorId);
      this.priceErrorId = null;
    }
    if (!this.manager.validateProduct(name, price)) {
      if (!name || typeof name !== "string" || name.trim() === "") {
        this.nameErrorId = this.tooltip.showTooltip(
          "Название обязательно",
          nameInput,
        );
      }
      if (isNaN(price) || price <= 0) {
        this.priceErrorId = this.tooltip.showTooltip(
          "Стоимость должна быть числом больше 0",
          priceInput,
        );
      }
      return;
    }
    if (this.currentProductId) {
      this.manager.updateProduct(this.currentProductId, name, price);
    } else {
      this.manager.addProduct(name, price);
    }
    this.hideModal();
    this.renderProducts();
  }

  renderProducts() {
    const tbody = document.getElementById("product-table-body");
    tbody.innerHTML = "";
    this.manager.getProducts().forEach((product) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${product.name}</td>
        <td>${product.price.toLocaleString()}</td>
        <td>
          <button class="edit-btn" data-id="${product.id}">✎</button>
          <button class="delete-btn" data-id="${product.id}">✕</button>
        </td>
      `;
      row.querySelector(".edit-btn").addEventListener("click", () => {
        this.currentProductId = product.id;
        this.showModal(product);
      });
      row.querySelector(".delete-btn").addEventListener("click", () => {
        this.manager.deleteProduct(product.id);
        this.renderProducts();
      });
      tbody.appendChild(row);
    });
  }
}

export default ProductView;
