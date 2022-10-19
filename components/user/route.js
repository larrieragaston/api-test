const { Router } = require('express')

const router = new Router()

router.get('/', getAllUsers)
router.get('/:id', getUserById)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

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

    const userCreated = await req.model('User').create({ ...user, role: role._id })

    res.send(`User created :  ${userCreated.userName}`)
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

    userToUpdate.isActive = user.isActive
    await userToUpdate.save()

    res.send(userToUpdate)
  } catch (err) {
    next(err)
  }
}

module.exports = router
