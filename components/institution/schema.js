const mongoose = require('mongoose')
const validate = require('mongoose-validator')

const { Schema } = mongoose
const { ObjectId } = Schema.Types
const emailValidator = validate({ validator: 'isEmail' })

const addressSchema = require('../../utils/schemas')

const institutionSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, lowercase: true, trim: true, validate: emailValidator },
  phone: { type: String, trim: true },
  address: addressSchema,

  isDeleted: { type: Boolean, default: false, select: false },
  createdBy: { type: ObjectId, ref: 'User' },
  updatedBy: { type: ObjectId, ref: 'User' },
})

institutionSchema.index({ name: 1 })

institutionSchema.index(
  {
    organization: 1,
    name: 'text',
  },
  {
    name: 'text_index',
  },
)

module.exports = institutionSchema
