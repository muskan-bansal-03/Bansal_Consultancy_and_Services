
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '', 
    database: process.env.DB_NAME || 'bansal_consultancy'
});

db.connect(err => {
    if (err) {
        console.warn('MySQL Connection failed. Running in memory/mock mode for demo purposes.');
    } else {
        console.log('MySQL Connected successfully...');
    }
});

// API: Save Joining Form
app.post('/api/save-application', (req, res) => {
    const data = req.body;
    const sql = `INSERT INTO applications (
        employee_code, first_name, middle_name, last_name, father_name, mother_name,
        email, mobile, alternate_mobile, dob, doj, marital_status, blood_group,
        wife_name, family_members, bank_account, ifsc_code, aadhaar_number,
        pan_number, uan_number, esic_number, local_address, permanent_address,
        pincode, is_related, related_company, related_person, related_dept,
        signature, submission_date, education_json, employment_json, references_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        data.employeeCode, data.firstName, data.middleName, data.lastName, data.fatherName, data.motherName,
        data.email, data.mobile, data.alternateMobile, data.dob, data.doj, data.maritalStatus, data.bloodGroup,
        data.wifeName, data.familyMembersCount, data.bankAccount, data.ifscCode, data.aadhaarNumber,
        data.panNumber, data.uanNumber, data.esicNumber, data.localAddress, data.permanentAddress,
        data.pincode, data.isRelatedToCompany, data.relatedCompanyName, data.relatedPersonName, data.relatedDepartment,
        data.signature, data.submissionDate,
        JSON.stringify(data.education),
        JSON.stringify(data.employment),
        JSON.stringify(data.references)
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("DB Error:", err);
            return res.status(500).json({ error: "Storage error. Record might be only local." });
        }
        res.status(200).json({ success: true, id: result.insertId });
    });
});

// API: Fetch All for Admin
app.get('/api/admin/applications', (req, res) => {
    db.query('SELECT * FROM applications ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).send({ error: "Database offline" });
        res.json(results.map(r => ({
            id: r.id,
            employeeCode: r.employee_code,
            firstName: r.first_name,
            lastName: r.last_name,
            email: r.email,
            mobile: r.mobile,
            dob: r.dob,
            doj: r.doj,
            localAddress: r.local_address,
            signature: r.signature,
            aadhaarNumber: r.aadhaar_number,
            ifscCode: r.ifsc_code,
            education: JSON.parse(r.education_json || '[]'),
            employment: JSON.parse(r.employment_json || '[]'),
            references: JSON.parse(r.references_json || '[]')
        })));
    });
});

// API: Delete Application
app.delete('/api/admin/applications/:id', (req, res) => {
    db.query('DELETE FROM applications WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ success: true });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
