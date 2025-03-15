const db = require('../config/db');

exports.getContactForm = (req, res) => {
    res.render('contact', { user: req.session.user, success: req.query.success });
};

exports.submitContactForm = (req, res) => {
    const { name, email, message } = req.body;

    const sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
    db.query(sql, [name, email, message], (err, result) => {
        if (err) throw err;
        res.redirect('/contact?success=true');  // Redirect with success message
    });
};

exports.listContacts = (req, res) => {
    const sql = "SELECT * FROM contacts ORDER BY created_at DESC";
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.render('contacts', { user: req.session.user, contacts: results });
    });
};