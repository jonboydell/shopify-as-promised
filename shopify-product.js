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
 * Returns all the products from the current store
 */
exports.products = () => {
  const url = `${config.adminUrl}/${C.URL_PRODUCTS}${C.URL_JSON_FORMAT}`
  return new Promise(
    (resolve, reject) => {
      request(url, (error, response, body) => {
        if (error) { reject(error) }
        const json = JSON.parse(body)
        if (C.HTTP_STATUS_OK === response.statusCode) {
          if (config.returnArray) { resolve(json.products) }
          resolve(json)
        } else {
          reject(json)
        }
      }).auth(config.username, config.password, true)
    }
  )
}

/**
 * Returns a product, given the shopify id
 * @todo: array to string for id
 */
exports.product = (id) => {
  assert.ok(id)
  return new Promise(
    (resolve, reject) => {
      request(`${config.adminUrl}/${C.URL_PRODUCTS}${C.URL_JSON_FORMAT}?ids=${id}`, (error, response, body) => {
        if (error) { reject(error) }
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
