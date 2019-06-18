import Joi from 'joi';

export const signinSchema = Joi.object().keys({
  userId: Joi.string().alphanum().min(3).max(30)
    .required(),
  password: Joi.string().required()
});

export default {
  signinSchema
};
