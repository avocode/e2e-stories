const Utils = require("./build/core/utils").default

const convertStories = (config = {}) => {
  if(config.outputType) {
    switch (config.outputType.toLowerCase()) {
      case "puppeteer": {
        const Core = require("./build/templates/puppeteer/core").default
        const convertor = new Core()
        convertor.setConfig({
          out: config.out || './spec',
          headers: config.headers || {},
          path: config.pathToYaml
        })

        if (config.clean !== false) {
          Utils.cleanOutputDir(config.out || './spec')
        }

        if (config.together) {
          convertor.loadFilesConvertThemAndSaveTogether()
          break
        }

        convertor.loadFilesConvertThemAndSaveSeparatelly() 
        break
      }
      default: throw new Error("Invalid output type, use only ones specified in the docs.")
    }
  } else {
    const Core = require("./build/templates/puppeteer/core").default
    const convertor = new Core()
    convertor.setConfig({
      out: config.out || './spec',
      headers: config.headers || {},
      path: config.pathToYaml
    })

    if (config.clean !== false) {
      Utils.cleanOutputDir(config.out || './spec')
    }
    
    config.together
      ? convertor.loadFilesConvertThemAndSaveTogether()
      : convertor.loadFilesConvertThemAndSaveSeparatelly() 
  }
}

module.exports = convertStories

