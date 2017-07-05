const request = require('request')
const assert = require('assert')
const C = require('./constants')

const config = {}

exports.init = (shopifyConfig) => {
  assert.ok(shopifyConfig)
  config.store = shopifyConfig.store
  config.username = shopifyConfig.username
  config.password = shopifyConfig.password
  config.sharedSecret = shopifyConfig.sharedSecret
  config.webhookKey = shopifyConfig.webhookKey
  config.adminUrl = shopifyConfig.adminUrl
  config.returnArray = false
  if (shopifyConfig.returnArray) {
    config.returnArray = shopifyConfig.returnArray
  }
}

/**
 * Gets a customer given their shopify customer id
 */
exports.customer = function (id) {
  assert.ok(id, 'must provide a customer id')
  return new Promise(
    (resolve, reject) => {
      const options = {
        url: `${config.adminUrl}/${C.URL_CUSTOMERS}/${id}${C.URL_JSON_FORMAT}`,
        method: C.HTTP_METHOD_GET,
      }
      request(options, (error, response, body) => {
        if (error) reject(error)
        const json = JSON.parse(body)
        if (C.HTTP_STATUS_OK === response.statusCode) {
          resolve(json)
        } else {
          reject(json)
        }
      }).auth(config.username, config.password, true)
    }
  )
}

/**
 * Returns a customer, given their email
 * @todo: should validate the email addy
 */
exports.customerByEmail = function (email) {
  assert.ok(email, 'must supply a valid email')
  return new Promise(
    (resolve, reject) => {
      const options = {
        url: `${config.adminUrl}/${C.URL_CUSTOMERS}/${C.URL_SEARCH}${C.URL_JSON_FORMAT}?query=${email}`,
        method: C.HTTP_METHOD_GET,
      }
      request(options, (error, response, body) => {
        if (error) reject(error)
        const json = JSON.parse(body)
        if (C.HTTP_STATUS_OK === response.statusCode) {
          if (json.customers.length > 0) {
            resolve({
              customer: json.customers[0]
            })
          } else {
            resolve({})
          }
        } else {
          reject(JSON.parse(body))
        }
      }).auth(config.username, config.password, true)
    }
  )
}

/**
 * Returns all the current customers
 */
exports.customers = function () {
  return new Promise(
    (resolve, reject) => {
      const options = {
        url: `${config.adminUrl}/${C.URL_CUSTOMERS}${C.URL_JSON_FORMAT}`,
        method: C.HTTP_METHOD_GET,
      }
      request(options, (error, response, body) => {
        if (error) reject(error)
        const json = JSON.parse(body)
        if (C.HTTP_STATUS_OK === response.statusCode) {
          if (config.returnArray) { resolve(json.customers) }
          resolve(json)
        } else {
          reject(json)
        }
      }).auth(config.username, config.password, true)
    }
  )
}

/**
 * Creates a new customer record
 * @todo: should check that the customer record has the right details
 */
exports.createCustomer = function (customerDetails) {
  assert.ok(customerDetails, 'must provide new customer details')
  return new Promise(
    (resolve, reject) => {
      const options = {
        url: `${config.adminUrl}/${C.URL_CUSTOMERS}${C.URL_JSON_FORMAT}`,
        method: C.HTTP_METHOD_POST,
        json: customerDetails,
      }
      request(options, (error, response, body) => {
        if (error) reject(error)
        const json = body instanceof Object ? body : JSON.parse(body)
        if (C.HTTP_STATUS_CREATED === response.statusCode) {
          resolve(json)
        } else {
          reject(json)
        }
      }).auth(config.username, config.password, true)
    }
  )
}

exports.updateCustomer = function (customerUpdate) {
  assert.ok(customerUpdate, 'must provide an update object')
  return new Promise(
    (resolve, reject) => {
      const options = {
        url: `${config.adminUrl}/${C.URL_CUSTOMERS}${C.URL_JSON_FORMAT}`,
        method: C.HTTP_METHOD_PUT,
        json: customerUpdate,
      }
      request(options, (error, response, body) => {
        if (error) reject(error)
        const json = JSON.parse(body)
        if (C.HTTP_STATUS_CREATED === response.statusCode) {
          resolve(json)
        } else {
          reject(json)
        }
      }).auth(config.username, config.password, true)
    }
  )
}

/**
 * Deletes a customer given their customer id, does not delete dependent objects (order, draft_order, etc)
 */
exports.deleteCustomer = function (customerId) {
  assert.ok(customerId, 'must provide a customer id')
  return new Promise(
    (resolve, reject) => {
      const options = {
        url: `${config.adminUrl}/${C.URL_CUSTOMERS}/${customerId}${C.URL_JSON_FORMAT}`,
        method: C.HTTP_METHOD_DELETE
      }
      request(options, (error, response, body) => {
        if (error) reject(error)
        if (C.HTTP_STATUS_OK === response.statusCode) {
          resolve({ customer: { id: customerId } })
        } else {
          reject(body)
        }
      }).auth(config.username, config.password, true)
    }
  )
}
