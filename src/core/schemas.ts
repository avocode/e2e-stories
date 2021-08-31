import Joi from "joi"
import { SchemasI } from './types'

export default new class Schemas implements SchemasI {
    stepsSchema = Joi.object().keys({
        component: Joi.string().min(1),
        visit: Joi.string().min(5),
        click: Joi.string().min(1),
        dblClick: Joi.string().min(1),
        urlIs: Joi.string().min(1),
        exists: Joi.string().min(1),
        notExists: Joi.string().min(1),
        pause: Joi.number().integer().min(0),
        fill: Joi.object().keys({
            el: Joi.string().min(1).required(),
            text: Joi.string().min(1).required(),
        }),
        textIs: Joi.object().keys({
            el: Joi.string().min(1).required(),
            text: Joi.string().min(1).required(),
        }),
        select: Joi.object().keys({
            el: Joi.string().min(1).required(),
            text: Joi.string().min(1).required(),
        }),
        upload: Joi.object().keys({
            el: Joi.string().min(1).required(),
            file: Joi.string().min(1).required(),
        }),
        keyPress: Joi.string().min(1),
        screenshot: Joi.object().keys({
            path: Joi.string().required(),
            type: Joi.string().min(3).max(4),
            fullPage: Joi.boolean(),
        })
    })
  
    schema = Joi.object().keys({
        name: Joi.string().min(10).required(),
        only: Joi.bool(),
        skip: Joi.bool(),
        todo: Joi.string(),
        testSettings: Joi.object().keys({
            retryTimes: Joi.number().min(1),
            setTimeout: Joi.number().min(2),
        }),
        steps: Joi.array().items(this.stepsSchema).min(1).required(),
    })
  
    schemaWithoutName = Joi.object().keys({
        name: Joi.string().strip(),
        steps: Joi.array().items(this.stepsSchema).min(1).required(),
    })
}