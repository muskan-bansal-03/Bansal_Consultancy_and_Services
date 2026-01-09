🏢 Bansal Consultancy and Services

Enterprise Employee Joining & Management System

A full-stack, production-ready web application designed for Bansal Consultancy and Services to digitally manage employee joining forms, securely store data, enable admin-side search & filtering, and export records to Excel — all with a modern corporate UI.

📌 Project Overview

This system replaces traditional paper-based joining forms with a secure, searchable, and scalable digital platform.

Key Goals:

Digital employee onboarding

Permanent database storage

Fast search & filtering

One-click Excel export

Professional consulting-firm UI/UX

Admin-only private dashboard

🌐 Website Modules
🔹 Public Website

Home

About Us

Services

Careers (Joining Form)

Contact Us

✔ Fully responsive
✔ Corporate consulting theme
✔ Clean typography & card-based layout
✔ White background with navy blue / grey accents

🔹 Joining Form (Core Feature)

A modern digital form containing all real-world HR fields, grouped and validated.

1️⃣ Personal Information

Employee Code

First Name / Middle Name / Last Name

Father’s Name

Mother’s Name

Email ID

Mobile Number

Alternate Mobile Number

Date of Birth

Date of Joining

Marital Status

Blood Group

Wife Name

Number of Family Members

2️⃣ Bank & Identification Details

Bank Account Number

IFSC Code

Aadhaar Card Number

PAN Number

UAN Number

ESIC Number

3️⃣ Address Details

Local Address

Permanent Address

Pin Code

4️⃣ Education Details (Dynamic Table)

10th

12th

Graduation

Post-Graduation

Diploma

Post Diploma

Others

Columns:

Degree

College / University / Board

Percentage / Marks

Passing Year

5️⃣ Employment History (Multiple Rows)

Employer Name

Location

Designation

From Date

To Date

CTC

6️⃣ References

Name

Organization

Mobile Number

7️⃣ Company Relation Declaration

Related to company? (Yes / No)

Company Name

Person Name

Department

8️⃣ Final Declaration

Declaration checkbox

Signature (text)

Date

✔ Client-side validation
✔ Secure submission
✔ Success confirmation

🖥️ Admin Panel (Private Software)

A fully functional HR Admin System.

Features:

Secure Admin Login

Professional dashboard UI

Sidebar navigation

Data table with all submissions

Live search (Name / Mobile / Email / Employee Code)

Date-wise filtering

Download Excel (.xlsx) button

Software-style layout (enterprise look)

⚙️ Technology Stack
Frontend

HTML5

CSS3 (Corporate UI/UX design)

JavaScript (Vanilla JS)

Backend

Node.js

Express.js

Database

MySQL

Excel Export

xlsx (Node.js library)

📁 Folder Structure
bansal-consultancy-system/
│
├── frontend/
│   ├── index.html
│   ├── about.html
│   ├── services.html
│   ├── careers.html
│   ├── contact.html
│   ├── admin-login.html
│   ├── admin-dashboard.html
│   │
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── form.js
│   │   ├── admin.js
│   │   └── validation.js
│
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── routes/
│   │   └── employeeRoutes.js
│   ├── controllers/
│   │   └── employeeController.js
│
├── database/
│   └── schema.sql
│
├── package.json
├── README.md

🛠️ Installation & Setup
🔹 1. Clone Repository
git clone https://github.com/USERNAME/bansal-consultancy-system.git
cd bansal-consultancy-system

🔹 2. Database Setup (MySQL)

Create database:

CREATE DATABASE bansal_consultancy;


Import schema:

SOURCE database

Update database credentials in:

backend/db.js

🔹 3. Backend Setup
cd backend
npm install
node server.js


Server runs on:

http://localhost:5000

🔹 4. Frontend Setup

Open frontend/index.html in browser
OR

Use Live Server extension in VS Code

📤 Excel Export

Admin panel includes Download Excel button

Exports all employee records into .xlsx

Proper column formatting

🔐 Security Notes

Admin routes protected

Backend validation enabled

SQL injection prevention

Clean input handling

🎯 Business Use Case

This system is built for real HR & consulting operations, suitable for:

Consulting firms

Corporate HR departments

Staffing & recruitment agencies

📌 Future Enhancements

Role-based admin access

File upload (Aadhaar / PAN)

Email notifications

Cloud deployment

Analytics dashboard

👨‍💻 Developed For

Bansal Consultancy and Services
Enterprise-grade consulting firm software solution.
