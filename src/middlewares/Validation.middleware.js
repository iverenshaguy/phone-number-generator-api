import Joi from 'joi';

/**
 * @class Validation
 */
export default class Validation {
  /**
   * @constructor
   *
   * @param {object} schema schema
   */
  constructor(schema) {
    this.schema = schema;
    this.options = { abortEarly: false };
  }

  /**
   * @method validate
   *
   * @param {object} req
   *
   * @param {object} res
   *
   * @param {object} next
   *
   * @returns {func} res or next
   */

   validate = (req, res, next) => {
     const validation = Joi.validate({ ...req.body, ...req.query }, this.schema, this.options);

     if (validation.error) {
       const message = this._getMessage(validation.error);
       return res.status(400).json(message);
     }
     next();
   }


   /**
    * @private
    * @method getMessage
    *
    * @param {object} error joi error object
    *
    * @returns {object} validation message
    */
   _getMessage(error) {
     const { details } = error;
     const errorDetails = this._getErrorDetails(details);

     return {
       status: 400,
       error: errorDetails
     };
   }

   /**
    * @private
     * @method getErrorDetails
     *
     * @param {object} details details
     *
     * @returns {object} error details
     */
   _getErrorDetails(details) {
     const mappedDetails = {};

     for (let i = 0; i < details.length; i += 1) {
       const path = details[i].path[0];
       const { message } = details[i];
       const pathDetails = mappedDetails[path];

       if (!pathDetails) {
         mappedDetails[path] = [message];
       } else {
         pathDetails.push(message);
       }
     }
     return mappedDetails;
   }
}
