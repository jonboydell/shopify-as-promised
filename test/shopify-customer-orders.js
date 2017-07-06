/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const Shopify = require('../shopify')
const shopifyConfig = require('./config.json')

chai.use(chaiAsPromised)
chai.should()
const assert = chai.assert

describe('shopify customer-order tests', function () {
  const underTest = new Shopify(shopifyConfig)
  const testVars = shopifyConfig.test

  before(function () {
    assert.isObject(underTest, 'shopify object was not created correctly')
    assert.isObject(shopifyConfig.test, 'no test vars set')
  })

  it('shopify : get customer orders', function () {
    this.timeout(5000)
    const promise = underTest.customerOrders(testVars.existingCustomerId)

    return Promise.all([
      promise.should.eventually.be.fulfilled,
      promise.should.eventually.be.an('object'),
      promise.should.eventually.have.property('orders')
    ])
  })

  it('shopify : get customer draft orders', function () {
    this.timeout(5000)
    const promise = underTest.customerDraftOrdersByEmail(testVars.existingCustomerEmail)

    return Promise.all([
      promise.should.eventually.be.fulfilled,
      promise.should.eventually.be.an('object'),
      promise.should.eventually.have.property('draft_orders')
    ])
  })
})
