const request = require('request')
const assert = require('assert')
const C = require('./constants')
const winston = require('winston')

const config = {}

exports.init = (shopifyConfig) => {
  assert.ok(shopifyConfig)
  config.store = shopifyConfig.store
  config.username = shopifyConfig.username
  config.password = shopifyConfig.password
  config.sharedSecret = shopifyConfig.sharedSecret
  config.webhookKey = shopifyConfig.webhookKey
  config.adminUrl = shopifyConfig.adminUrl
}

/**
 * Creates a shopify order
 * @todo: validare orderDetails object
 */
exports.createOrder = function (orderDetails) {
  assert.ok(orderDetails)
  return new Promise(
    (resolve, reject) => {
      const options = {
        url: `${config.adminUrl}/${C.URL_ORDERS}${C.URL_JSON_FORMAT}`,
        method: C.HTTP_METHOD_POST,
        json: orderDetails,
      }
      request(options, (error, response, body) => {
        if (error) reject(error)
        if (C.HTTP_STATUS_CREATED === response.statusCode) {
          resolve(body)
        } else {
          reject(body)
        }
      }).auth(config.username, config.password, true)
    }
  )
}

/**
 * Creates a draft order
 * @todo: validate order details object
 */
exports.createDraftOrder = function (orderDetails) {
  assert.ok(orderDetails)
  return new Promise(
    (resolve, reject) => {
      const options = {
        url: `${config.adminUrl}/${C.URL_DRAFT_ORDERS}${C.URL_JSON_FORMAT}`,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: C.HTTP_METHOD_POST,
        json: orderDetails,
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

/**
 * Compeltes a draft order
 */
exports.completeDraftOrder = function (draftOrderId) {
  assert.ok(draftOrderId, 'must provide a draft order id')
  return new Promise(
    (resolve, reject) => {
      const options = {
        url: `${config.adminUrl}/${C.URL_DRAFT_ORDERS}/${draftOrderId}/${C.URL_DRAFT_ORDER_COMPLETE}${C.URL_JSON_FORMAT}?payment_pending=false`,
        method: C.HTTP_METHOD_PUT,
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

exports.orders = function (status) {
  assert.ok(status)
  return new Promise(
    (resolve, reject) => {
      const options = {
        url: `${config.adminUrl}/${C.URL_ORDERS}${C.URL_JSON_FORMAT}?status=${status}`,
        method: C.HTTP_METHOD_GET,
      }
      request.get(options, (error, response, body) => {
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

exports.draftOrders = function (status) {
  assert.ok(status)
  return new Promise(
    (resolve, reject) => {
      const options = {
        url: `${config.adminUrl}/${C.URL_DRAFT_ORDERS}${C.URL_JSON_FORMAT}?status=${status}`,
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
 * Deletes a draft order
 */
exports.deleteDraftOrder = function (draftOrderId) {
  assert.ok(Number.isSafeInteger(draftOrderId), 'draft order id must be provided, and must be an integer')
  return new Promise(
    (resolve, reject) => {
      const options = {
        url: `${config.adminUrl}/${C.URL_DRAFT_ORDERS}/${draftOrderId}${C.URL_JSON_FORMAT}`,
        method: C.HTTP_METHOD_DELETE
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
 * Retrieves a shopify order, given it's id
 */
exports.order = function (orderId) {
  assert.ok(orderId)
  return new Promise(
    (resolve, reject) => {
      const options = {
        url: `${config.adminUrl}/${C.URL_ORDERS}/${orderId}${C.URL_JSON_FORMAT}`,
        method: C.HTTP_METHOD_GET
      }
      request(options, (error, response, body) => {
        if (error) reject(error)
        const json = body instanceof Object ? body : JSON.parse(body)
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
 * Updates an order
 * @todo: validate order details object
 */
exports.updateOrder = function (orderId, orderDetails) {
  assert.ok(orderId, 'must provide an order id')
  assert.ok(orderDetails, 'must provide updated order details')
  return new Promise(
    (resolve, reject) => {
      const options = {
        url: `${config.adminUrl}/${C.URL_ORDERS}/${orderId}${C.URL_JSON_FORMAT}`,
        method: C.HTTP_METHOD_PUT,
        json: orderDetails,
      }
      request(options, (error, response, body) => {
        if (error) reject(error)
        const json = body instanceof Object ? body : JSON.parse(body)
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
 * Deletes an order
 */
exports.deleteOrder = function (orderId) {
  assert.ok(orderId, 'must provide an order id')
  return new Promise(
    (resolve, reject) => {
      const options = {
        url: `${config.adminUrl}/${C.URL_ORDERS}/${orderId}${C.URL_JSON_FORMAT}`,
        method: C.HTTP_METHOD_DELETE,
      }
      request(options, (error, response, body) => {
        if (error) reject(error)
        if (C.HTTP_STATUS_OK === response.statusCode) {
          resolve({ orderId })
        } else {
          reject(body)
        }
      }).auth(config.username, config.password, true)
    }
  )
}
