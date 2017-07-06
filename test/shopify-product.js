/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const Shopify = require('../shopify')
const shopifyConfig = require('./config.json')

chai.use(chaiAsPromised)
chai.should()
const assert = chai.assert

describe('shopify product tests', function () {
  const underTest = new Shopify(shopifyConfig)
  const testVars = shopifyConfig.test

  before(function () {
    assert.isObject(underTest, 'shopify object was not created correctly')
    assert.isObject(shopifyConfig.test, 'no test vars set')
  })

  it('shopify : get products', function () {
    this.timeout(5000)

    const promise = underTest.products()

    return Promise.all([
      promise.should.eventually.be.fulfilled,
      promise.should.eventually.be.an.instanceof(Object),
      promise.should.eventually.have.property('products').with.length.of.at.least(1)
    ])
  })

  it('shopify : get product', function () {
    this.timeout(5000)

    const promise = underTest.product(testVars.existingProductId)

    return Promise.all([
      promise.should.eventually.be.fulfilled,
      promise.should.eventually.be.an.instanceof(Object),
      promise.should.eventually.have.property('products').with.length.of.at.least(1)
    ])
  })

  it('shopify : get product (fail)', function () {
    this.timeout(5000)

    const promise = underTest.product('duff product id')

    return Promise.all([
      promise.should.eventually.be.rejected
    ])
  })
})
