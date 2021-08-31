import { TestSettings, SharedUitlsI } from "../core/types"

let lettersCounter = 0

export default new class SharedUtils implements SharedUitlsI {

    addTabs = (fn: Function) => (value: string | number | object ) => fn(value).map((val: string) => `\t\t${val}`)

    handleTimestamp(value: string): string {
        const replacedTimestamp = value.replace(/{ TIMESTAMP }/gi, '${random}')
        return replacedTimestamp
    }

    replaceTestSettings(code: string, testSettings?: TestSettings): string {
        const config: {[keyword: string]: any} = {
            retryTimes: 3,
            setTimeout: 50000,
            ...testSettings,
        }
          
        Object.keys(config).forEach((keyword: string) => (
            
            code = code.replace(`##${keyword.toUpperCase()}##`, config[keyword])
        ))
        return code
    }

    replaceHeaders(code: string, headers: string): string {
        const replacedHeaders = code.replace('##HEADERS##', headers)
        return replacedHeaders
    }

    getNumberForVarName(): number {
        return lettersCounter++
    }

}