'use strict'

const Joi = require('joi')
const Schema = require('./options-schema')
const MultipleStrategiesScheme = require('./multiple-strategies-scheme')

function register (server) {
  server.auth.scheme('multiple-strategies', (server, options) => {
    Joi.assert(options, Schema)

    return new MultipleStrategiesScheme(server, options)
  })
}

exports.plugin = {
  register,
  once: true,
  pkg: require('../package.json'),
  requirements: { hapi: '>=18.0.0' }
}
