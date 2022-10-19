const { Mongoose } = require('mongoose')
// const mongoosePaginate = require("mongoose-paginate");
// const mongooseTimestamp = require("mongoose-cu-timestamps");
const { schemas } = require('../components')

class Database {
  constructor(config, logger) {
    this.config = config
    this.logger = logger.child({ context: 'Database' })
    this.logger.verbose('Creating mongoose instance')
    this.mongoose = new Mongoose()
    this.logger.verbose('Mongoose instance created')

    this._setupMongoosePlugins()
    this._setupMongooseModels()
  }

  async connect() {
    this.logger.verbose('Connecting to database')

    const options = {
      maxPoolSize: 25,
    }

    // if (this.config.mongo.certificate) {
    //   options.ssl = true
    //   options.sslCert = this.config.mongo.certificate
    //   options.sslKey = this.config.mongo.certificate
    // }

    await this.mongoose.connect(this.config.mongo.url, options)

    // Views can be created once the connection is established
    // await this._setupMongoViews()

    this.logger.verbose('Connected to database')
  }

  async disconnect() {
    this.logger.verbose('Disconnecting from database')
    await this.mongoose.disconnect()
    this.logger.verbose('Disconnected from database')
  }

  model(...args) {
    return this.mongoose.model(...args)
  }

  async ping() {
    if (!this.mongoose.connection.db) {
      return Promise.reject(new Error('Not connected to database'))
    }
    return this.mongoose.connection.db.admin().ping()
  }

  _setupMongoosePlugins() {
    this.logger.verbose('Attaching plugins')
    // mongoosePaginate.paginate.options = { lean: true };
    // this.mongoose.plugin(mongoosePaginate);
    // this.mongoose.plugin(mongooseTimestamp);
    this.logger.verbose('Plugins attached')
  }

  _setupMongooseModels() {
    this.logger.verbose('Registering models')

    // this.mongoose.model("Institution", schemas.institution);
    this.mongoose.model('Role', schemas.role)
    this.mongoose.model('User', schemas.user)

    this.logger.verbose('Models registered')
  }
}

module.exports = Database
