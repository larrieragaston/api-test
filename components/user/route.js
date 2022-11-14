const { Router } = require('express')
const router = new Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

router.get('/', getAllUsers)
router.get('/:id', getUserById)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

router.post('/login', createUserToken)

async function getAllUsers(req, res, next) {
  try {
    const users = await req.model('User').find({ isActive: true })
    res.send(users)
  } catch (err) {
    next(err)
  }
}

async function getUserById(req, res, next) {
  console.log('getUserById with id: ', req.params.id)

  if (!req.params.id) {
    res.status(404).send('Id not found')
  }

  try {
    const user = await req.model('User').findById(req.params.id).populate('role')

    if (!user) {
      req.logger.error('User not found')
      res.status(404).send('User not found')
    }

    res.send(user)
  } catch (err) {
    next(err)
  }
}

async function createUser(req, res, next) {
  console.log('createUser: ', req.body)

  const user = req.body

  try {
    const role = await req.model('Role').findOne({ name: user.role })
    if (!role) {
      req.logger.error('Role not found')
      res.status(404).send('Role not found')
    }

    const passEncrypted = await bcrypt.hash(user.password, 10)

    const userCreated = await req
      .model('User')
      .create({ ...user, password: passEncrypted, role: role._id })

    res.send(userCreated)
  } catch (err) {
    next(err)
  }
}

async function deleteUser(req, res, next) {
  console.log('deleteUser with id: ', req.params.id)

  if (!req.params.id) {
    res.status(500).send('The param id is not defined')
  }

  try {
    const user = await req.model('User').findById(req.params.id)

    if (!user) {
      req.logger.error('User not found')
      res.status(404).send('User not found')
    }

    await req.model('User').deleteOne({ _id: user._id })

    res.send(`User deleted :  ${req.params.id}`)
  } catch (err) {
    next(err)
  }
}

async function updateUser(req, res, next) {
  console.log('updateUser with id: ', req.params.id)

  const user = req.body

  try {
    const userToUpdate = await req.model('User').findById(req.params.id)

    if (!userToUpdate) {
      req.logger.error('User not found')
      res.status(404).send('User not found')
    }

    userToUpdate.userName = user.userName
    await userToUpdate.save()

    res.send(userToUpdate)
  } catch (err) {
    next(err)
  }
}

async function createUserToken(req, res, next) {
  req.logger.info(`Creating user token`)
  // try {
  //   const passEncrypted = await bcrypt.hash('Admin1234', 10)
  //   console.log(passEncrypted)
  //   res.send({ pass: passEncrypted })
  // } catch (err) {
  //   next(err)
  // }

  if (!req.body.email) {
    req.logger.verbose('Missing email parameter. Sending 404 to client')
    return res.status(400).end()
  }

  if (!req.body.password) {
    req.logger.info('Missing password parameter. Sending 404 to client')
    return res.status(400).end()
  }

  try {
    const user = await req.model('User').findOne({ userName: req.body.email }, '+password')

    if (!user) {
      req.logger.verbose('User not found. Sending 404 to client')
      return res.status(404).end()
    }

    req.logger.verbose('Checking user password')
    const result = await user.checkPassword(req.body.password)

    delete user.password

    if (!result.isOk) {
      req.logger.verbose('User password is invalid. Sending 401 to client')
      return res.status(401).end()
    }

    const payload = {
      _id: user._id,
      userName: user.userName,
      role: user.role,
    }

    const token = jwt.sign(payload, req.config.auth.token.secret, {
      expiresIn: req.config.auth.token.ttl,
    })

    res.status(201).send({ token: `Bearer ${token}`, user: payload })
  } catch (err) {
    next(err)
  }
}

module.exports = router
