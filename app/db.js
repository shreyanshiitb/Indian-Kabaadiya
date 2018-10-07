var MongoClient = require('mongodb').MongoClient

var state = {
  db: null,
}

exports.connect = function (url, done) {
  if (state.db) return done()
  MongoClient.connect(url, { useNewUrlParser: true })
    .then((res) => {
      state.db = res
      done()
    })
    .catch((err) => done(err))
}

exports.get = function () {
  return state.db
}

exports.close = function (done) {
  if (state.db) {
    state.db.close(function (err, result) {
      state.db = null
      state.mode = null
      done(err)
    })
  }
}
