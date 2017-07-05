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
 * Returns all of a customers orders, given their email address
 */
exports.customerOrders = function (customerId, status) {
  assert.ok(customerId)
  let queryStatus = 'status=any'
  if (status) queryStatus = `status=${status}`
  return new Promise(
    (resolve, reject) => {
      const options = {
        url: `${config.adminUrl}/${C.URL_CUSTOMERS}/${customerId}/${C.URL_ORDERS}${C.URL_JSON_FORMAT}?${queryStatus}`,
        method: C.HTTP_METHOD_GET,
      }
      console.log(options)
      request(options, (error, response, body) => {
        if (C.HTTP_STATUS_OK === response.statusCode) {
          const json = JSON.parse(body)
          if (config.returnArray) { resolve(json.orders) }
          resolve(json)
        } else {
          reject(body)
        }
      }).auth(config.username, config.password, true)
    }
  )
}

exports.customerOrdersByEmail = function (email, status) {
  assert.ok(email)
  
}

exports.customerDraftOrdersByEmail = function (email, status) {
  assert.ok(email)
  let queryStatus = 'status=open'
  if (status) queryStatus = `status=${status}`
  return new Promise(
    (resolve, reject) => {
      const options = {
        url: `${config.adminUrl}/${C.URL_DRAFT_ORDERS}${C.URL_JSON_FORMAT}?${queryStatus}`,
        method: C.HTTP_METHOD_GET,
      }
      request(options, (error, response, body) => {
        if (C.HTTP_STATUS_OK === response.statusCode) {
          const json = JSON.parse(body)
          const draftOrders = []
          json.draft_orders.forEach((d) => {
            if (d.email === email) {
              draftOrders.push(d)
            }
          })
          if (config.returnArray) resolve(draftOrders)
          resolve({ draft_orders: draftOrders })
        } else {
          reject(body)
        }
      }).auth(config.username, config.password, true)
    }
  )
}

/**
 * Will delete all the draft orders associated with the customer email provided
 */
exports.deleteCustomerDraftOrders = function (email) {
  assert.ok(email)
  return this.customerDraftOrders(email).then(
    (draftOrders) => {
      const promises = []
      draftOrders.forEach((d) => {
        const promise = this.deleteDraftOrder(d.id)
        promises.push(promise)
      })
      return Promise.all(promises)
    }
  )
}
