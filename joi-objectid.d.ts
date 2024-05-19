import Joi from '@hapi/joi';

declare function joiObjectId(Joi: typeof Joi, message?: string): () => Joi.AlternativesSchema;

export = joiObjectId;
