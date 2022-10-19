const { Router } = require('express')

const router = new Router()

router.post('/', createInstitution)
router.get('/', queryInstitutions)
router.get('/:id', findInstitutionById)
router.put('/:id', updateInstitution)
router.delete('/:id', deleteInstitution)

async function createInstitution(req, res, next) {
  req.logger.info('Creating institution', req.body)

  if (!req.isAdmin()) {
    return res.status(403).send({ error: 'Unauthorized' })
  }

  try {
    const institution = await req.model('Institution').create({
      ...req.body,
      organization: req.user.organization,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: req.user._id,
      updatedBy: req.user._id,
    })

    req.logger.verbose('Sending institution to client')
    res.json(institution)
  } catch (err) {
    req.logger.error('There was an error creating institution', err)
    next(err)
  }
}

async function queryInstitutions(req, res, next) {
  req.logger.info('Querying institutions', req.query)

  try {
    const institutions = await req.model('Institution').find({
      organization: req.user.organization,
      ...req.query,
      isDeleted: { $ne: true },
    })

    req.logger.verbose('Sending institutions to client')
    res.json(institutions)
  } catch (err) {
    next(err)
  }
}

async function findInstitutionById(req, res, next) {
  req.logger.info(`Finding institution with id ${req.params.id}`)

  try {
    const institution = await req.model('Institution').findOne({
      organization: req.user.organization,
      _id: req.params.id,
    })

    if (!institution) {
      req.logger.verbose('Institution not found. Sending 404 to client')
      return res.status(404).send({ error: 'InstitutionNotFound' })
    }

    res.json(institution)
  } catch (err) {
    next(err)
  }
}

async function updateInstitution(req, res, next) {
  req.logger.info(`Updating institution with id ${req.params.id}`)

  if (!req.isAdmin()) {
    return res.status(403).send({ error: 'Unauthorized' })
  }

  try {
    const institution = await req
      .model('Institution')
      .updateOne(
        { _id: req.params.id, organization: req.user.organization, isDeleted: { $ne: true } },
        { ...req.body, updatedBy: req.user._id },
      )

    if (institution.n < 1) {
      req.logger.verbose('Institution not found')
      return res.status(404).end()
    }

    req.logger.verbose('Institution updated')
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

async function deleteInstitution(req, res, next) {
  req.logger.info(`Deleting institution with id ${req.params.id}`)

  if (!req.isAdmin()) {
    return res.status(403).send({ error: 'Unauthorized' })
  }

  try {
    const institution = await req.model('Institution').updateOne(
      {
        organization: req.user.organization,
        _id: req.params.id,
      },
      { isDeleted: true, updatedBy: req.user._id },
    )

    if (institution.n < 1) {
      req.logger.verbose('Institution not found')
      return res.status(404).end()
    }

    res.json(institution)
  } catch (err) {
    next(err)
  }
}

module.exports = router
