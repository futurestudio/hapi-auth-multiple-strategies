'use strict'

const Joi = require('@hapi/joi')
const MultipleStrategiesScheme = require('./multiple-strategies-scheme')

function register (server) {
  server.auth.scheme('multiple-strategies', (server, options) => {
    Joi.assert(options, Joi.object({
      strategies: Joi
        .array()
        .items(Joi.string().description('Auth strategy name'))
        .min(1)
        .required()
        .description('Auth strategies to test')
    }))

    return new MultipleStrategiesScheme(server, options)
  })
}

exports.plugin = {
  register,
  once: true,
  pkg: require('../package.json'),
  requirements: { hapi: '>=18.0.0' }
}
