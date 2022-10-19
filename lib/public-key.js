const fs = require('fs')
const path = require('path')
const config = require('config')

/* eslint-disable no-undef */
const publicKey = fs.readFileSync(path.join(__dirname, `../keys/${config.auth.key}.pub`))

module.exports = publicKey
