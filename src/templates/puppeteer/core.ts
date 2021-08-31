import fs from 'fs'
import path from 'path'
import schemas from "../../core/schemas"
import convertMethods from "./convertMethods"
import sharedConvertMethods from "../../shared/convertMethods"
import Utils from "../../core/utils"
import sharedUtils from "../../shared/utils"
import { StoryComponent, Story, CoreI } from '../../core/types'
import Joi from 'joi'

export default class Core implements CoreI {
    private defaults: {
        out: string,
        headers: {},
        path: string,
    }
    static compFilePathsList: string[]

    constructor() {
        this.defaults = {
            out: 'spec',
            headers: {},
            path: '*(playground|test|tests|spec|src|build)/**/stories/**/*.+(yaml|yml)',
        }
    
    }
    
    setConfig(obj: object) {
        this.defaults = {
            ...this.defaults,
            ...obj,
        }
    }
    
    async loadFilesConvertThemAndSaveTogether(): Promise<void> {

        await this.loadYamlStoryComponents()
        const result = await this.loadYamlStories()
    
        const editedResult = result.map(item => {
            return item.content.split('\n').join('\n')
        })
    
        await Utils.save({ 
            name: 'all-tests.test.js', 
            content: editedResult.join('\n') 
        }, this.defaults.out )
    
    }
    
    async loadFilesConvertThemAndSaveSeparatelly(): Promise<void> {

        await this.loadYamlStoryComponents()
        const result: {name: string, content: string}[] = await this.loadYamlStories()
    
        for (let item of result) {
            await Utils.save(item, this.defaults.out)
        }
    
    }
    
    async loadYamlStoryComponents(): Promise<void> {
        const files: string[] = await Utils.loadYamlFiles(this.defaults.path)
        const filteredYamlComponents: string[] = Utils.filterYamlFiles(files, true)
        Core.compFilePathsList = filteredYamlComponents
        for (let file of filteredYamlComponents) {
            Core.convertComponent(file)
        }
    }
    
    private async loadYamlStories(): Promise<{name: string, content: string, }[]> {
        const files: string[] = await Utils.loadYamlFiles(this.defaults.path)
        const filteredYamlFiles = Utils.filterYamlFiles(files, false)
        let content = []
    
        for (let file of filteredYamlFiles) {
            const rawYaml: string = fs.readFileSync(file, 'utf-8')
            const result = this.convertYamlToJs(rawYaml, schemas.schema, file)
    
            content.push({
                name: path.basename(file),
                content: result,
            })
    
        }
    
        return content
    
    }

    convertYamlToJs(rawYaml: string, schema: Joi.ObjectSchema<any>, filePath: string): string {
        const _schema = Utils.validateSchema(rawYaml, schema, filePath)
        const error =  Utils.checkError(_schema)

        if (error) {
            Utils.throwError(error, filePath) 
        }

        return this.convert(_schema.value)
    }

    static convertComponent(file: string) {
        const rawYaml: string = fs.readFileSync(file, 'utf-8')
        const _schema = Utils.validateSchema(rawYaml, schemas.schemaWithoutName, file)
        const error =  Utils.checkError(_schema)

        if (error) {
            Utils.throwError(error, file) 
        }

        return convertMethods.convertToJsArr(_schema.value)
    }
    
    private convert(value: Story): string {
        let codeArr: string[] = convertMethods.convertToJsArr(value)
    
        let result: string = sharedConvertMethods.convertToJsCode(codeArr)
            
        if (value.only) {
            result = sharedConvertMethods.convertToOnly(result)
        }
    
        if (value.skip) {
            result = sharedConvertMethods.convertToSkip(result)
        }
    
        result = sharedUtils.replaceTestSettings(result, value.testSettings)
    
        result = sharedUtils.replaceHeaders(result, JSON.stringify(this.defaults.headers))
    
        result += convertMethods.convertEndTest()
    
        return result
    }
}