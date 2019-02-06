'use strict'

const { forEachSeries } = require('p-iteration')

class MultipleStrategiesScheme {
  constructor (server, options) {
    const { strategies } = options

    this.server = server
    this.strategies = strategies
  }

  async authenticate (request, h) {
    const scope = []
    const authArtifacts = {}
    const authCredentials = {}

    try {
      await forEachSeries(this.strategies, async strategy => {
        const { credentials, artifacts } = await this.server.auth.test(strategy, request)

        authArtifacts[strategy] = artifacts
        authCredentials[strategy] = credentials

        if (credentials.scope) {
          scope.push(...credentials.scope)
        }
      })
    } catch (err) {
      return h.unauthenticated(err)
    }

    return h.authenticated({ credentials: { scope, ...authCredentials }, artifacts: { ...authArtifacts } })
  }
}

module.exports = MultipleStrategiesScheme
