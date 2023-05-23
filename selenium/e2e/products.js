const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('products', () => {
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('firefox').build();
    driver.manage().deleteAllCookies();
  });

  after(async () => {
    await driver.quit();
  });

  beforeEach(async () => {
    await driver.get('http://150.165.75.99:8080/admin');
    await driver.findElement(By.id('_username')).sendKeys('sylius');
    await driver.findElement(By.id('_password')).sendKeys('sylius');
    await driver.findElement(By.css('.primary')).click();
    await driver.sleep(1000);
  });

  it('details is working', async () => {
    await driver.findElement(By.css('a[href="/admin/products/"]')).click();
    await driver.sleep(1000);
    const buttons = await driver.findElements(
      By.css('*[class^="ui labeled icon button "]')
    );
    await buttons[0].click();
    await driver.sleep(1000);
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Sylius Winter 2019'));
  });
});
