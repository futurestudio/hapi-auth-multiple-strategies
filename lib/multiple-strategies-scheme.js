'use strict'

const Collect = require('@supercharge/collections')

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
      await Collect(this.strategies).forEach(async strategy => {
        const { credentials, artifacts } = await this.server.auth.test(strategy, request)

        authArtifacts[strategy] = artifacts
        authCredentials[strategy] = credentials

        if (credentials.scope) {
          const scopes = [].concat(credentials.scope)
          scope.push(...scopes)
        }
      })
    } catch (err) {
      return h.unauthenticated(err)
    }

    return h.authenticated({ credentials: { scope, ...authCredentials }, artifacts: { ...authArtifacts } })
  }
}

module.exports = MultipleStrategiesScheme
