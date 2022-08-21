const Joi = require('joi');

module.exports = {
    contactSchema: Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().email().lowercase().required(),
        mobile_number: Joi.number().required(),
        data_store: Joi.string().valid('CRM', 'Database').required() // only CRM or Database(mysql) is allowed
    }),
    dataStoreValidationSchema: Joi.object({
        data_store: Joi.string().valid('CRM', 'Database').required() // only CRM or Database(mysql) is allowed
    }),
    updateContactSchema: Joi.object({
        email: Joi.string().email().lowercase().required(),
        mobile_number: Joi.number().required(),
        data_store: Joi.string().valid('CRM', 'Database').required() // only CRM or Database(mysql) is allowed
    })
};