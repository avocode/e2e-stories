import path from 'path'
import _ from 'lodash'
import sharedConvertMethods from "../../shared/convertMethods"
import sharedUtils from "../../shared/utils"
import {
    StoryComponent,
    KeyInput,
    MapToJs,
    ConvertMethodsI,
    ConvertScreenshot,
    StorySteps,
    Story,
} from "../../core/types";

const addTabs = (fn: Function) => {
    return sharedUtils.addTabs(fn)
}

const getExt = (pathAndFileName: string, type: "jpeg" | "png"): string => {
    const extName = path.extname(pathAndFileName)
    return pathAndFileName.replace(extName, "." + type)
}

export default new class ConvertMethods implements ConvertMethodsI {
    mapToJs: MapToJs = {
        name: this.convertName,
        component: sharedConvertMethods.convertComponent,
        visit: addTabs(this.convertVisit),
        click: addTabs(this.convertClick),
        dblClick: addTabs((selector: string) => this.convertClick(selector, 2)),
        urlIs: addTabs(this.convertUrlIs),
        exists: addTabs(this.convertExists),
        notExists: addTabs(this.convertNotExists),
        pause: addTabs(this.convertPause),
        fill: addTabs(this.convertFill),
        textIs: addTabs(this.convertTextIs),
        select: addTabs(this.convertSelect),
        upload: addTabs(this.convertUpload),
        keyPress: addTabs(this.convertKeyPress),
        screenshot: addTabs(this.convertScreenshot)
    };
    convertToJsArr(schema: StoryComponent | Story ): string[] {
        let result: string[] = []

        if(schema.name != null) {
            result = this.mapToJs['name'](schema.name)
        }

        const steps = _.flatMap(schema.steps, (item: StorySteps) => {
            let key = Object.keys(item)[0]

            if (this.mapToJs[key]) { 
                return this.mapToJs[key](item[key])
            }

        }).filter(_.identity)
        
        result = _.flatten([...result, ...steps])

        return result
    }

    convertEndTest(): string {
        return `
\t\treturn true
\t})
})`
    }

    convertName(value: string): string[] {
        return [
            `describe(\`${value}\`, function() {`,
            `\tlet context`,
            `\tlet random`,
            `\tlet page\n`,
            `\tbeforeEach(async () => {`,
            `\t\tcontext = await browser.createIncognitoBrowserContext()`,
            '\t\tpage = await context.newPage()',
            '\t\trandom = +new Date',
            `\t\tpage.setExtraHTTPHeaders(##HEADERS##)\n`,
            `\t\treturn true`,
            `\t})\n`,
            `\tafterEach(async () => {`,
            `\t\tawait page.close()`,
            `\t\treturn true`,
            `\t})\n`,
            `\tjest.retryTimes(##RETRYTIMES##)`,
            `\tjest.setTimeout(##SETTIMEOUT##)`,
            `\tit(\`${value}\`, async () => {`,
        ]
    }
      
    convertVisit(url: string): string[] {
        return [
            `await page.goto(\`${url}\`)`
        ]
    }
      
    convertClick (selector: string, count = 1): string[] {
        return [
            `await page.waitForSelector(\`${selector}\`, { timeout: 10000 })`,
            `await page.click(\`${selector}\`, { clickCount: ${count} })`,
        ]
    }
      
    convertUrlIs(url: string): string[] {
        return [
            `expect(await page.url()).toEqual(\`${url}\`)`
        ]
    }
    
    convertExists(selector: string): string[] {
        return [
            `await page.waitForSelector(\`${selector}\`)`,
            `expect(await page.$(\`${selector}\`)).toBeTruthy`,
        ]
    }
      
    convertNotExists(selector: string): string[] {
        return [
            `expect(await page.$(\`${selector}\`)).not.toBeTruthy`,
        ]
    }
      
    convertPause(milisec: number): string[] {
        return [
            `await page.waitForTimeout(${milisec})`,
        ]
    }
      
    convertFill({ el, text }: {el: string, text: string}): string[] {
        return [
            `await page.type(\`${el}\`, \`${sharedUtils.handleTimestamp(text)}\`)`,
        ]
    }
      
    convertTextIs({ el, text }: {el: string, text: string}): string[] {
        const varName = sharedUtils.getNumberForVarName()
      
        return [
          `let element${varName} = await page.$(\`${el}\`)`,
          `expect(await page.evaluate(element${varName} => element${varName}.textContent, element${varName})).toEqual('${text}')`,
        ]
    }
      
    convertSelect({ el, text }: {el: string, text: string}): string[] {
        return [
            `await page.select(\`${el}\`, \`${text}\`)`,
        ]
    }

    convertUpload({ el, file }: {el: string, file: string}): string[] {
        return [
            `await page.waitForSelector(\`${el}\`, { timeout: 10000 })`,
            `const inputElement = await page.$(\`${el}\`);`,
            `await inputElement.uploadFile('${(path.resolve('.', 'test', 'stories', 'files', file))}');`,
        ]
    }
    
    convertKeyPress(key: KeyInput): string[] { 
        return [
            `await page.keyboard.press(\`${key}\`)`
        ]
    }

    convertScreenshot({ path, type = "png", fullPage = false }: ConvertScreenshot): string[] {
        type = type === "jpeg" ? type  : "png"
        path = path.match(type) ? path : getExt(path, type)
        return [
            `await page.screenshot(${JSON.stringify({ type, path, fullPage })})`
        ]
    }
}