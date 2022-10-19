/* globals ObjectId */
exports.name = 'create-admin-user'
exports.description = 'creates the admin user'

exports.isReversible = true
exports.isIgnored = false

exports.up = function up(db, done) {
  db.collection('users').insertOne(
    {
      _id: new ObjectId('000000000000000000000001'),
      email: 'employee@baseapi.com',
      password: '$2a$10$J3Qa3YiZTxXBX7NsSXMWmeVfrnsK7GXyCQM8sQ0VpSgvULxA/DOgO', // Password1
      name: {
        firstName: 'R2D2',
        lastName: 'droid',
      },
      role: new ObjectId('000000000000000000000000'),
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
    },
    done,
  )
}

exports.down = function down(db, done) {
  db.collection('users').deleteOne(
    {
      _id: new ObjectId('000000000000000000000001'),
    },
    done,
  )
}
