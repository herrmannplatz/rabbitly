'use strict'

module.exports.logs = async (message) => {
  console.log('📝', message)
}

module.exports.errors = async (message) => {
  console.log('💥', message)
}

module.exports.warnings = async (message) => {
  console.log('⚠️', message)
}

module.exports.infos = async (message) => {
  console.log('ℹ️', message)
}
