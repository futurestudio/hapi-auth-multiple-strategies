'use strict'

const Joi = require('joi')

module.exports = Joi.object({
  strategies: Joi.array().items(
    Joi.string().description('Auth strategy name')
  ).min(1).required().description('Auth strategies to test')
})
