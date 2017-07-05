/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const winston = require('winston')
const Shopify = require('../shopify')
const shopifyConfig = require('./config.json')

chai.use(chaiAsPromised)
chai.should()
const assert = chai.assert

let underTest = null
let testVars = null

const orderData = {
  order: {
    line_items: [
      {
        variant_id: 1234,
        quantity: 1
      },
    ],
    customer: {
      email: ''
    },
    billing_address: {
      address1: '123 Fake Street',
      address2: '123 Fake Street',
      phone: '555-555-5555',
      city: 'Fakecity',
      province: 'Ontario',
      country: 'Canada',
      zip: 'K2P 1L4'
    },
    shipping_address: {
      address1: '123 Fake Street',
      address2: '123 Fake Street',
      phone: '555-555-5555',
      city: 'Fakecity',
      province: 'Ontario',
      country: 'Canada',
      zip: 'K2P 1L4'
    },
    financial_status: 'pending'
  }
}

const draftOrder = {
  draft_order: {
    line_items: [
      {
        variant_id: 1234,
        quantity: 1
      }
    ],
    email: '',
    billing_address: {
      address1: '123 Fake Street',
      addresss: '123 Fake Street',
      phone: '555-555-5555',
      city: 'Fakecity',
      province: 'Ontario',
      country: 'Canada',
      zip: 'K2P 1L4'
    },
    shipping_address: {
      address1: '123 Fake Street',
      address2: '123 Fake Street',
      phone: '555-555-5555',
      city: 'Fakecity',
      province: 'Ontario',
      country: 'Canada',
      zip: 'K2P 1L4'
    },
    financial_status: 'pending'
  }
}

before(function () {
  underTest = new Shopify(shopifyConfig)
  assert.isObject(underTest, 'shopify object was not created correctly')
  assert.isObject(shopifyConfig.test, 'no test vars set')
  testVars = shopifyConfig.test
  orderData.order.line_items[0].variant_id = testVars.existingProductVariant
  orderData.order.customer.email = testVars.existingCustomerEmail
  draftOrder.draft_order.line_items[0].variant_id = testVars.existingProductVariant
  draftOrder.draft_order.email = testVars.existingCustomerEmail
})

it('shopify orders', function () {
  this.timeout(5000)

  const promise = underTest.orders('any')
  return Promise.all([
    promise.should.eventually.be.fulfilled,
    promise.should.eventually.have.property('orders')
  ])
})

it('shopify draft orders', function () {
  this.timeout(5000)

  const promise = underTest.draftOrders('any')
  return Promise.all([
    promise.should.eventually.be.fulfilled,
    promise.should.eventually.have.property('draft_orders')
  ])
})


it('shopify order : create and update', function () {
  this.timeout(5000)

  const state = {}

  const promise = underTest.createOrder(orderData)
  return Promise.all([
    promise.should.eventually.be.fulfilled,
    promise.should.eventually.be.an.instanceof(Object),
    promise.should.eventually.have.property('order')
  ])
  .then(
    ([response]) => {
      state.orderId = response.order.id
      return underTest.updateOrder(state.orderId, { order: { financial_status: 'paid' } })
    },
    (reason) => {
      winston.info(reason)
    }
  )
  .then(
    (response) => {
      winston.info(`will delete order ${response.order.id}`)
      return underTest.deleteOrder(response.order.id)
    },
    (reason) => {
      winston.info(reason)
    }
  )
})

it('shopify order : create and read', function () {
  this.timeout(5000)

  const state = {}
  const promise = underTest.createOrder(orderData)

  return Promise.all([
    promise.should.eventually.be.fulfilled,
    promise.should.eventually.be.an.instanceof(Object),
    promise.should.eventually.have.property('order')
  ])
  .then(
    ([response]) => {
      state.orderId = response.order.id
      return underTest.order(state.orderId)
    },
    (reason) => {
      winston.info(reason)
    }
  )
  .then(
    (response) => {
      winston.info(`will delete order ${response.order.id}`)
      return underTest.deleteOrder(response.order.id)
    },
    (reason) => {
      winston.info(reason)
    }
  )
})

it('shopify : create draft order, mark as paid', function () {
  this.timeout(5000)

  const promise = underTest.createDraftOrder(draftOrder)

  return Promise.all([
    promise.should.eventually.be.fulfilled,
    promise.should.eventually.be.an.instanceof(Object),
    promise.should.eventually.have.property('draft_order')
  ]).then(
    ([response]) => (
      underTest.completeDraftOrder(response.draft_order.id)
    ),
    (reason) => {
      winston.info(reason)
      return reason
    }
  )
  .then(
    (response) => {
      winston.info(`will delete order ${response.draft_order.order_id}`)
      return underTest.deleteOrder(response.draft_order.order_id)
    },
    (reason) => {
      winston.info(reason)
      return reason
    }
  )
  .then(
    (response) => {
      winston.info(`have removed order ${response.orderId}`)
    }
  )
})

it('shopify : create draft order, delete draft order', function () {
  this.timeout(5000)

  const promise = underTest.createDraftOrder(draftOrder)

  return Promise.all([
    promise.should.eventually.be.fulfilled,
    promise.should.eventually.be.an.instanceof(Object),
    promise.should.eventually.have.property('draft_order')
  ]).then(
    ([response]) => (
      Promise.all([underTest.deleteDraftOrder(response.draft_order.id).should.eventually.be.fulfilled])
    )
  )
})

it('shopify order : delete', function () {
  this.timeout(5000)

  const createOrder = underTest.createOrder(orderData)
  return createOrder
  .then(
    (response) => {
      const promise = underTest.deleteOrder(response.order.id)
      return Promise.all([
        promise.should.eventually.be.fulfilled
      ])
    }
  )
})
