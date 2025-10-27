🎓 College Course Registration System (C Language)
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

A menu-driven course registration system written in C, designed to help students view, register, and manage their courses with automatic prerequisite validation and student data consistency.
Built as a DSA-based academic project, it focuses on practical application of data structures and structured programming concepts.

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

🧾 Features
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
📋 View Available Courses with details and prerequisites

🧑‍🎓 Student Management (unique ID, name, department, email)

🧠 Prerequisite Checking — prevents invalid registrations

✅ Register / Drop Courses dynamically

🔍 View Registered Courses per student

🧩 Data Validation — same ID can’t have multiple student profiles

🔡 Case-Insensitive Input (CS101 = cs101)

💬 Interactive CLI Menu for easy navigation
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
📘 Sample Courses (Web Version)
| Code     | Course Name               | Prerequisite |
|-----------|---------------------------|---------------|
| CS101     | Introduction to Programming | None |
| CS102     | Data Structures           | CS101 |
| CS201     | Algorithms                | CS102 |
| MATH101   | Calculus I                | None |
| MATH102   | Calculus II               | MATH101 |
| CS103     | Database Systems          | CS101 |
| CS202     | Operating Systems         | CS102 |
| PHYS101   | Physics I                 | None |
| IT201     | Web Technologies          | CS101 |
| IT202     | Computer Networks         | CS102 |
| ECE301    |Digital Electronics        | PHYS101 |
| ME201     |Thermodynamics             | PHYS101 |
| CE201     |Structural Analysis        | MATH101 |
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

🧠 DSA Concepts Covered
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

This project demonstrates several key Data Structures and Algorithms (DSA) concepts in a practical way:

🧱 Arrays — for managing lists of students and courses

🧩 Structures (struct) — to organize student and course data

🔁 Loops & Conditionals — for menu navigation and logic control

🔍 String Handling — validation using strcmp() and strcpy()

⚙️ Modular Functions — clean, reusable design

💡 Input Validation — ensures robust and user-safe interaction

⚙️ How to Compile and Run
🔧 Using Makefile (Recommended)
# Compile
make

# Run
make run

# Clean up
make clean

🖥️ Manual Compilation
gcc -Wall -Wextra -std=c99 -g -o course_registration course_registration.c
./course_registration
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

🏗️ Project Structure
📂 CollegeCourseRegistration
 ┣ 📜 course_registration.c   # Main program file
 ┣ 📜 Makefile                # Build automation
 ┣ 📜 README.md               # Documentation

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
🎯 Educational Value
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
This project is ideal for:

💻 Students learning Data Structures in C

🧩 Understanding real-world use of structs, arrays, and string ops

🧠 Practicing menu-driven programming and modularity

📚 Developing a foundation for database-backed systems
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

👨‍💻 Author

Mrunal Warange
📧 <a href="mailto:mrunalw068@gmail.com">mrunalw068@gmail.com</a>

💻 GitHub Profile
[MrunalWarange](https://github.com/MrunalWarange)
