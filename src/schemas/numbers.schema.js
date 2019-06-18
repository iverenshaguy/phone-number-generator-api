import Joi from 'joi';

export const getSchema = Joi.object().keys({
  sort: Joi.string().valid(['ASC', 'DESC']),
  count: Joi.number().min(1).max(10000)
});

export default {
  getSchema
};
