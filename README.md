# JobScope: AI Aggregator for Career Opportunities

## 🚀 Introduction  
**JobScope** is an AI-powered job aggregator platform that fetches job listings from multiple sources and allows users to apply seamlessly. It provides a centralized hub for job seekers while enabling administrators to manage applications efficiently. 🏢💼

## 🎯 Features  
- **AI-Powered Job Aggregation** – Fetches job listings from APIs and displays them dynamically.
- **Easy Application Process** – Users can apply directly to jobs through the platform.
- **Admin Panel** – Admins can view and manage submitted applications.
- **User Profiles** – Users can maintain their profile with contact details and career information.
- **Secure Authentication** – Role-based access for users and admins.
- **Sleek & Responsive UI** – Built with **Tailwind CSS** for a modern and intuitive experience.  

## 🛠️ Tech Stack  
- **Backend:** Node.js, Express.js  
- **Frontend:** Tailwind CSS, Alpine.js  
- **Database:** MySQL  
- **Authentication & Roles:** Csurf, Express Session  

## 🚀 Getting Started  

### 1️⃣ Clone the Repository  
```sh  
git clone https://github.com/shifamahveen/jobscope.git  
cd jobscope  
```

### 2️⃣ Setup Database Credentials  
```sh  
const mysql = require('mysql2');

const db = mysql  
  .createPool({  
    host: 'localhost',  
    user: 'username',  
    password: 'password',  
    database: 'databasename',  
  })  
  .promise();  

module.exports = db;  
```

### 3️⃣ Setup Database  
```sh  
-- Create the 'jobs' table
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    location VARCHAR(100) NULL,
    salary FLOAT NULL,
    company VARCHAR(100) NULL
);

-- Create the 'applications' table  
CREATE TABLE applications (  
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,  
    jobId VARCHAR(255) NOT NULL,  
    userName VARCHAR(255) NOT NULL,  
    userEmail VARCHAR(255) NOT NULL,  
    phone VARCHAR(15) NOT NULL,  
    gender ENUM('Male', 'Female', 'Other') NOT NULL,  
    graduation FLOAT NOT NULL,  
    createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP  
);

-- Create the 'users' table  
CREATE TABLE users (  
    id INT AUTO_INCREMENT PRIMARY KEY,  
    username VARCHAR(255) NULL,  
    email VARCHAR(255) NOT NULL UNIQUE,  
    password VARCHAR(255) NOT NULL,  
    phone VARCHAR(20) NULL,  
    location VARCHAR(255) NULL,  
    gender VARCHAR(20) NULL,  
    role VARCHAR(20) DEFAULT 'user'  
);

-- Create the 'contacts' table
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4️⃣ Start the Server  
```sh  
node app.js  
```

## 📌 Functionalities  
1. **Fetches jobs from API** and displays them dynamically.
2. **Users can apply for jobs** by submitting an application form.
3. **Admins can view all submitted applications** via a dedicated dashboard.
4. **Secure role-based access** – Only admins can manage applications.
5. **User Profiles** – Users can update personal details for job applications.

🚀 **Start your job search with JobScope today!**

