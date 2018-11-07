const path = require('path')
const fs = require('fs')

const {
  sortDependencies,
  installDependencies,
  runLintFix,
  printMessage,
} = require('./utils')
const pkg = require('./package.json')

const templateVersion = pkg.version

module.exports = {
  helpers: {
    if_or(v1, v2, options) {

      if (v1 || v2) {
        return options.fn(this)
      }

      return options.inverse(this)
    },
    template_version() {
      return templateVersion
    },
  },

  prompts: {
    name: {
      type: 'string',
      required: true,
      message: 'Project name',
    },
    description: {
      type: 'string',
      required: false,
      message: 'Project description',
      default: 'A Vue.js project',
    },
    lighthouse: {
      type: 'string',
      required: true,
      message: 'Name lighthouse',
      default: 'airalab',
    },
    model: {
      type: 'string',
      required: true,
      message: 'IPFS hash model',
      default: 'QmdFh1HPVe7H4LrDio899mxA7NindgxqiNUM9BNnBD7ryS',
    },
    objective: {
      type: 'string',
      required: true,
      message: 'IPFS hash objective',
      default: 'QmbSW1E73DKUvGDrgx8GirEVfHJLvj8RBijtH9iEZ7UecU',
    },
    isToken: {
      type: 'confirm',
      message: 'Set up payment token address',
      default: true,
    },
    token: {
      when: 'isToken',
      type: 'string',
      required: true,
      message: 'Payment token address'
    },
    price: {
      type: 'number',
      required: true,
      message: 'Default price',
      default: 1
    },
    author: {
      type: 'string',
      message: 'Author',
    },
  },
  complete: function(data, { chalk }) {
    const green = chalk.green

    sortDependencies(data, green)

    const cwd = path.join(process.cwd(), data.inPlace ? '' : data.destDirName)

    if (data.autoInstall) {
      installDependencies(cwd, data.autoInstall, green)
        .then(() => {
          return runLintFix(cwd, data, green)
        })
        .then(() => {
          printMessage(data, green)
        })
        .catch(e => {
          console.log(chalk.red('Error:'), e)
        })
    } else {
      printMessage(data, chalk)
    }
  },
}
