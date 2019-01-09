<div align="center">
  <p>
    <code>hapi-auth-multiple-strategies</code>
  </p>

  <p>
    Require multiple authentication strategies in hapi.
  </p>
  <br/>
  <p>
    <a href="#installation"><strong>Installation</strong></a> ·
    <a href="#usage"><strong>Usage</strong></a>
  </p>
  <br/>
  <br/>
  <p>
    <a href="https://travis-ci.org/fs-opensource/hapi-auth-multiple-strategies"><img src="https://camo.githubusercontent.com/9f56ef242c6f588f74f39f0bd61c1acd34d853af/68747470733a2f2f7472617669732d63692e6f72672f66732d6f70656e736f757263652f686170692d67656f2d6c6f636174652e7376673f6272616e63683d6d6173746572" alt="Build Status" data-canonical-src="https://travis-ci.org/fs-opensource/hapi-auth-multiple-strategies.svg?branch=master" style="max-width:100%;"></a>
    <a href="https://snyk.io/test/github/fs-opensource/hapi-auth-multiple-strategies"><img src="https://snyk.io/test/github/fs-opensource/hapi-auth-multiple-strategies/badge.svg" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/github/fs-opensource/hapi-auth-multiple-strategies" style="max-width:100%;"></a>
    <a href="https://www.npmjs.com/package/hapi-auth-multiple-strategies"><img src="https://img.shields.io/npm/v/hapi-auth-multiple-strategies.svg" alt="hapi-auth-multiple-strategies Version" data-canonical-src="https://img.shields.io/npm/v/hapi-auth-multiple-strategies.svg" style="max-width:100%;"></a>
    <a href="https://greenkeeper.io/" rel="nofollow"><img src="https://camo.githubusercontent.com/051af59d851fe8e39db57c2a3648caca6d4c4d72/68747470733a2f2f6261646765732e677265656e6b65657065722e696f2f66732d6f70656e736f757263652f686170692d726174652d6c696d69746f722e737667" alt="Greenkeeper badge" data-canonical-src="https://badges.greenkeeper.io/fs-opensource/hapi-auth-multiple-strategies.svg" style="max-width:100%;"></a>
  </p>
  <p>
    <em>Follow <a href="http://twitter.com/marcuspoehls">@marcuspoehls</a> for updates!</em>
  </p>
</div>

------

<p align="center"><sup>The <a href="https://futurestud.io">Future Studio University</a> supports development of this hapi plugin 🚀</sup>
<br><b>
Join the <a href="https://futurestud.io/university">Future Studio University and Skyrocket in Node.js</a></b>
</p>

------


## Introduction
Add `hapi-auth-multiple-strategies` in your hapi project to authenticate a request against multiple authentication strategies. Hapi allows you to define multiple auth strategies on a route, but this requires only a single strategy to authenticate the request. In contrast, `hapi-auth-multiple-strategies` requires all strategies to be successful.


## Installation
Add `hapi-auth-multiple-strategies` as a dependency to your project:

```bash
# NPM v5 users, this way is yours
npm i hapi-auth-multiple-strategies

# you’re using NPM v4:
npm i -S hapi-auth-multiple-strategies
```


## Usage
Register `hapi-auth-multiple-strategies` to your hapi server. This will add the `multiple-strategies` authentication scheme to your hapi server.

```js
await server.register({
  plugin: require('hapi-auth-multiple-strategies')
})

// went smooth like chocolate :)
// now your hapi server supports the 'multiple-strategies' auth scheme
```

Then declare a new authentication strategy base on the `multiple-strategies` scheme and pass in all required `strategies`.

```js
// Assuming you have the following strategies your server
server.auth.strategy('jwt', 'bearer', options);
server.auth.strategy('jwt-refresh', 'token', options);

// create a new strategy that requires both 'jwt' strategies
server.auth.strategy('jwt-all-in', 'multiple-strategies', {
  strategies: ['jwt', 'jwt-refresh']
});

// use the 'jwt-all-in' strategy on your route
server.route({
  method: 'GET',
  path: '/api/logout',
  config: {
    auth: 'jwt-all-in',
    handler: () => 'hey bud, you’re logged out'
  }
});
```

The `jwt-all-in` strategy ensures that an incoming request satisfies both strategies, `jwt` and `jwt-refresh`.

If a request doesn’t authenticate with one or more of the strategies, it will return unauthenticated.


## Authentication Strategy Options
When creating a new authentication strategy using the `multiple-strategies` scheme, you’re required to pass in an array of the authentication strategy names that are required.

- **`strategies`**: (Array), required
  - an array of auth strategy names against a request will be authenticated


## Credentials & Scope
Typically the `request.auth.credentials` is populated with the credentials from a single strategy. When testing multiple strategies, you’ll get the credentials from all strategies.

When a request passes all authentication strategies, the related credentials are assigned to the strategy’s name in `request.auth.credentials`.

Because hapi authorizes requests via the `scope` property, you’ll find the aggregated scope from all strategies in the credentials as well.

Here’s a sample result of `request.auth.credentials`:

```json
{
  jwt: { name: 'Marcus', scope: [ 'admin' ] }
  'jwt-refresh': { username: 'marcus', name: 'Marcus', scope: [ 'user' ] }
  scope: [ 'admin', 'user' ]
});
```

Enjoy!


## Links & Resources

- [hapi tutorial series](https://futurestud.io/tutorials/hapi-get-your-server-up-and-running) with 100+ tutorials


## Contributing

1.  Create a fork
2.  Create your feature branch: `git checkout -b my-feature`
3.  Commit your changes: `git commit -am 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request 🚀


## License

MIT © [Future Studio](https://futurestud.io)

---

> [futurestud.io](https://futurestud.io) &nbsp;&middot;&nbsp;
> GitHub [@fs-opensource](https://github.com/fs-opensource/) &nbsp;&middot;&nbsp;
> Twitter [@futurestud_io](https://twitter.com/futurestud_io)
