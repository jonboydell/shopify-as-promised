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

const NOT_EXISTING_CUSTOMER_ID = 'ABCDEFG'

let underTest = null
let testVars = null

before(function () {
  underTest = new Shopify(shopifyConfig)
  assert.isObject(underTest, 'shopify object was not created correctly')
  assert.isObject(shopifyConfig.test, 'no test vars set')
  testVars = shopifyConfig.test
})

it('shopify : get customers (all)', function () {
  this.timeout(5000)
  const promise = underTest.customers()

  return Promise.all([
    promise.should.eventually.be.fulfilled,
    promise.should.eventually.be.an('object'),
    promise.should.eventually.have.property('customers')
  ])
})

it('shopify : get customer (existing)', function () {
  this.timeout(5000)
  const promise = underTest.customer(testVars.existingCustomerId)

  return Promise.all([
    promise.should.eventually.be.fulfilled,
    promise.should.eventually.be.an.instanceof(Object),
    promise.should.eventually.have.property('customer')
  ])
})

it('shopify : get customer (existing)', function () {
  this.timeout(5000)
  const promise = underTest.customerByEmail(testVars.existingCustomerEmail)

  return Promise.all([
    promise.should.eventually.be.fulfilled,
    promise.should.eventually.be.an.instanceof(Object),
    promise.should.eventually.have.property('customer')
  ])
})

it('shopify : get customer (not existing)', function () {
  this.timeout(5000)

  const promise = underTest.customer(NOT_EXISTING_CUSTOMER_ID)
  return Promise.all([
    promise.should.be.rejected
  ])
})

it('shopify : create customer', function () {
  this.timeout(5000)

  const promise = underTest.createCustomer(
    {
      customer: {
        first_name: 'Steve',
        last_name: 'Lastnameson',
        email: 'steve.lastnameson@example.com',
        phone: '+15142546011',
        verified_email: true,
        addresses: [
          {
            address1: '123 Oak St',
            city: 'Ottawa',
            province: 'ON',
            phone: '555-1212',
            zip: '123 ABC',
            last_name: 'Lastnameson',
            first_name: 'Mother',
            country: 'CA'
          }
        ]
      }
    }
  )

  return Promise.all([
    promise.should.eventually.be.fulfilled,
    promise.should.eventually.be.an.instanceof(Object),
    promise.should.eventually.have.property('customer')]
  )
  .then(
    ([response]) => {
      winston.info(`will remove customer ${response.customer.id}`)
      return underTest.deleteCustomer(response.customer.id)
    }
  )
  .then(
    (response) => {
      winston.info(`have removed customer ${response.customer.id}`)
    }
  )
})
