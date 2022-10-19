const { Schema } = require('mongoose')

const permissionSchema = new Schema({
  _id: { type: String, lowercase: true, trim: true, required: true },
  name: { type: String, trim: true },
  description: { type: String, trim: true },
})

module.exports = permissionSchema
