import { SharedConvertMethods } from "../core/types"
import Core from "../templates/puppeteer/core"

export default new class ConvertMethods implements SharedConvertMethods {

    convertComponent(componentNameAndArgs: string): string[] {
        let [componentName, ...args] = componentNameAndArgs.split('#')
        args = args.map((arg) => {
            if (arg) {
                let splitedArg = arg.split('=')
                return `\t\tlet ${splitedArg[0]} = '${splitedArg[1]}'`
            }
            return arg
        })

        for (let i = 0; i < Core.compFilePathsList.length; i++) {
            if(Core.compFilePathsList[i].match(componentName)) {
                const res = Core.convertComponent(Core.compFilePathsList[i])
                return [
                    args.join('\n'),
                    res.join('\n'),
                ]
            }
        }
        throw new Error(`Component ${componentName} was not found. Could you check your spelling please?`)
    }

    convertToOnly(value: string): string {
        return value.replace('it(', 'it.only(')
    }
    
    convertToSkip(value: string): string {
        return value.replace('it(', 'it.skip(')
    }
    
    convertToJsCode(codeArr: (string|string[])[]): string {
        return codeArr.join('\n')
    }
}