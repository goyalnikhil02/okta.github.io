const BlogPage = require('../framework/page-objects/BlogPage');
const util = require('../framework/shared/util');

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

describe('blog page spec', () => {
  const blogPage = new BlogPage('/blog/');

  beforeEach(util.itHelper(async () => {
    await blogPage.resizeXLarge();
    await blogPage.navigate('/blog/');
    await blogPage.refresh();
  }));

  it('has blog posts', util.itHelper (async () => {
    expect(await blogPage.getBlogPostCount(), 'expects blog post count to be > 0').to.be.greaterThan(0);
  }));

  it('has read more links', util.itHelper (async () => {
    var blogLinkHref = await blogPage.getBlogLinkHref(1);
    await blogPage.clickReadMoreOnPost(1);
    await blogPage.waitForPresence(blogPage.getFooterElement());
    expect(blogLinkHref, 'expects blog link href to contain current URL').to.contain(await blogPage.getCurrentURL());
  }));

  it('has pagination', util.itHelper(async () => {
    expect(await blogPage.isPaginationVisible(), 'expects pagination to be visible').to.be.true;
  }));

  it('navigates to next link', util.itHelper(async () => {
    await blogPage.navigate('/blog/');
    await blogPage.clickNext();
    await blogPage.waitForPresence(blogPage.getFooterElement());
    expect(await blogPage.getCurrentURL(), 'expects current URL to equal expected').to.equal('/blog/page/2/');
  }));

  it('navigates to previous link', util.itHelper(async () => {
    await blogPage.navigate('/blog/page/2');
    await blogPage.clickPrevious();
    await blogPage.waitForPresence(blogPage.getFooterElement());
    expect(await blogPage.getCurrentURL(), 'expects current URL to equal expected').to.equal('/blog/');
  }));

  it('navigates to specific page link (2)', util.itHelper(async () => {
    await blogPage.clickItem(2);
    await blogPage.waitForPresence(blogPage.getFooterElement());
    expect(await blogPage.getCurrentURL(), 'expects current URL to equal expected').to.equal('/blog/page/2/');
  }));

  it('navigates to specific page link (1)', util.itHelper(async () => {
    await blogPage.navigate('/blog/page/2');
    await blogPage.clickItem(1);
    await blogPage.waitForPresence(blogPage.getFooterElement());
    expect(await blogPage.getCurrentURL(), 'expects current URL to equal expected').to.equal('/blog/');
  }));
});
