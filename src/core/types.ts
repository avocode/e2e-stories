import Joi from "joi"

/**
 * This interface does not cover all Core methods, 
 * because most of them are private
*/
export interface CoreI {
  setConfig: (obj: object) => void;
  loadFilesConvertThemAndSaveTogether: () => Promise<void>;
  loadFilesConvertThemAndSaveSeparatelly: () => Promise<void>;
  loadYamlStoryComponents: () => Promise<void>;
  convertYamlToJs: (rawYaml: string, schema: Joi.ObjectSchema<any>, filePath: string) => string;
};

export interface UtilsI {
  cleanOutputDir: (outputFolder: string) => Promise<Boolean>;
  save: ({ name, content }: { name: string; content: string; }, outputFolder: string ) => Promise<void>;
  validateSchema: (rawYaml: string, schema: Joi.ObjectSchema<any>, filePath: string) => Joi.ValidationResult;
  loadYamlFiles: (path: string) => Promise<string[]>;
  filterYamlFiles: (rawYamlFiles: string[], components?: Boolean) => string[];
  checkSchemaError: (schema: Joi.ValidationResult) => Joi.ValidationErrorItem | null;
  throwError: (err: { message: string; }, file: string) => void;
  checkError: (schema: Joi.ValidationResult) => Joi.ValidationErrorItem | null;
};

export interface SharedUitlsI {
  addTabs: (fn: Function) => (value: string | number | object ) => string;
  handleTimestamp: (value: string) => string;
  replaceTestSettings: (code: string, testSettings?: TestSettings | undefined) => string;
  replaceHeaders: (code: string, headers: string) => string;
  getNumberForVarName: () => number;
};

export interface SchemasI {
  stepsSchema: Joi.ObjectSchema<Joi.StringSchema | Joi.NumberSchema | Joi.ObjectSchema<Joi.StringSchema>>;
  schema: Joi.ObjectSchema<Joi.StringSchema | Joi.BooleanSchema | Joi.ObjectSchema<Joi.StringSchema | Joi.NumberSchema> | Joi.ArraySchema>;
  schemaWithoutName: Joi.ObjectSchema<Joi.StringSchema | Joi.ArraySchema>;
}

export interface SharedConvertMethods {
  convertComponent: (componentNameAndArgs: string) => string[];
  convertToOnly: (value: string) => string;
  convertToSkip: (value: string) => string;
  convertToJsCode(codeArr: (string | string[])[]): string;
};

/**
 * This interface does not cover all convert methods, 
 * because they are already checked and typed in MapToJs
*/
export interface ConvertMethodsI {
  convertToJsArr: (schema: StoryComponent) => string[];
}

export type StorySteps = {
  [Step: string]: object | string | number | undefined;
  component?: string;
  visit?: string;
  click?: string;
  dblClick?: string;
  urlIs?: string;
  exists?: string;
  notExists?: string;
  pause?: number;
  fill?: {
      el: string; 
      text: string;
  };
  textIs?: {
      el: string; 
      text: string;
  };
  select?: {
      el: string;
      text: string;
  };
  upload?: {
      el: string;
      file: string;
  };
  keyPress?: KeyInput;
  screenshot?: {
    path: string;
    type?: "png" | "jpeg";
    fullPage?: boolean;
  };
}

export type Story = {
  name: string;
  only?: boolean;
  skip?: boolean;
  todo?: string;
  testSettings?: TestSettings;
  steps: StorySteps[];
};

export type StoryComponent = {
  name?: string;
  steps: StorySteps[];
};

export type TestSettings = {
  retryTimes?: number;
  setTimeout?: number;
};

export type MapToJs = {[key: string]: Function, 
  name: (value: string) => string[];
  component: (componentNameAndArgs: string) => string[];
  visit: (url: string) => string[];
  click: (selector: string, count?: number) => string[];
  dblClick: (selector: string) => (selector: string, count: 2) => string[];
  urlIs: (url: string) => string[];
  exists: (value: string) => string[];
  notExists: (value: string) => string[];
  pause: (milisec: number) => string[];
  fill: ({ el, text }: { el: string; text: string; }) => string[];
  textIs: ({ el, text }: { el: string; text: string; }) => string[];
  select: ({ el, text }: { el: string; text: string; }) => string[];
  upload: ({ el, file }: { el: string; file: string; }) => string[];
  keyPress: (key: KeyInput) => string[];
  screenshot: ({ path, type, fullPage}: ConvertScreenshot) => string[];
};

export type ConvertScreenshot = {
  path: string,
  type?: "png" | "jpeg",
  fullPage?: boolean
}


export type KeyInput =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | 'Power'
  | 'Eject'
  | 'Abort'
  | 'Help'
  | 'Backspace'
  | 'Tab'
  | 'Numpad5'
  | 'NumpadEnter'
  | 'Enter'
  | '\r'
  | '\n'
  | 'ShiftLeft'
  | 'ShiftRight'
  | 'ControlLeft'
  | 'ControlRight'
  | 'AltLeft'
  | 'AltRight'
  | 'Pause'
  | 'CapsLock'
  | 'Escape'
  | 'Convert'
  | 'NonConvert'
  | 'Space'
  | 'Numpad9'
  | 'PageUp'
  | 'Numpad3'
  | 'PageDown'
  | 'End'
  | 'Numpad1'
  | 'Home'
  | 'Numpad7'
  | 'ArrowLeft'
  | 'Numpad4'
  | 'Numpad8'
  | 'ArrowUp'
  | 'ArrowRight'
  | 'Numpad6'
  | 'Numpad2'
  | 'ArrowDown'
  | 'Select'
  | 'Open'
  | 'PrintScreen'
  | 'Insert'
  | 'Numpad0'
  | 'Delete'
  | 'NumpadDecimal'
  | 'Digit0'
  | 'Digit1'
  | 'Digit2'
  | 'Digit3'
  | 'Digit4'
  | 'Digit5'
  | 'Digit6'
  | 'Digit7'
  | 'Digit8'
  | 'Digit9'
  | 'KeyA'
  | 'KeyB'
  | 'KeyC'
  | 'KeyD'
  | 'KeyE'
  | 'KeyF'
  | 'KeyG'
  | 'KeyH'
  | 'KeyI'
  | 'KeyJ'
  | 'KeyK'
  | 'KeyL'
  | 'KeyM'
  | 'KeyN'
  | 'KeyO'
  | 'KeyP'
  | 'KeyQ'
  | 'KeyR'
  | 'KeyS'
  | 'KeyT'
  | 'KeyU'
  | 'KeyV'
  | 'KeyW'
  | 'KeyX'
  | 'KeyY'
  | 'KeyZ'
  | 'MetaLeft'
  | 'MetaRight'
  | 'ContextMenu'
  | 'NumpadMultiply'
  | 'NumpadAdd'
  | 'NumpadSubtract'
  | 'NumpadDivide'
  | 'F1'
  | 'F2'
  | 'F3'
  | 'F4'
  | 'F5'
  | 'F6'
  | 'F7'
  | 'F8'
  | 'F9'
  | 'F10'
  | 'F11'
  | 'F12'
  | 'F13'
  | 'F14'
  | 'F15'
  | 'F16'
  | 'F17'
  | 'F18'
  | 'F19'
  | 'F20'
  | 'F21'
  | 'F22'
  | 'F23'
  | 'F24'
  | 'NumLock'
  | 'ScrollLock'
  | 'AudioVolumeMute'
  | 'AudioVolumeDown'
  | 'AudioVolumeUp'
  | 'MediaTrackNext'
  | 'MediaTrackPrevious'
  | 'MediaStop'
  | 'MediaPlayPause'
  | 'Semicolon'
  | 'Equal'
  | 'NumpadEqual'
  | 'Comma'
  | 'Minus'
  | 'Period'
  | 'Slash'
  | 'Backquote'
  | 'BracketLeft'
  | 'Backslash'
  | 'BracketRight'
  | 'Quote'
  | 'AltGraph'
  | 'Props'
  | 'Cancel'
  | 'Clear'
  | 'Shift'
  | 'Control'
  | 'Alt'
  | 'Accept'
  | 'ModeChange'
  | ' '
  | 'Print'
  | 'Execute'
  | '\u0000'
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'
  | 'Meta'
  | '*'
  | '+'
  | '-'
  | '/'
  | ';'
  | '='
  | ','
  | '.'
  | '`'
  | '['
  | '\\'
  | ']'
  | "'"
  | 'Attn'
  | 'CrSel'
  | 'ExSel'
  | 'EraseEof'
  | 'Play'
  | 'ZoomOut'
  | ')'
  | '!'
  | '@'
  | '#'
  | '$'
  | '%'
  | '^'
  | '&'
  | '('
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z'
  | ':'
  | '<'
  | '_'
  | '>'
  | '?'
  | '~'
  | '{'
  | '|'
  | '}'
  | '"'
  | 'SoftLeft'
  | 'SoftRight'
  | 'Camera'
  | 'Call'
  | 'EndCall'
  | 'VolumeDown'
  | 'VolumeUp';