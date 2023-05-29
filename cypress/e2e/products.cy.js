const crypto = require("crypto")
function randomString() {
  return crypto.randomBytes(20).toString('hex').substring(0, 8);
}

describe('products', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
  });
  it('details is listing all variants', () => {
    // Click in products in side menu
    cy.clickInFirst('a[href="/admin/products/"]');
    // Type in value input to search for specify product
    cy.get('[id="criteria_search_value"]').type('000F office grey jeans');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in details of the remain product
    cy.clickInFirst('*[class^="ui labeled icon button "]');

    // Assert that details page is listing all variants
    cy.get('body')
      .should('contain', '000F_office_grey_jeans-variant-0')
      .and('contain', '000F_office_grey_jeans-variant-1')
      .and('contain', '000F_office_grey_jeans-variant-2')
      .and('contain', '000F_office_grey_jeans-variant-3')
      .and('contain', '000F_office_grey_jeans-variant-4');
  });
  it('should create simple product', () => {
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.get('.primary > .text').click();
    cy.get('[href="/admin/products/new/simple"]').click();
    cy.get('#sylius_product_code').type(randomString());
    cy.get('#sylius_product_variant_channelPricings_FASHION_WEB_price').type('40');
    cy.get('#sylius_product_translations_en_US_name').type(randomString());
    cy.get('#sylius_product_translations_en_US_slug').type(randomString());
    cy.get('.primary').click();
    cy.get('.sylius-flash-message').should('contain', 'Product has been successfully created.');

  });
  it('should create a configurable product', () => {
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.get('.primary > .text').click();
    cy.get('[href="/admin/products/new"').click();

    cy.get('#sylius_product_code').type(randomString());
    cy.get('#sylius_product_translations_en_US_name').type(randomString());
    cy.get('#sylius_product_translations_en_US_slug').type(randomString());
    cy.get('.primary').click();

    cy.get('.sylius-flash-message').should('contain', 'Product has been successfully created.');
  });

  it('should clean filters from list', () => {
    cy.visit('http://localhost:8080/admin/products/');
    cy.get('.loadable').click();
    cy.get('#criteria_search_value').type('Um fitlro');
    cy.get('#criteria_enabled').select('true');
    cy.get('#criteria_channel').select('Fashion Web Store');

    //Click on element with class .button and href=/admin/products
    cy.get('.button[href="/admin/products/"]').click();

    cy.get('#criteria_search_value').should('have.value', '');
  })

  it('should be able to edit name/description of a product', function() {
    cy.visit('http://localhost:8080/admin/products/');

    cy.get('.button[href="/admin/products/20/edit"').click();

    cy.get('#sylius_product_translations_en_US_name').type(randomString());
    cy.get('#sylius_product_translations_en_US_description').type(randomString());
    cy.get('#sylius_save_changes_button').click();

    cy.get('.sylius-flash-message').should('contain', 'Product has been successfully updated.');
  });

  it('should be able to remove the image media from a product', function() {
    cy.visit('http://localhost:8080/admin/products/?page=2');
    cy.get('.button[href="/admin/products/11/edit"').click();
    cy.get('.item[data-tab="media"]').click();

    cy.get['a[data-form-collection="delete"]'].click();

    cy.get('.save.icon').click();
    cy.get('.sylius-flash-message').should('contain', 'Product has been successfully updated.');

  });

  // Implement the remaining test cases in a similar manner
});
