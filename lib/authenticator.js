'use strict'

const Collect = require('@supercharge/collections')

class Authenticator {
  constructor (server, strategies) {
    this.server = server
    this.strategies = strategies

    this.scopes = []
    this.artifacts = {}
    this.credentials = {}
  }

  async handle (request, h) {
    try {
      await Collect(this.strategies).forEachSeries(async strategy => {
        await this.authenticate(request, strategy)
      })

      return h.authenticated({
        credentials: { scope: this.scopes, ...this.credentials },
        artifacts: this.artifacts
      })
    } catch (err) {
      return h.unauthenticated(err)
    }
  }

  async authenticate (request, strategy) {
    const { credentials, artifacts } = await this.server.auth.test(strategy, request)
    this.save(strategy, credentials, artifacts)
  }

  save (strategy, credentials, artifacts) {
    this.artifacts[strategy] = artifacts
    this.credentials[strategy] = credentials
    this.collectScopeFrom(credentials)
  }

  collectScopeFrom (credentials) {
    if (credentials.scope) {
      this.scopes.push(
        ...[].concat(credentials.scope)
      )
    }
  }
}

module.exports = Authenticator
