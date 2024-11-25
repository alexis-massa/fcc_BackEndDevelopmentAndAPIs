const mongoose = require('mongoose')
require('dotenv').config({ path: '../.env' })

module.exports = {
  init: () => {
    const dbOptions = {
      autoIndex: false,
      connectTimeoutMS: 10000,
      family: 4
    }

    mongoose.connect(process.env.MONGO_URI, dbOptions)
    mongoose.Promise = global.Promise

    mongoose.connection.on('connected', () => { console.log('Mongoose connection successfully opened!') })

    mongoose.connection.on('err', err => { console.error(`Mongoose connection error: \n ${err.stack}`) })

    mongoose.connection.on('disconnected', () => { console.log('Mongoose connection disconnected') })
  }
}