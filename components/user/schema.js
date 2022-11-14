const mongoose = require('mongoose')
const validate = require('mongoose-validator')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema
const { ObjectId } = Schema.Types
const emailValidator = validate({ validator: 'isEmail' })

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: emailValidator,
  },
  password: { type: String, select: false },
  name: {
    firstName: { type: String },
    lastName: { type: String },
  },
  role: { type: ObjectId, ref: 'Role', required: true },
  bornDate: { type: Date },
  isActive: { type: Boolean },
})

userSchema.method('checkPassword', async function checkPassword(potentialPassword) {
  if (!potentialPassword) {
    return Promise.reject(new Error('Password is required'))
  }

  const isMatch = await bcrypt.compare(potentialPassword, this.password)

  return { isOk: isMatch }
})

module.exports = userSchema
