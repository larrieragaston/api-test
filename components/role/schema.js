const mongoose = require('mongoose')

const { Schema } = mongoose

const roleSchema = new Schema({
  name: { type: String, required: true, lowercase: true, trim: true, unique: true },
  // permissions: [{ type: String, ref: 'Permission' }],
})

module.exports = roleSchema
