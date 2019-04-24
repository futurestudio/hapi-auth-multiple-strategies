'use strict'

const Plugin = require('../lib')
const Lab = require('@hapi/lab')
const Hapi = require('@hapi/hapi')
const { expect } = require('@hapi/code')

const { describe, it } = exports.lab = Lab.script()

describe('Multiple Strategies Scheme', () => {
  it('requires at least one strategy name', async () => {
    const server = new Hapi.Server()
    await server.register(Plugin)

    expect(() => {
      server.auth.strategy('first', 'multiple-strategies', { strategies: [] })
    }).to.throw()
  })
})
