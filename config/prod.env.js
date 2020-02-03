'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    //阿里云8080端口才会转发
    HOST: '"http://114.55.94.186:8082"'
})
