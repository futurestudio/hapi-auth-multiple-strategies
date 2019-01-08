'use strict'

const Lab = require('lab')
const Code = require('code')
const Hapi = require('hapi')
const Plugin = require('../lib')

const { expect } = Code
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
