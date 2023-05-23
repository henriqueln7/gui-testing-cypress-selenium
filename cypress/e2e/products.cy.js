describe('products', () => {
  it('details is working', () => {
    cy.visit('/admin');
    cy.login('sylius', 'sylius');

    cy.clickInFirst('a[href="/admin/products/"]');

    cy.clickInFirst('*[class^="ui labeled icon button "]');

    cy.get('body').should('contain', 'Sylius Winter 2019');
  });
});
