# E2E-Stories
![](https://github.com/avocode/e2e-stories/actions/workflows/node.js.yml/badge.svg)

> E2E testing with Jest and Puppeteer, flavored with simplified Yaml syntax.


## Info

E2E-Stories is a tool, which aims to make web testing using Jest and Puppeteer easy to use, without strong programming skills.

Test writing with this tool is faster and easier than writing regular tests because YAML is easy to write and understand, GUI testing tools are slow, we've got that covered, convert time of the test is only limited by the power of your machine and in most cases, converting doesn't take more than 1 second, and one more good fact, this tool is free 😉

## Getting started
* `yarn add -D e2e-stories` or `npm install -D e2e-stories`
* Add Jest command to your `package.json` \(Jest is already installed with this dependency\)

```diff
{
  "name": "example-usage-of-e2e-stories",
  "main": "index.js",
+  "scripts": {
+    "test": "jest"
+  },
  "dependencies": {
    "e2e-stories": "^0.1.3"
  }
}
```

* Add Jest config for puppeteer to package.json

```diff
{
  "name": "example-usage-of-e2e-stories",
  "main": "index.js",
  "scripts": {
    "test": "jest"
  },
+  "jest": {
+    "preset": "jest-puppeteer",
+    "testRunner": "jest-circus/runner"
+  },
  "dependencies": {
    "e2e-stories": "^0.1.3"
  }
}
```

* Now, create a file called `jest-puppeteer.config.js` in root of your project. Put this inside the file:

```javascript
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
```

* As you can see, you can use env variable to change the headlessness of the Chromium browser.
* **Setup is almost over**. One more thing is to create a convert file, that will convert Yaml stories to proper JS tests.
  * Create a file called `convert-stories.js`
  * This is the minimal example of using convert

```javascript
const convertStories = require('e2e-stories')

convertStories({
  out: './test/spec', // path to JS test files output folder
})
```

* It's a good idea to add this script to `package.json`. For example like this:

```diff
{
  "name": "example-usage-of-e2e-stories",
  "main": "index.js",
  "scripts": {
    "test": "jest",
+   "convert": "node convert-stories.js"
  },
  "jest": {
    "preset": "jest-puppeteer",
    "testRunner": "jest-circus/runner"
  },
  "dependencies": {
    "e2e-stories": "^0.1.3"
  }
}
```

* More related optional settings to converStories method can be found here: 
  * `out`: `string` - _required_ - path to where the JS test files should be saved.
  * `outputType`: `string` - currently only puppeteer is supported, other tools coming soon.
  * `pathToYaml`: `glob pattern string` - this option specifies where e2e-stories should look for your yaml stories and components. Default pattern is: `'*(playground|test|tests|spec|src|build)/**/stories/**/*.+(yaml|yml)'`
  * `together`: `boolean` - If you want to have all your tests from your stories in one file, set this option to `true`. Default is `false`.

**SETUP IS OVER**

## How to write stories

* Create a `test` folder and inside it create a `stories` folder
* Inside the `stories` folder, create a new file `first-test.yaml` \(the name is not important\)
* Below is a real example of a story

```yaml
name: Visit example.com webpage, checks and clicks the link

steps: 
  - visit: https://example.com
  - exists: '[href="https://www.iana.org/domains/example"]'
  - click: '[href="https://www.iana.org/domains/example"]'
```

* As you can see, it's easily readable and understandable. 
* To convert this story into a real test run `yarn convert`
* You should see generated test inside the specified output directory.
* If you want to preview this example story, just run `yarn test`, and you should see the results in your console, and image in the output folder.

## Stories options

* **name** - `string` - required param for all stories, name of your story, be descriptive and creative, explain what it does
* **skip** - `boolean` - optional param for skipping the current story
* **testSettings** - `object {retryTimes: number, setTimeout: number}` - optional param for changing test settings of testing tool (currently Jest). Default values:
  * `retryTimes`: 3 - How many times tests are re-tested if test fails.
  * `setTimeout`: 50000 - Delay in ms before test fails.
* **steps** - required param for all stories

Inside **steps** you can use the following commands:

* **component**
  * Use this to include component. This is useful for repeated tasks like login.
  * Components name must have `something.component.yaml` signature.
  * You can nest components, so you can reference a component inside a component.
  * Example of simple component - `login.component`
  * Also it's possible to pass options to components like this:
    * `login.component#username=${bestTesterEver}#pass=${process.env.PASS}`
    * You can reference those options like regular variables.
* **visit** - `URL string`.
* **click** - `CSS selector string`.
* **dblClick** - `CSS selector string`.
* **urlIs** - `URL string`.
* **exists** - `CSS selector string`.
* **notExists** - `CSS selector string`.
* **pause** - `Number` ms.
* **fill** - `Object { el: CSS Selector, text: String }`
  * You can use `{ TIMESTAMP }` to add "random" hash to the String.
* **textIs** - `Object { el: CSS Selector, text: String }`
* **select** - `Object { el: CSS Selector, text: String }`
  * Use for selecting an option from a dropdown element.
* **upload** - `Object { el: CSS Selector, file: filename String }`
  * Enter full filename with extension.
  * CSS Selector must match an input element.
  * Store your files in `./test/stories/files`
* **keyPress** - `String` - \([US keyboard keys](./src/core/types.ts#L133)\)
* **screenshot** - `Object { path: string, type: string, fullPage: boolean }`
  * `path` - Where the file will be saved, if the path is wrong, your image won't saved!
  * `type` - Type of the image (only jpeg or png), default is png format, jpeg can have better quality than png.
  * `fullPage` - Allows you to capture the whole page from top to the bottom without scrolling, 
  but the image quality is affected by it. In default its turned of.

## Local variables

**Temporarily disabled**

_Will be fixed soon._
