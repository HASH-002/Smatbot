const axios = require('axios');
const createError = require('http-errors');
var express = require('express');
const { api_key, domain } = require('../config');
const Contact = require('../models/contact');
const { contactSchema, dataStoreValidationSchema, updateContactSchema } = require('../utilities/validation_schema');

// Using Router of express
var router = express.Router();

// Route 1 Create a new Contact
router.post('/createContact', async (req, res, next) => {
    try {
        await contactSchema.validateAsync(req.body); // perform validation

        if (req.body.data_store === "Database") {
            const contactData = new Contact(req.body); // create contact
            Contact.createContact(contactData, (err, contact) => {
                if (err) {
                    err.message = "MYSQL error-> " + err.sqlMessage;
                    err.status = err.errno === 1062 ? 409 : err.errno;
                    next(err);
                } else
                    res.send({ success: true, message: `Contact created successfully in ${req.body.data_store}` });
            });
        } else {
            const { data } = await axios.post(`https://${domain}/crm/sales/api/contacts`,
                {
                    "contact": {
                        "first_name": req.body.first_name,
                        "last_name": req.body.last_name,
                        "email": req.body.email,
                        "mobile_number": req.body.mobile_number,
                        "custom_field": {
                            "cf_data_store": req.body.data_store
                        }
                    }
                },
                {
                    headers: {
                        'Authorization': `Token token=${api_key}`,
                        'Content-Type': "application/json"
                    }
                });
            res.send({ success: true, message: `Contact created successfully in ${req.body.data_store}` });
        }

    } catch (error) {
        if (error.isJoi)
            error.status = 422; // by default it will give 500 error status which is not correct
        else if (error.response !== undefined) {
            if (error.response.status === 400) {
                error.status = 409;
                error.message = "Conflict, email Already exists";
            } else {
                error.status = error.response.status;
                error.message = error.response.statusText;
            }
        }
        next(error);
    }
});

// Route 2 get a contact
router.get('/getContact/:id', async (req, res, next) => {
    try {
        await dataStoreValidationSchema.validateAsync(req.body); // perform validation

        if (req.body.data_store === 'Database') {
            Contact.getContactByID(req.params.id, (err, contact) => {
                if (err) {
                    err.message = "MYSQL error-> " + err.sqlMessage;
                    next(err);
                }
                else if (contact.length == 0) {
                    var err = new createError.NotFound();
                    next(err);
                } else
                    res.json(contact);
            });
        } else {
            const { data } = await axios.get(`https://${domain}/crm/sales/api/contacts/${req.params.id}`,
                {
                    headers: {
                        'Authorization': `Token token=${api_key}`,
                        'Content-Type': "application/json"
                    }
                });
            res.json(data);
        }
    } catch (error) {
        if (error.response !== undefined) {
            error.status = error.response.status;
            error.message = error.response.statusText;
        }
        next(error);
    }
});

// Route 3 update a contact
router.put('/updateContact/:id', async (req, res, next) => {
    try {
        await updateContactSchema.validateAsync(req.body); // perform validation

        if (req.body.data_store === 'Database') {
            Contact.updateContact(req.params.id, req.body, (err, contact) => {
                if (err) {
                    if (err.sqlMessage !== undefined)
                        err.message = "MYSQL error-> " + err.sqlMessage;
                    err.status = err.errno === 1062 ? 409 : err.errno;
                    next(err);
                } else {
                    res.json({ success: true, message: `Contact updated successfully in ${req.body.data_store}` });
                }
            });
        } else {
            const { data } = await axios.put(`https://${domain}/crm/sales/api/contacts/${req.params.id}`,
                {
                    "contact": {
                        "email": req.body.email,
                        "mobile_number": req.body.mobile_number
                    }
                },
                {
                    headers: {
                        'Authorization': `Token token=${api_key}`,
                        'Content-Type': "application/json"
                    }
                });
            res.json({ success: true, message: `Contact updated successfully in ${req.body.data_store}` });
        }
    } catch (error) {
        if (error.response !== undefined) {
            if (error.response.status === 400) {
                error.status = 409;
                error.message = "Conflict, email Already exists";
            } else {
                error.status = error.response.status;
                error.message = error.response.statusText;
            }
        }
        next(error);
    }
});

// Route 4 delete a contact
router.delete('/deleteContact/:id', async (req, res, next) => {
    try {
        await dataStoreValidationSchema.validateAsync(req.body); // perform validation

        if (req.body.data_store === 'Database') {
            Contact.deleteContact(req.params.id, (err, contact) => {
                if (err) {
                    if (err.sqlMessage !== undefined)
                        err.message = "MYSQL error-> " + err.sqlMessage;
                    next(err);
                } else
                    res.json({ success: true, message: `Contact deleted successfully in ${req.body.data_store}` });
            });
        } else {
            const { data } = await axios.delete(`https://${domain}/crm/sales/api/contacts/${req.params.id}`,
                {
                    headers: {
                        'Authorization': `Token token=${api_key}`,
                        'Content-Type': "application/json"
                    }
                });
            res.json({ success: true, message: `Contact deleted successfully in ${req.body.data_store}` });
        }
    } catch (error) {
        if (error.response !== undefined) {
            error.status = error.response.status;
            error.message = error.response.statusText;
        }
        next(error);
    }
});

module.exports = router;