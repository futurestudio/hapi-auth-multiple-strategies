'use strict'

const Plugin = require('../lib')
const Lab = require('@hapi/lab')
const Hapi = require('@hapi/hapi')
const Boom = require('@hapi/boom')
const { expect } = require('@hapi/code')

const { describe, it } = exports.lab = Lab.script()

async function prepareServer () {
  const server = new Hapi.Server()
  await server.register(Plugin)

  server.auth.scheme('succeeding', (_, options) => {
    return {
      authenticate (_, h) {
        return h.authenticated({ credentials: options.value, artifacts: options.artifacts })
      }
    }
  })

  server.auth.scheme('succeeding-slow', (_, options) => {
    return {
      async authenticate (_, h) {
        await new Promise(resolve => setTimeout(resolve, 500))
        return h.authenticated({ credentials: options.value })
      }
    }
  })

  server.auth.scheme('failing', () => {
    return {
      authenticate (_, h) {
        return h.unauthenticated(Boom.unauthorized())
      }
    }
  })

  server.auth.strategy('firstAuth', 'succeeding', { value: { first: 1 }, artifacts: { name: 'Marcus' } })
  server.auth.strategy('secondAuth', 'succeeding', { value: { second: 2, scope: ['user', 'admin'] } })
  server.auth.strategy('stringAuth', 'succeeding', { value: 'string' })
  server.auth.strategy('slowAuth', 'succeeding-slow', { value: { slow: true, scope: 'slow' } })
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

  server.auth.strategy('secondSlow', 'multiple-strategies', {
    strategies: ['secondAuth', 'slowAuth']
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
      path: '/second/slow',
      config: { auth: { strategy: 'secondSlow', scope: 'slow' }, handler }
    },
    {
      method: 'GET',
      path: '/second/slow/scope-fail',
      config: { auth: { strategy: 'secondSlow', scope: 'a-scope-not-in-credentials' }, handler }
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

    const { statusCode, result } = await server.inject({
      method: 'GET',
      url: '/first/second'
    })

    expect(statusCode).to.equal(200)
    expect(result).to.include({
      isAuthenticated: true,
      credentials: {
        scope: ['user', 'admin'],
        firstAuth: { first: 1 },
        secondAuth: { second: 2, scope: ['user', 'admin'] }
      },
      artifacts: {
        firstAuth: { name: 'Marcus' },
        secondAuth: undefined
      },
      strategy: 'firstSecond'
    })
  })

  it('authenticates multiple strategies and handles string scopes', async () => {
    const server = await prepareServer()
    const res = await server.inject({
      method: 'GET',
      url: '/second/slow'
    })

    expect(res.statusCode).to.equal(200)
    expect(res.result).to.include({
      isAuthenticated: true,
      credentials: {
        scope: ['user', 'admin', 'slow'],
        secondAuth: { second: 2, scope: ['user', 'admin'] },
        slowAuth: { slow: true, scope: 'slow' }
      },
      strategy: 'secondSlow'
    })
  })

  it('fails authorization with wrong scopes', async () => {
    const server = await prepareServer()
    const res = await server.inject({
      method: 'GET',
      url: '/second/slow/scope-fail'
    })

    expect(res.statusCode).to.equal(403)
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
