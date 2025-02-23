const puppeteer = require("puppeteer");

describe("Product Manager E2E Tests", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    page = await browser.newPage();
    await page.goto("http://localhost:9000/");
  }, 30000);

  afterAll(async () => {
    await browser.close();
  });

  test("should add a product", async () => {
    await page.click("#add-product");
    await page.type("#product-name", "Test Product");
    await page.type("#product-price", "100");
    await page.click("#save-product");
    const productName = await page.$eval(
      "#product-table-body tr:first-child td:first-child",
      (el) => el.textContent,
    );
    expect(productName).toBe("Test Product");
  });

  test("should show error for invalid name", async () => {
    await page.click("#add-product");
    await page.type("#product-price", "100");
    await page.click("#save-product");
    await page.waitForSelector(".form-error", {
      visible: true,
      timeout: 5000,
    });
    const errorMessage = await page.$eval(
      ".form-error",
      (el) => el.textContent,
    );
    expect(errorMessage).toBe("Название обязательно");
  });

  test("should show error for invalid price", async () => {
    await page.click("#add-product");
    await page.click("#add-product");
    await page.type("#product-name", "Test Product");
    await page.evaluate(() => {
      const priceInput = document.querySelector("#product-price");
      priceInput.value = "-10";
    });
    const priceValue = await page.$eval("#product-price", (el) => el.value);
    expect(priceValue).toBe("-10");
    await page.waitForSelector("#save-product", {
      visible: true,
      timeout: 5000,
    });
    const saveButton = await page.$("#save-product");
    expect(saveButton).not.toBeNull();
    await page.click("#save-product", { force: true });
    const errorMessage = await page.$eval(
      ".form-error",
      (el) => el.textContent,
    );
    expect(errorMessage).toBe("Стоимость должна быть числом больше 0");
  });

  test("should edit a product", async () => {
    await page.click("#add-product");
    await page.click("#add-product");
    await page.type("#product-name", "Test Product");
    await page.type("#product-price", "100");
    await page.click("#save-product");
    await page.click(".edit-btn");
    await page.type("#product-name", " Updated");
    await page.click("#save-product");
    const productName = await page.$eval(
      "#product-table-body tr:first-child td:first-child",
      (el) => el.textContent,
    );
    expect(productName).toBe("Test Product Updated");
  });

  test("should delete a product", async () => {
    const initialLen = await page.$$eval(
      "#product-table-body tr",
      (rows) => rows.length,
    );
    await page.click("#add-product");
    await page.type("#product-name", "Test Product");
    await page.type("#product-price", "100");
    await page.click("#save-product");
    await page.waitForSelector("#product-table-body tr", { visible: true });
    const lenAfterAdd = await page.$$eval(
      "#product-table-body tr",
      (rows) => rows.length,
    );
    expect(lenAfterAdd).toBe(initialLen + 1);
    await page.click(".delete-btn");
    await page.waitForFunction(
      (initialLen) =>
        document.querySelectorAll("#product-table-body tr").length ===
        initialLen,
      {},
      initialLen,
    );
    const lenAfterDelete = await page.$$eval(
      "#product-table-body tr",
      (rows) => rows.length,
    );
    expect(lenAfterDelete).toBe(initialLen);
  });
});
