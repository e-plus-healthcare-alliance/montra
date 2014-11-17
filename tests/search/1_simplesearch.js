module.exports = {
  "Do simple freetext searches" : function (browser) {
    browser
      .url(browser.launchUrl)
      .waitForElementVisible('body', 1000, 'Page loads')
      .pause(1000)
      .setValue('input[name=identification]', 'admin')
      .setValue('input[name=password]', 'emif')
      .click('button[type=submit]')
      .waitForElementVisible('div[id=playground]', 1000, 'Login successful')
      .setValue('#edit-search-block-form--3', 'cardiac')
      .click('.canclear_search .icon-search')
      .pause(2000)
      .assert.elementPresent('#results_size', 'Result loaded for simple search "cardiac"')
      .setValue('#edit-search-block-form--3', "'''%&£ \"\"\"")
      .click('.canclear_search .icon-search')
      .pause(2000)
      .assert.elementPresent('#results_size', 'Result loaded for simple search with characters that should be escaped')
      .end();
  }
};
