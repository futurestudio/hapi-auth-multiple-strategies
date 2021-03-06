# Changelog


## [3.0.0](https://github.com/futurestudio/hapi-auth-multiple-strategies/compare/v2.2.0...v3.0.0) - 2020-01-10

### Breaking Changes
- require Node.js v12
  - this change aligns with the hapi ecosystem requiring Node.js v12 with the release of hapi 19


## [2.2.0](https://github.com/futurestudio/hapi-auth-multiple-strategies/compare/v2.1.0...v2.2.0) - 2019-10-17

### Added
- basic TypeScript declarations in `lib/index.d.ts`


## [2.1.0](https://github.com/futurestudio/hapi-auth-multiple-strategies/compare/v2.0.5...v2.1.0) - 2019-10-12

### Added
- use [Joi v16](https://github.com/hapijs/joi) for options validation

### Updated
- bump dependencies
- remove Node.js v11 from Travis testing
- move auth handling into a dedicated `Authenticator` class


## [2.0.5](https://github.com/futurestudio/hapi-auth-multiple-strategies/compare/v2.0.4...v2.0.5) - 2019-04-24

### Updated
- updating to the scoped hapi dependencies
- bump dependencies


## [2.0.4](https://github.com/futurestudio/hapi-auth-multiple-strategies/compare/v2.0.3...v2.0.4) - 2019-02-18

### Updated
- bump dependencies


## [2.0.3](https://github.com/futurestudio/hapi-auth-multiple-strategies/compare/v2.0.2...v2.0.3) - 2019-02-07

### Updated
- ensure that string scopes are handled correctly


## [2.0.2](https://github.com/futurestudio/hapi-auth-multiple-strategies/compare/v2.0.1...v2.0.2) - 2019-02-06

### Updated
- run auth checks in sequence, not in parallel
- Readme: fix badges
- bump dependencies


## [2.0.1](https://github.com/futurestudio/hapi-auth-multiple-strategies/compare/v2.0.0...v2.0.1) - 2019-01-26

### Updated
- Readme: rename GitHub references `fs-opensource -> futurestudio`


## [2.0.0](https://github.com/futurestudio/hapi-auth-multiple-strategies/compare/v1.0.2...v2.0.0) - 2019-01-19

### Added
- return `artifacts` in for each strategy in `request.auth.artifacts.<strategy>`

### Updated
- update code for hapi 18: `server.auth.test()` returns `{ credentials, artifacts }`
- added hapi 18 requirement


## [1.0.2](https://github.com/futurestudio/hapi-auth-multiple-strategies/compare/v1.0.1...v1.0.2) - 2019-01-16

### Updated
- Readme: link [strategy options](https://github.com/futurestudio/hapi-auth-multiple-strategies#authentication-strategy-options)


## [1.0.1](https://github.com/futurestudio/hapi-auth-multiple-strategies/compare/v1.0.0...v1.0.1) - 2019-01-09

### Updated
- Readme: added block for [credentials and scope](https://github.com/futurestudio/hapi-auth-multiple-strategies#credentials--scope)


## 1.0.0 - 2019-01-08

### Added
- `1.0.0` release 🚀 🎉
