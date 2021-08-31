import fs from 'fs-extra'
import glob from 'glob'
import path from 'path'
import yaml from 'yaml'
import Joi from "joi"
import del from 'del'
import { Story, UtilsI } from './types'

export default new class Utils implements UtilsI {

    async cleanOutputDir(outputFolder: string): Promise<Boolean> {
        await del([outputFolder])
        return true
    }

    async save({ name, content }: { name: string, content: string }, outputFolder: string ): Promise<void> {
        const renamedFile = name.replace(/.y(a)?ml/g, '.test.js')
        await fs.ensureFile(path.resolve(outputFolder, renamedFile))
        await fs.writeFile(path.resolve(outputFolder, renamedFile), content)
    }
    
    validateSchema(rawYaml: string, schema: Joi.ObjectSchema<any>, filePath: string) {
        try {
            const parsedYaml: Story = yaml.parse(rawYaml)
            return schema.validate(parsedYaml)
        } catch (e) {
            throw new Error(`Parsed yaml file: ${filePath}. \n ${e}`)
        }
    }
    
    async loadYamlFiles(path: string = '*(playground|test|tests|spec|src|build)/**/stories/**/*.+(yaml|yml)'): Promise<string[]> {
        return new Promise((resolve, reject) => {
          
            glob(path, async (err, files: string[]) => {
                if (err) {
                    reject(err)
                    throw err
                }
                resolve(files)
            })
        })
    }

    filterYamlFiles(rawYamlFiles: string[], components?: Boolean): string[] {
        const yamlStoriesOrComponents = rawYamlFiles.filter(rawYamlFile => {
            const hasComponent = path.basename(rawYamlFile).includes('.component')
            const hasTst = path.basename(rawYamlFile).includes('.tst')

            const condition = components ? hasComponent : !hasComponent
            return condition && !hasTst
        })
        return yamlStoriesOrComponents
    }

    
    checkSchemaError(schema: Joi.ValidationResult): Joi.ValidationErrorItem | null {
        return schema.error?.details?.[0] || null
    }
    
    throwError(err: { message: string }, filePath: string): void {
        throw new Error(`
            Error: ${err.message}
            Yaml file: ${filePath}
        `)
    }
    
    checkError(schema: Joi.ValidationResult) {
        const schemaError = this.checkSchemaError(schema)
        return schemaError || null
    }
}