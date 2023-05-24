const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('orders', () => {
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('firefox').build();
    driver.manage().deleteAllCookies();
  });

  after(async () => {
    await driver.quit();
  });

  beforeEach(async () => {
    await driver.get('http://localhost:8080/admin');
    // await driver.get('http://150.165.75.99:8080/admin');
    await driver.findElement(By.id('_username')).sendKeys('sylius');
    await driver.findElement(By.id('_password')).sendKeys('sylius');
    await driver.findElement(By.css('.primary')).click();
    // await driver.sleep(1000);
  });

  // Remove .only and implement others test cases!
  it.only('details of especify order shows correct values', async () => {
    // Click in orders in side menu
    await driver.findElement(By.linkText('Orders')).click();

    // Type in value input to search for specify order
    await driver.findElement(By.id('criteria_customer_value')).sendKeys('Kelvin');
    // Type in value input to search for specify order
    await driver.findElement(By.id('criteria_total_greaterThan')).sendKeys('1000');

    // Click in filter blue button
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();

    // Click in details of the remain order
    const buttons = await driver.findElements(By.css('*[class^="ui labeled icon button "]'));
    await buttons[0].click();

    // Assert that details page shows important informations
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Cash on delivery'));
    assert(bodyText.includes('$1,221.86'));
    assert(bodyText.includes('Emmanuel Lockman'));
    assert(bodyText.includes('597 Sienna Corners'));
    assert(bodyText.includes('North Alejandrin'));
    assert(bodyText.includes('UNITED KINGDOM 89764-3632'));
  });

  it('test case 2', async () => {
    // Implement your test case 2 code here
  });

  it('test case 3', async () => {
    // Implement your test case 3 code here
  });

  // Implement the remaining test cases in a similar manner
});
