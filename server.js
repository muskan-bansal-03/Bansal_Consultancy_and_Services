
/**
 * BANSAL CONSULTANCY BACKEND (Node.js + Express + MySQL)
 * This file is for local implementation reference.
 */

/*
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const XLSX = require('xlsx');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'bansal_consultancy'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// API: Save Joining Form
app.post('/api/save-application', (req, res) => {
    const data = req.body;
    
    // First, save the main application record
    const sql = `INSERT INTO applications (
        employee_code, first_name, middle_name, last_name, father_name, mother_name,
        email, mobile, alternate_mobile, dob, doj, marital_status, blood_group,
        wife_name, family_members, bank_account, ifsc_code, aadhaar_number,
        pan_number, uan_number, esic_number, local_address, permanent_address,
        pincode, is_related, related_company, related_person, related_dept,
        signature, submission_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        data.employeeCode, data.firstName, data.middleName, data.lastName, data.fatherName, data.motherName,
        data.email, data.mobile, data.alternateMobile, data.dob, data.doj, data.maritalStatus, data.bloodGroup,
        data.wifeName, data.familyMembersCount, data.bankAccount, data.ifscCode, data.aadhaarNumber,
        data.panNumber, data.uanNumber, data.esicNumber, data.localAddress, data.permanentAddress,
        data.pincode, data.isRelatedToCompany, data.relatedCompanyName, data.relatedPersonName, data.relatedDepartment,
        data.signature, data.submissionDate
    ];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const appId = result.insertId;

        // Save nested tables (Education, Employment, etc) logic goes here...
        // ... loop through data.education and perform INSERTs using appId
        
        res.status(200).json({ success: true, id: appId });
    });
});

// API: Fetch All for Admin
app.get('/api/admin/applications', (req, res) => {
    const { search } = req.query;
    let sql = 'SELECT * FROM applications';
    let params = [];
    
    if (search) {
        sql += ' WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR employee_code LIKE ?';
        params = [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`];
    }
    
    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// API: Export to Excel
app.get('/api/admin/export', (req, res) => {
    db.query('SELECT * FROM applications', (err, results) => {
        if (err) return res.status(500).send(err);
        
        const ws = XLSX.utils.json_to_sheet(results);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Applications");
        
        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=applications.xlsx');
        res.send(buffer);
    });
});

app.listen(5000, () => console.log('Server running on port 5000'));
*/
