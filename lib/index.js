'use strict'

const Joi = require('joi')
const MultipleStrategiesScheme = require('./multiple-strategies-scheme')

const schema = Joi.object({
  strategies: Joi.array().items(
    Joi.string().description('Auth strategy name')
  ).min(1).required().description('Auth strategies to test')
})

function register (server) {
  server.auth.scheme('multiple-strategies', (server, options) => {
    Joi.assert(options, schema)

    return new MultipleStrategiesScheme(server, options)
  })
}

exports.plugin = {
  register,
  once: true,
  pkg: require('../package.json')
}
