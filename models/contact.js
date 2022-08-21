var dbConn = require('../dbconfig');
const createError = require('http-errors');

var Contact = function (contact) {
    this.first_name = contact.first_name;
    this.last_name = contact.last_name;
    this.email = contact.email;
    this.mobile_number = contact.mobile_number;
    this.data_store = contact.data_store;
};

// create new contact
Contact.createContact = (contact, result) => {
    dbConn.query('INSERT INTO contacts SET ? ', contact, (err, res) => {
        if (err) {
            result(err, null);
        } else {
            console.log('Contact created successfully');
            result(null, res);
        }
    });
};

// get contact by ID from DB
Contact.getContactByID = (id, result) => {
    dbConn.query('SELECT * FROM contacts WHERE id=?', id, (err, res) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// update contact
Contact.updateContact = (id, contactReqData, result) => {
    dbConn.query("UPDATE contacts SET email=?,mobile_number=? WHERE id = ?", [contactReqData.email, contactReqData.mobile_number, id], (err, res) => {
        if (err) {
            result(err, null);
        } else {
            if (res.affectedRows === 0)
                result(new createError.NotFound(), null); // given id is not inside database
            else
                result(null, res);
        }
    });
};

// delete contact
Contact.deleteContact = (id, result) => {
    dbConn.query('DELETE FROM contacts WHERE id=?', [id], (err, res) => {
        if (err) {
            result(err, null);
        } else {
            if (res.affectedRows === 0)
                result(new createError.NotFound(), null); // given id is not inside database
            else
                result(null, res);
        }
    });
};

module.exports = Contact;