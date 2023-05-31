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

    cy.get('.button[href="/admin/products/"] > .remove').click();

    cy.get('#criteria_search_value').should('have.value', '');
  });

  it('should apply filters in the listing', () => {
    cy.visit('http://localhost:8080/admin/products/');
    cy.get('.loadable').click();
    cy.get('#criteria_search_value').type('jeans');
    cy.get('#criteria_enabled').select('true');
    cy.get('#criteria_channel').select('Fashion Web Store');

    //Botão de filtrar

    cy.get('.sylius-filters ~ .icon.button > .icon.search').click();

    cy.get('div.ui.segment.spaceless.sylius-grid-table-wrapper > table > tbody > tr').each((el) => {
      cy.wrap(el).should('contain', 'jeans');
    });
  });

  it('should be able to edit name/description of a product', function() {
    cy.visit('http://localhost:8080/admin/products/');

    cy.get('.button[href="/admin/products/92/edit"').click();

    cy.get('#sylius_product_translations_en_US_name').type(randomString());
    cy.get('#sylius_product_translations_en_US_description').type(randomString());
    cy.get('#sylius_save_changes_button').click();

    cy.get('.sylius-flash-message').should('contain', 'Product has been successfully updated.');
  });

  it('should be able to remove the image media from a product', function() {
    cy.visit('http://localhost:8080/admin/products/');
    cy.visit('http://localhost:8080/admin/products/?page=2');
    cy.get('.button[href="/admin/products/87/edit"').click();
    cy.get('body > div.admin-layout.admin-layout--open > div.admin-layout__body > div.admin-layout__content > div.ui.segment > form > div.ui.stackable.grid.sylius-tabular-form > div.three.wide.column > div > a:nth-child(5)').click();

    cy.get('.save.icon').click();
    cy.get('.sylius-flash-message').should('contain', 'Product has been successfully updated.');

  });

  it('should not remove products if the user click NO', function() {
    cy.visit('http://localhost:8080/admin/products/');
    cy.get('td').contains('000F_office_grey_jeans').click();
    cy.get('td').contains('007M_black_elegance_jeans').click();
    cy.get('.item:nth-child(2) .bulk-select-checkbox').click();
    cy.get('form:nth-child(1) > .red').click();
    cy.get('.cancel').click();

    cy.get('table').contains('td', '000F_office_grey_jeans');
    cy.get('table').contains('td', '007M_black_elegance_jeans');
  });

  it('should remove products if the user click YES', function() {
    //CRIA PRODUTO
    let productName = randomString();
    cy.clickInFirst('a[href="/admin/products/"]');
    cy.get('.primary > .text').click();
    cy.get('[href="/admin/products/new/simple"]').click();
    cy.get('#sylius_product_code').type(productName);
    cy.get('#sylius_product_variant_channelPricings_FASHION_WEB_price').type('40');
    cy.get('#sylius_product_translations_en_US_name').type(randomString());
    cy.get('#sylius_product_translations_en_US_slug').type(randomString());
    cy.get('.primary').click();

    // FILTRA PRODUTO
    cy.visit('http://localhost:8080/admin/products/');
    cy.get('.loadable').click();
    cy.get('#criteria_search_value').type(productName);

    cy.get('.sylius-filters ~ .icon.button > .icon.search').click();



    //REMOVE PRODUTO

    cy.get('td').contains(productName).click();
    cy.get('.item:nth-child(1) .bulk-select-checkbox').click();
    cy.get('form:nth-child(1) > .red').click();
    cy.get('#confirmation-button').click();


    cy.get('.sylius-flash-message').should('contain', 'Products have been successfully deleted.');
  })

  it('should see the details of a product and add to cart', function() {
    cy.visit('http://localhost:8080/en_US/products/990m-regular-fit-jeans');
    cy.get('#main-image').click();
    cy.get('.lb-close').click();
    cy.get('#sylius_add_to_cart_cartItem_variant_jeans_size').select('M');
    cy.get('#sylius_add_to_cart_cartItem_quantity').type('2');
    cy.get('#sylius_add_to_cart_cartItem_quantity').click();
    cy.get('.primary').click();

    cy.get('.sylius-flash-message').should('contain', 'Item has been added to cart');
  });
});
