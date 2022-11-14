/* globals ObjectId */
exports.name = 'create-employee-role'
exports.description = 'creates the employee role'

exports.isReversible = true
exports.isIgnored = false

exports.up = function up(db, done) {
  // const employeePermissionIds = [
  //   'user.read',
  //   'user.query',
  // ]

  db.collection('roles').insertOne(
    {
      _id: new ObjectId('000000000000000000000001'),
      name: 'employee',
      // permissions: employeePermissionIds,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    done,
  )
}

exports.down = function down(db, done) {
  db.collection('roles').deleteOne(
    {
      _id: new ObjectId('000000000000000000000001'),
    },
    done,
  )
}
