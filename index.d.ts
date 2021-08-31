export = convertStories;
/**
 * __*Converts your yaml stories into puppeteer testing code*__
 * @param config.out folder where the test files will be outputed
 * @param config.outputType tool which the tests are going to be using, currently only puppeteer, soon there is going to be more tools
 * @param config.headers object with headers for the tests, can be access tokens or whatever you want
 * @param config.pathToYaml glob pattern to find yaml files, be careful with it
 *
 */
declare function convertStories(config?: {    
    out: string,
    outputType?: "puppeteer", 
    headers?: object, 
    pathToYaml?: string,
}): void;