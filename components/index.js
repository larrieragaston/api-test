const requireAll = require('require-all')
const toCamelCase = require('to-camel-case')

/* eslint-disable no-undef */
const components = requireAll({
  dirname: __dirname,
  recursive: true,
  filter: /((schema)|(route))\.js$/,
  map: (name) => toCamelCase(name),
})

const routers = {}
const schemas = {}

Object.keys(components).forEach((component) => {
  routers[component] = components[component].route
  schemas[component] = components[component].schema
})

module.exports = {
  routers,
  schemas,
}
