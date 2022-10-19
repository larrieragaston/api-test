/* globals ObjectId */
exports.name = 'create-admin-role'
exports.description = 'creates the admin role'

exports.isReversible = true
exports.isIgnored = false

exports.up = function up(db, done) {
  // const adminPermissionIds = [
  //   'user.create',
  //   'user.read',
  //   'user.query',
  //   'user.update',
  //   'user.remove',
  // ]

  db.collection('roles').insertOne(
    {
      _id: new ObjectId('000000000000000000000000'),
      name: 'admin',
      // permissions: adminPermissionIds,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    done,
  )
}

exports.down = function down(db, done) {
  db.collection('roles').deleteOne(
    {
      _id: new ObjectId('000000000000000000000000'),
    },
    done,
  )
}
