
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const crypto = require('crypto');

function randomString() {
  return crypto.randomBytes(20).toString('hex').substring(0, 8);
}

describe('products', () => {
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('firefox').build();
  });

  after(async () => {
    await driver.quit();
  });

  beforeEach(async () => {
    driver.manage().deleteAllCookies();
    await driver.get('http://localhost:8080/admin');
    // await driver.get('http://150.165.75.99:8080/admin');
    await driver.findElement(By.id('_username')).sendKeys('sylius');
    await driver.findElement(By.id('_password')).sendKeys('sylius');
    await driver.findElement(By.css('.primary')).click();
    // await driver.sleep(1000);
  });

  // Remove .only and implement others test cases!
  it('details is listing all variants', async () => {
    // Click in products in side menu
    await driver.findElement(By.css('a[href="/admin/products/"]')).click();

    // Type in value input to search for specify product
    await driver.findElement(By.id('criteria_search_value')).sendKeys('000F office grey jeans');

    // Click in filter blue button
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();

    // Click in details of the remain product
    const buttons = await driver.findElements(By.css('*[class^="ui labeled icon button "]'));
    await buttons[0].click();

    // Assert that details page is listing all variants
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('000F_office_grey_jeans-variant-0'));
    assert(bodyText.includes('000F_office_grey_jeans-variant-1'));
    assert(bodyText.includes('000F_office_grey_jeans-variant-2'));
    assert(bodyText.includes('000F_office_grey_jeans-variant-3'));
    assert(bodyText.includes('000F_office_grey_jeans-variant-4'));
  });

  it('should create a configurable product', async function() {
    await driver.findElement(By.css('a[href="/admin/products/"]')).click();
    await driver.findElement(By.css('.primary > .text')).click();
    await driver.findElement(By.css('[href="/admin/products/new"')).click();

    await driver.findElement(By.css('#sylius_product_code')).sendKeys(randomString());
    await driver.findElement(By.css('#sylius_product_translations_en_US_name')).sendKeys(randomString());
    await driver.findElement(By.css('#sylius_product_translations_en_US_slug')).sendKeys(randomString());
    await driver.findElement(By.css('.primary')).click();

    // Wait for flash message to appear
    await driver.wait(until.elementLocated(By.css('.sylius-flash-message')), 5000);

    // Assert that product has been successfully created
    const flashMessage = await driver.findElement(By.css('.sylius-flash-message')).getText();
    assert.ok(flashMessage.includes('Product has been successfully created.'), 'Product creation failed');
  });

  it('should create a configurable product', async function() {
    await driver.get('http://localhost:8080/admin/products/');
    await driver.findElement(By.css('a[href="/admin/products/"]')).click();
    await driver.findElement(By.css('.primary > .text')).click();
    await driver.findElement(By.css('[href="/admin/products/new"')).click();

    await driver.findElement(By.css('#sylius_product_code')).sendKeys(randomString());
    await driver.findElement(By.css('#sylius_product_translations_en_US_name')).sendKeys(randomString());
    await driver.findElement(By.css('#sylius_product_translations_en_US_slug')).sendKeys(randomString());
    await driver.findElement(By.css('.primary')).click();

    await driver.wait(until.elementLocated(By.css('.sylius-flash-message')), 5000);

    const flashMessage = await driver.findElement(By.css('.sylius-flash-message')).getText();
    assert(flashMessage.includes('Product has been successfully created.'));
  });

  it('should clean filters from list', async function() {
    await driver.get('http://localhost:8080/admin/products/');
    await driver.findElement(By.css('.loadable')).click();
    await driver.findElement(By.css('#criteria_search_value')).sendKeys('Um fitlro');
    await driver.findElement(By.css('#criteria_enabled')).sendKeys('true');
    await driver.findElement(By.css('#criteria_channel')).sendKeys('Fashion Web Store');

    await driver.findElement(By.css('.button[href="/admin/products/"] > .remove')).click();

    const searchValueInput = await driver.findElement(By.css('#criteria_search_value'));
    const searchValue = await searchValueInput.getAttribute('value');

    assert.strictEqual(searchValue, '');
  });

  it('should apply filters in the listing', async function() {
    await driver.get('http://localhost:8080/admin/products/');
    await driver.findElement(By.css('.loadable')).click();
    await driver.findElement(By.css('#criteria_search_value')).sendKeys('jeans');
    await driver.findElement(By.css('#criteria_enabled')).sendKeys('true');
    await driver.findElement(By.css('#criteria_channel')).sendKeys('Fashion Web Store');

    await driver.findElement(By.css('.sylius-filters ~ .icon.button > .icon.search')).click();

    await driver.wait(until.elementLocated(By.css('div.ui.segment.spaceless.sylius-grid-table-wrapper > table > tbody > tr')), 5000);

    const rows = await driver.findElements(By.css('div.ui.segment.spaceless.sylius-grid-table-wrapper > table > tbody > tr'));
    for (const row of rows) {
      const rowText = await row.getText();
      assert(rowText.includes('jeans'));
    }
  });

  it('should be able to edit name/description of a product', async function() {
    await driver.get('http://localhost:8080/admin/products/');
    await driver.findElement(By.css('.button[href="/admin/products/92/edit"')).click();

    await driver.findElement(By.css('#sylius_product_translations_en_US_name')).sendKeys(randomString());
    await driver.findElement(By.css('#sylius_product_translations_en_US_description')).sendKeys(randomString());
    await driver.findElement(By.css('#sylius_save_changes_button')).click();

    await driver.wait(until.elementLocated(By.css('.sylius-flash-message')), 5000);

    const flashMessage = await driver.findElement(By.css('.sylius-flash-message')).getText();
    assert(flashMessage.includes('Product has been successfully updated.'));
  });

  it('should be able to remove the image media from a product', async function() {
    await driver.get('http://localhost:8080/admin/products/');
    await driver.get('http://localhost:8080/admin/products/?page=2');
    await driver.findElement(By.css('.button[href="/admin/products/87/edit"')).click();
    await driver.findElement(By.css('body > div.admin-layout.admin-layout--open > div.admin-layout__body > div.admin-layout__content > div.ui.segment > form > div.ui.stackable.grid.sylius-tabular-form > div.three.wide.column > div > a:nth-child(5)')).click();

    await driver.findElement(By.css('.save.icon')).click();

    await driver.wait(until.elementLocated(By.css('.sylius-flash-message')), 5000);
    const flashMessage = await driver.findElement(By.css('.sylius-flash-message')).getText();
    assert(flashMessage.includes('Product has been successfully updated.'));
  });

  it('should not remove products if the user clicks NO', async function() {
    await driver.get('http://localhost:8080/admin/products/');
    await driver.findElement(By.xpath("//td[contains(text(), '000F_office_grey_jeans')]")).click();
    await driver.findElement(By.xpath("//td[contains(text(), '007M_black_elegance_jeans')]")).click();
    await driver.findElement(By.css('.item:nth-child(2) .bulk-select-checkbox')).click();
    await driver.findElement(By.css('form:nth-child(1) > .red')).click();
    await driver.findElement(By.css('.cancel')).click();

    const table = await driver.findElement(By.css('table'));
    const tableText = await table.getText();
    assert(tableText.includes('000F_office_grey_jeans'));
    assert(tableText.includes('007M_black_elegance_jeans'));
  });

  it('should remove products if the user clicks YES', async function() {
    // Create a product
    const productName = randomString();
    await driver.get('http://localhost:8080/admin/products/');
    await driver.findElement(By.css('a[href="/admin/products/"]')).click();
    await driver.findElement(By.css('.primary > .text')).click();
    await driver.findElement(By.css('[href="/admin/products/new/simple"]')).click();
    await driver.findElement(By.css('#sylius_product_code')).sendKeys(productName);
    await driver.findElement(By.css('#sylius_product_variant_channelPricings_FASHION_WEB_price')).sendKeys('40');
    await driver.findElement(By.css('#sylius_product_translations_en_US_name')).sendKeys(randomString());
    await driver.findElement(By.css('#sylius_product_translations_en_US_slug')).sendKeys(randomString());
    await driver.findElement(By.css('.primary')).click();

    // Filter the product
    await driver.get('http://localhost:8080/admin/products/');
    await driver.findElement(By.css('.loadable')).click();
    await driver.findElement(By.css('#criteria_search_value')).sendKeys(productName);

    // Click on the filter button
    await driver.findElement(By.css('.sylius-filters ~ .icon.button > .icon.search')).click();

    // Remove the product
    await driver.findElement(By.xpath(`//td[contains(text(), '${productName}')]`)).click();
    await driver.findElement(By.css('.item:nth-child(1) .bulk-select-checkbox')).click();
    await driver.findElement(By.css('form:nth-child(1) > .red')).click();
    await driver.findElement(By.css('#confirmation-button')).click();

    await driver.wait(until.elementLocated(By.css('.sylius-flash-message')), 5000);

    const flashMessage = await driver.findElement(By.css('.sylius-flash-message')).getText();
    assert.ok(flashMessage.includes('Products have been successfully deleted.'));
  });

  it('should see the details of a product and add to cart', async function() {
    await driver.get('http://localhost:8080/en_US/products/990m-regular-fit-jeans');
    await driver.findElement(By.css('#main-image')).click();

    let webElement = await driver.findElement(By.css('.lb-close'));
    driver.executeScript("arguments[0].scrollIntoView();", webElement);
    await driver.sleep(3000);
    webElement.click();

    await driver.sleep(1000);

    const quantityInput = await driver.findElement(By.css('#sylius_add_to_cart_cartItem_quantity'));
    await driver.executeScript("arguments[0].value = '2'", quantityInput);
    await driver.findElement(By.css('.primary')).click();

    await driver.wait(until.elementLocated(By.css('.sylius-flash-message')), 5000);

    const flashMessage = await driver.findElement(By.css('.sylius-flash-message')).getText();
    assert.ok(flashMessage.includes('Item has been added to cart'));
  });

});
