module.exports = {
  launch: {
    headless: Boolean(process.env.HEADLESS),
    defaultViewport: {
      width: 1200,
      height: 800,
    }
  },
  browserContext: 'incognito',
}
