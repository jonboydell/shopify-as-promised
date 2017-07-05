const assert = require('assert')
const crypto = require('crypto')
const shopifyOrders = require('./shopify-order')
const shopifyProducts = require('./shopify-product')
const shopifyCustomers = require('./shopify-customer')
const shopifyCustomerOrders = require('./shopify-customer-order')
const C = require('./constants')

const config = {
  store: null,
  username: null,
  password: null,
  sharedSecret: null,
  webhookKey: null,
  adminUrl: null
}

/**
 * This module is intened to promisify all the shopify API calls
 *
 * Constructor configures the shopify module
 */
const Shopify = function (shopifyConfig) {
  assert.ok(shopifyConfig, 'must supply configuration')
  const mandatory = ['store', 'username', 'password']
  mandatory.forEach((option) => {
    assert.ok(shopifyConfig[option], `must set option ${option}`)
  })
  config.store = shopifyConfig.store
  config.username = shopifyConfig.username
  config.password = shopifyConfig.password
  config.sharedSecret = shopifyConfig.sharedSecret
  config.webhookKey = shopifyConfig.webhookKey
  config.adminUrl = `https://${shopifyConfig.store}.myshopify.com/admin`

  shopifyOrders.init(config)
  shopifyProducts.init(config)
  shopifyCustomers.init(config)
  shopifyCustomerOrders.init(config)
}

Shopify.prototype.config = () => (
  config
)

/**
 * Creates a new customer record
 */
Shopify.prototype.createCustomer = customerDetails => (
  shopifyCustomers.createCustomer(customerDetails)
)

/**
 * Returns all the current customers
 */
Shopify.prototype.customers = () => (
  shopifyCustomers.customers()
)

/**
 * Returns a customer by id
 */
Shopify.prototype.customer = id => (
  shopifyCustomers.customer(id)
)

/**
 * Returns a customer by email
 */
Shopify.prototype.customerByEmail = email => (
  shopifyCustomers.customerByEmail(email)
)

/**
 * Deletes a customer given their id
 */
Shopify.prototype.deleteCustomer = customerId => (
  shopifyCustomers.deleteCustomer(customerId)
)

/**
 * Updates a customer record
 */
Shopify.prototype.updateCustomer = customerUpdate => (
  shopifyCustomers.updateCustomer(customerUpdate)
)

/**
 * Returns all the customer orders for a specific customer id and status
 * @todo: why is this customer id and not email and can we have separate methods for both?
 */
Shopify.prototype.customerOrders = (customerId, status) => (
  shopifyCustomerOrders.customerOrders(customerId, status)
)

/**
 * Returns all the customer draft orders for a specific email and status
 * @todo: email, not id, see 'customerOrders'
 */
Shopify.prototype.customerDraftOrdersByEmail = (email, status) => (
  shopifyCustomerOrders.customerDraftOrdersByEmail(email, status)
)

/**
 * Will delete all the draft orders associated with the customer email provided
 */
Shopify.prototype.deleteCustomerDraftOrders = email => (
  shopifyCustomerOrders.deleteCustomerDraftOrders(email)
)

/**
 * Returns all the products from the current store
 */
Shopify.prototype.products = () => (
  shopifyProducts.products()
)

/**
 * Returns a product, given the shopify id
 * @todo: array to string for id
 */
Shopify.prototype.product = id => (
  shopifyProducts.product(id)
)

/**
 * returns all of the orders with a given status
 */
Shopify.prototype.orders = status => (
  shopifyOrders.order(status)
)

/**
 * Returns all the draft orders with a given status
 */
Shopify.prototype.draftOrders = status => (
  shopifyOrders.draftOrders(status)
)

/**
 * Deletes a draft order
 */
Shopify.prototype.deleteDraftOrder = draftOrderId => (
  shopifyOrders.deleteDraftOrder(draftOrderId)
)

/**
 * Retrieves a shopify order, given it's id
 */
Shopify.prototype.order = orderId => (
  shopifyOrders.order(orderId)
)

/**
 * Updates an order
 * @todo: validate order details object
 */
Shopify.prototype.updateOrder = (orderId, orderDetails) => (
  shopifyOrders.updateOrder(orderId, orderDetails)
)

/**
 * Deletes an order
 */
Shopify.prototype.deleteOrder = orderId => (
  shopifyOrders.deleteOrder(orderId)
)

Shopify.prototype.createOrder = orderDetails => (
  shopifyOrders.createOrder(orderDetails)
)

Shopify.prototype.createDraftOrder = orderDetails => (
  shopifyOrders.createDraftOrder(orderDetails)
)

Shopify.prototype.completeDraftOrder = draftOrderId => (
  shopifyOrders.completeDraftOrder(draftOrderId)
)

Shopify.prototype.orders = status => (
  shopifyOrders.orders(status)
)

Shopify.prototype.draftOrders = status => (
  shopifyOrders.draftOrders(status)
)

Shopify.prototype.deleteDraftOrder = draftOrderId => (
  shopifyOrders.deleteDraftOrder(draftOrderId)
)

Shopify.prototype.order = orderId => (
  shopifyOrders.order(orderId)
)

Shopify.prototype.updateOrder = (orderId, orderDetails) => (
  shopifyOrders.updateOrder(orderId, orderDetails)
)

Shopify.prototype.deleteOrder = orderId => (
  shopifyOrders.deleteOrder(orderId)
)

/**
 * @todo: implement this
 */
Shopify.prototype.createWebhook = () => (
  Promise.reject('not implemented')
)

/**
 * @todo: this method uses the webhook key paramater, but webhook secrets might need to be calculated
 * using the shared secret if they were created by the API - also this method doens't return a promise
 * which it really should
 */
const calculateWebhookSignature = Shopify.prototype.calculateWebhookSignature = (requestBody) => {
  assert.ok(requestBody, 'must supply the raw request body')
  return crypto.createHmac(C.CRYPTO_ALGO, config.webhookKey).update(requestBody).digest(C.CRYPTO_ENCODING)
}

Shopify.prototype.checkWebhookSignature = (requestBody, webhookSignature) => {
  assert.ok(webhookSignature, 'must supply the shopify supplied webhook signature')
  return calculateWebhookSignature(requestBody) === webhookSignature
}

module.exports = Shopify
