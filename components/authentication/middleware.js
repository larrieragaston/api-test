const jwt = require('jsonwebtoken')
const createError = require('http-errors')

const publicKey = require('../../lib/public-key')

function getToken(req, next) {
  const TOKEN_REGEX = /^\s*Bearer\s+(\S+)/g
  const matches = TOKEN_REGEX.exec(req.headers.authorization)

  if (!matches) {
    return next(new createError.Unauthorized())
  }

  const [, token] = matches
  return token
}

function authenticationMiddleware(req, res, next) {
  if (!req.headers.authorization) {
    req.logger.warn('Missing authorization header')
    return next(new createError.Unauthorized())
  }

  const token = getToken(req, next)

  try {
    req.user = jwt.verify(token, publicKey, {
      audience: req.config.auth.token.audience,
      algorithms: [req.config.auth.token.algorithm],
      issuer: req.config.auth.token.issuer,
    })

    if (
      !req.user ||
      !req.user._id ||
      !req.user.organization ||
      !req.user.role ||
      !req.user.permissions
    ) {
      req.logger.error('Error authenticating malformed JWT')
      return next(new createError.Unauthorized())
    }

    req.logger.verbose(`User ${req.user._id} authenticated`)
  } catch (err) {
    if (err.message === 'invalid algorithm' || err.message === 'invalid signature') {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
      req.logger.error(`Suspicious access attempt from ip=${ip} ${token}`)
    }
    if (err.name === 'TokenExpiredError') {
      req.logger.warn('Expired token, sending 401 to client')
      return res.sendStatus(401)
    }
    return next(new createError.Unauthorized(err))
  }
}

function authorizationMiddleware(req, res, next) {
  req.hasPermission = function hasPermission(permissionId) {
    if (!req.user || !req.user.role) {
      return false
    }

    if (req.user.role === 'admin') {
      return true
    }

    if (!req.user.permissions || !req.user.permissions.length) {
      return false
    }

    if (!req.user.permissions.find((id) => id === permissionId)) {
      return false
    }

    return true
  }

  req.isAdmin = function isAdmin() {
    return req.user && req.user.role === 'admin'
  }

  req.isPatient = function isPatient() {
    return req.user && req.user.role === 'patient'
  }

  req.isDoctor = function isDoctor() {
    return req.user && req.user.role === 'doctor'
  }

  req.isManager = function isManager() {
    return req.user && req.user.role === 'manager'
  }

  req.isAssistant = function isAssistant() {
    return req.user && req.user.role === 'assistant'
  }

  req.isScoresManager = function isScoresManager() {
    return req.user && req.user.role === 'scores-manager'
  }

  req.isAuthenticated = function isAuthenticated() {
    return !!req.user
  }

  return next(null)
}

module.exports = {
  authentication: authenticationMiddleware,
  authorization: authorizationMiddleware,
}
