'use strict'

const { forEach } = require('p-iteration')

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
      await forEach(this.strategies, async strategy => {
        const { credentials, artifacts } = await this.server.auth.test(strategy, request)
        authArtifacts[strategy] = artifacts
        authCredentials[strategy] = credentials

        if (authCredentials.scope) {
          scope.push(...authCredentials.scope)
        }
      })
    } catch (err) {
      return h.unauthenticated(err)
    }

    return h.authenticated({ credentials: { scope, ...authCredentials }, artifacts: { ...authArtifacts } })
  }
}

module.exports = MultipleStrategiesScheme
