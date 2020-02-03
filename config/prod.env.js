'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
module.exports = merge(prodEnv, {
    NODE_ENV: '"production"',
    HOST: '"https://114.55.94.186"'
})
