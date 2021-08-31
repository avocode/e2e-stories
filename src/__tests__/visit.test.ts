import Core from "../templates/puppeteer/core"
import schemas from "../core/schemas"
import fs from 'fs'
import path from "path"

it("Converts yaml visit command to puppeteer testing code", async () => {
  const convertor = new Core()

  const filePath = path.resolve(path.join(__dirname, "/stories/"), "visit.tst.yaml")

  const rawYaml = fs.readFileSync(filePath, "utf-8")

  const result = convertor.convertYamlToJs(rawYaml, schemas.schema, filePath)
    
  expect(result).toMatchSnapshot()
})
