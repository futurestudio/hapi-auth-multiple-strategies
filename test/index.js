'use strict'

const Lab = require('lab')
const Code = require('code')
const Hapi = require('hapi')
const Boom = require('boom')
const Plugin = require('../lib')

const { expect } = Code
const { describe, it } = exports.lab = Lab.script()

async function prepareServer () {
  const server = new Hapi.Server()
  await server.register(Plugin)

  server.auth.scheme('succeeding', function (_, options) {
    return {
      authenticate (_, h) {
        return h.authenticated({ credentials: options.value, artifacts: options.artifacts })
      }
    }
  })

  server.auth.scheme('failing', function () {
    return {
      authenticate (_, h) {
        return h.unauthenticated(Boom.unauthorized())
      }
    }
  })

  server.auth.strategy('firstAuth', 'succeeding', { value: { first: 1 }, artifacts: { name: 'Marcus' } })
  server.auth.strategy('secondAuth', 'succeeding', { value: { second: 2, scope: ['user', 'admin'] } })
  server.auth.strategy('stringAuth', 'succeeding', { value: 'string' })
  server.auth.strategy('failAuth', 'failing')

  server.auth.strategy('first', 'multiple-strategies', {
    strategies: ['firstAuth']
  })

  server.auth.strategy('firstSecond', 'multiple-strategies', {
    strategies: ['firstAuth', 'secondAuth']
  })

  server.auth.strategy('firstString', 'multiple-strategies', {
    strategies: ['firstAuth', 'stringAuth']
  })

  server.auth.strategy('firstSecondString', 'multiple-strategies', {
    strategies: ['firstAuth', 'secondAuth', 'stringAuth']
  })

  server.auth.strategy('firstFail', 'multiple-strategies', {
    strategies: ['firstAuth', 'failAuth']
  })

  function handler (request) {
    return request.auth
  }

  server.route([
    {
      method: 'GET',
      path: '/first',
      config: { auth: 'first', handler }
    },
    {
      method: 'GET',
      path: '/first/second',
      config: { auth: 'firstSecond', handler }
    },
    {
      method: 'GET',
      path: '/first/string',
      config: { auth: 'firstString', handler }
    },
    {
      method: 'GET',
      path: '/first/fail',
      config: { auth: 'firstFail', handler }
    }
  ])

  return server
}

describe('Multiple Strategies Scheme', () => {
  it('authenticates multiple strategies at once', async () => {
    const server = await prepareServer()
    const res = await server.inject({
      method: 'GET',
      url: '/first/second'
    })

    expect(res.statusCode).to.equal(200)
    expect(res.result).to.include({
      isAuthenticated: true,
      credentials: {
        scope: ['user', 'admin'],
        firstAuth: { first: 1 },
        secondAuth: { second: 2, scope: ['user', 'admin'] }
      },
      artifacts: {
        firstAuth: { name: 'Marcus' },
        secondAuth: {}
      },
      strategy: 'firstSecond'
    })
  })

  it('defaults to empty scope array', async () => {
    const server = await prepareServer()
    const res = await server.inject({
      method: 'GET',
      url: '/first'
    })

    expect(res.statusCode).to.equal(200)
    expect(res.result.credentials.scope).to.exist().and.to.be.empty()
  })

  it('handles credentials that are not objects', async () => {
    const server = await prepareServer()
    const res = await server.inject({
      method: 'GET',
      url: '/first/string'
    })

    expect(res.statusCode).to.equal(200)
    expect(res.result).to.include({
      isAuthenticated: true,
      credentials: {
        scope: [],
        firstAuth: { first: 1 },
        stringAuth: 'string'
      },
      strategy: 'firstString'
    })
  })

  it('fails if any authentication strategy fails', async () => {
    const server = await prepareServer()
    const res = await server.inject({
      method: 'GET',
      url: '/first/fail'
    })

    expect(res.statusCode).to.equal(401)
  })
})
