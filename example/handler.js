'use strict'

module.exports.logs = async (message) => {
  console.log('đ', message)
}

module.exports.errors = async (message) => {
  console.log('đĨ', message)
}

module.exports.warnings = async (message) => {
  console.log('â ī¸', message)
}

module.exports.infos = async (message) => {
  console.log('âšī¸', message)
}
