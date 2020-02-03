'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
    NODE_ENV: '"development"',
    HOST: '"http://114.55.94.186:80"'
})
