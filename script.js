// Course and Student data structures
const BASE_SLOTS_PER_STUDENT = 10; // each student gets 10 slots



const courses = [
    {
        courseCode: "CS101",
        courseName: "Introduction to Programming",
        prerequisite: "",
        description: "Learn the fundamentals of programming using simple examples and problem-solving techniques. This course covers basic syntax, control structures, functions, and an introduction to algorithms using languages like C or Python."
    },
    {
        courseCode: "CS102",
        courseName: "Data Structures",
        prerequisite: "CS101",
        description: "Understand how data is stored and organized efficiently. Topics include arrays, linked lists, stacks, queues, trees, graphs, and hash tables. Students will learn how to implement and analyze these structures for real-world applications."
    },
    {
        courseCode: "CS201",
        courseName: "Algorithms",
        prerequisite: "CS102",
        description: "Dive into algorithm design and analysis. Learn sorting, searching, recursion, dynamic programming, and graph algorithms. Emphasis is on efficiency, optimization, and problem-solving strategies."
    },
    {
        courseCode: "MATH101",
        courseName: "Calculus I",
        prerequisite: "",
        description: "Build a strong mathematical foundation with limits, derivatives, and basic integration. This course helps students understand rates of change and motion — essential for science and engineering fields."
    },
    {
        courseCode: "MATH102",
        courseName: "Calculus II",
        prerequisite: "MATH101",
        description: "A continuation of Calculus I, focusing on advanced integration techniques, sequences, series, and applications of calculus in solving complex problems."
    },
    {
        courseCode: "CS103",
        courseName: "Database Systems",
        prerequisite: "CS101",
        description: "Explore how data is stored, retrieved, and managed. Learn about relational databases, SQL, normalization, and database design principles. Students will also get hands-on experience with basic queries and database creation."
    },
    {
        courseCode: "CS202",
        courseName: "Operating Systems",
        prerequisite: "CS102",
        description: "Understand how computer systems work under the hood. This course covers process management, memory handling, file systems, and scheduling. Students gain insight into how software interacts with hardware."
    },
    {
        courseCode: "PHYS101",
        courseName: "Physics I",
        prerequisite: "",
        description: "An introduction to classical physics covering motion, forces, energy, and basic mechanics. Designed to strengthen scientific reasoning and problem-solving skills applicable to technology and engineering."
    },
    {
        courseCode: "IT201",
        courseName: "Web Technologies",
        prerequisite: "CS101",
        description: "Learn front-end and back-end web development technologies, including HTML, CSS, JavaScript, and server-side frameworks. Students will build interactive web applications and understand how the web works end-to-end."
    },
    {
        courseCode: "ECE301",
        courseName: "Digital Electronics",
        prerequisite: "PHYS101",
        description: "Covers logic gates, combinational and sequential circuits, flip-flops, and digital system design. Students gain hands-on experience building and testing simple digital systems using simulation tools."
    },
    {
        courseCode: "ME201",
        courseName: "Thermodynamics",
        prerequisite: "PHYS101",
        description: "Focuses on the principles of energy, heat, and work. Topics include the first and second laws of thermodynamics, energy conversion, and real-world applications in mechanical systems."
    },
    {
        courseCode: "CE201",
        courseName: "Structural Analysis",
        prerequisite: "MATH101",
        description: "Introduces the fundamentals of analyzing and designing structural systems. Students learn to calculate forces, moments, and stresses in beams and frames using classical methods."
    },
    {
        courseCode: "IT202",
        courseName: "Computer Networks",
        prerequisite: "CS102",
        description: "Explores the architecture and protocols of computer networks. Covers topics such as TCP/IP, routing, network security, and data transmission, with practical insights into modern networking systems."
    }
];

// Course dependency mapping (used for cascading drops)
const courseDependencies = {
    "CS101": ["CS102", "CS103", "CS201", "IT201"],
    "CS102": ["CS201", "CS202", "IT202"],
    "MATH101": ["MATH102", "CE201"],
    "PHYS101": ["ECE301", "ME201"],
    "CS103": [],
    "CS201": [],
    "CS202": [],
    "IT201": [],
    "IT202": [],
    "ECE301": [],
    "ME201": [],
    "CE201": []
};


let registeredCourses = [];
let studentRegistrations = [];
let uniqueStudentIds = new Set(); // track unique students
let totalSlots = 10; // total capacity for all courses
let registeredCoursesCount = 0; // courses currently registered


// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
    displayCourses();
    populateCourseDropdown();
    populateCourseCheckboxes();
    updateStats();
    showSection('view-courses');
});

// Show specific section
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
    }
    
    // Update content based on section
    if (sectionId === 'my-courses') {
        displayRegisteredCourses();
    } else if (sectionId === 'drop-course') {
        populateDropCourseDropdown();
    }
    
    // Clear message boxes
    clearMessages();
}

// Display all available courses
function displayCourses() {
    const coursesGrid = document.getElementById('courses-grid');
    coursesGrid.innerHTML = '';
    
    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.onclick = () => openModal(course.courseCode);
        
        const prerequisiteDisplay = course.prerequisite 
            ? `<span class="prerequisite-tag">Prerequisite: ${course.prerequisite}</span>`
            : `<span class="prerequisite-tag no-prereq">No Prerequisites</span>`;
        
        courseCard.innerHTML = `
            <div class="course-code">${course.courseCode}</div>
            <div class="course-name">${course.courseName}</div>
            <div class="course-prerequisite">
                ${prerequisiteDisplay}
            </div>
        `;
        
        coursesGrid.appendChild(courseCard);
    });
}

// Populate course dropdown for registration
function populateCourseDropdown() {
    const dropdown = document.getElementById('register-code');
    
    if (!dropdown) return; // Check if element exists
    
    // Clear existing options except the first one
    dropdown.innerHTML = '<option value="">-- Choose a course --</option>';
    
    // Add all courses to dropdown
    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.courseCode;
        
        // Show prerequisite info in the option text
        const prereqText = course.prerequisite 
            ? ` (Prerequisite: ${course.prerequisite})` 
            : '';
        
        option.textContent = `${course.courseCode} - ${course.courseName}${prereqText}`;
        dropdown.appendChild(option);
    });
}

// Populate course checkboxes for registration form
function populateCourseCheckboxes() {
    const container = document.getElementById('course-checkboxes');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    courses.forEach((course, index) => {
        const checkboxItem = document.createElement('div');
        checkboxItem.className = 'course-checkbox-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `course-checkbox-${index}`;
        checkbox.value = course.courseCode;
        checkbox.name = 'courses';
        
        const label = document.createElement('label');
        label.htmlFor = `course-checkbox-${index}`;
        label.className = 'course-checkbox-label';
        
        const prereqTag = course.prerequisite 
            ? `<span class="course-checkbox-prereq-tag">Prerequisite: ${course.prerequisite}</span>`
            : `<span class="course-checkbox-prereq-tag course-checkbox-prereq-none">No Prerequisites</span>`;
        
        label.innerHTML = `
            <div class="course-checkbox-name">
                <span class="course-checkbox-code">${course.courseCode}</span>
                ${course.courseName}
            </div>
            <div class="course-checkbox-prereq">
                ${prereqTag}
            </div>
        `;
        
        // Add click handler to toggle checked class
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                checkboxItem.classList.add('checked');
            } else {
                checkboxItem.classList.remove('checked');
            }
        });
        
        // Make the whole item clickable
        checkboxItem.addEventListener('click', function(e) {
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));
            }
        });
        
        checkboxItem.appendChild(checkbox);
        checkboxItem.appendChild(label);
        container.appendChild(checkboxItem);
    });
}

// Populate dropdown for dropping courses (only registered courses)
function populateDropCourseDropdown() {
    const dropdown = document.getElementById('drop-code');
    const studentId = document.getElementById('drop-student-id')?.value.trim();

    if (!dropdown) return;
    dropdown.innerHTML = '<option value="">-- Choose a course --</option>';

    if (!studentId) {
        const option = document.createElement('option');
        option.textContent = "Enter Student ID to view your courses";
        option.disabled = true;
        dropdown.appendChild(option);
        return;
    }

    const studentCourses = studentRegistrations.filter(reg => reg.studentId === studentId);

    if (studentCourses.length === 0) {
        const option = document.createElement('option');
        option.textContent = "No registered courses";
        option.disabled = true;
        dropdown.appendChild(option);
        return;
    }

    studentCourses.forEach(reg => {
        const opt = document.createElement('option');
        opt.value = reg.courseCode;
        opt.textContent = `${reg.courseCode} - ${reg.courseName}`;
        dropdown.appendChild(opt);
    });
}


// Handle course registration form submission
function handleCourseRegistration(event) {
    event.preventDefault();
    
    const messageBox = document.getElementById('register-message');
    messageBox.classList.remove('show', 'success', 'error');
    
    // Get form values
    const studentName = document.getElementById("student-name").value.trim();
    const studentId = document.getElementById("student-id").value.trim();
    const studentEmail = document.getElementById("student-email").value.trim();
    const department = document.getElementById("student-department").value;

   // 🔍 Check if Student ID already exists with different details
    const existingStudent = studentRegistrations.find(
        reg => reg.studentId === studentId
    );

    if (existingStudent) {
        if (
            existingStudent.studentName !== studentName ||
            existingStudent.email !== studentEmail ||
            existingStudent.department !== department
        ) {
            showToast(`⚠️ Mismatch detected! Student ID ${studentId} already belongs to another record.
    Make sure Name, Email, and Department match the existing details.`);
            return;
        }
    }

    // Track unique student IDs to expand total slots dynamically
    if (!uniqueStudentIds.has(studentId)) {
    uniqueStudentIds.add(studentId);
    saveToLocalStorage(); // save new student ID set
    }

    
    // Get selected courses from checkboxes
    const selectedCheckboxes = document.querySelectorAll('input[name="courses"]:checked');
    const selectedCourses = Array.from(selectedCheckboxes).map(cb => cb.value);
    
    // Validate all fields are filled
    if (!studentName || !studentId || !studentEmail || !department) {
        showMessage(messageBox, 'Please fill in all required fields!', 'error');
        return;
    }
    
    // Validate at least one course is selected
    if (selectedCourses.length === 0) {
        showMessage(messageBox, 'Please select at least one course!', 'error');
        return;
    }
    
    // Compute dynamic max courses based on number of unique students
    const maxAllowed = BASE_SLOTS_PER_STUDENT * Math.max(1, uniqueStudentIds.size || 1);
    const newTotalRegistrations = studentRegistrations.length + selectedCourses.length;

    if (newTotalRegistrations > maxAllowed) {
        const available = maxAllowed - studentRegistrations.length;
        showMessage(
            messageBox,
            `⚠️ Cannot register for ${selectedCourses.length} courses. Only ${available} slot(s) available out of ${maxAllowed}!`,
            'error'
        );
        return;
    }
    
    // Track successful and skipped registrations
    let successCount = 0;
    let skippedCourses = [];
    
    // Process each selected course
    selectedCourses.forEach(courseCode => {
        // Find the course
        const course = findCourseByCode(courseCode);
        if (!course) {
            skippedCourses.push(courseCode + ' (not found)');
            return;
        }
        
        // Check if student already registered for this course
        const alreadyRegistered = studentRegistrations.some(reg => 
            reg.studentId === studentId && reg.courseCode === courseCode
        );
        
        if (alreadyRegistered) {
            skippedCourses.push(courseCode + ' (already registered)');
            return;
        }
        
        // Create registration object
        const registration = {
            id: Date.now() + Math.random(), // Ensure unique IDs for multiple courses
            studentName,
            studentId,
            studentEmail,
            department,
            courseCode,
            courseName: course.courseName,
            registrationDate: new Date().toLocaleDateString()
        };
        
        // Add to registrations array
        studentRegistrations.push(registration);
        
        // Update registeredCourses for stats
        if (!registeredCourses.includes(courseCode)) {
            registeredCourses.push(courseCode);
        }
        
        successCount++;
    });
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Show appropriate message
    let message = '';
    if (successCount > 0 && skippedCourses.length === 0) {
        message = `✅ Successfully registered for ${successCount} course(s)!`;
        showMessage(messageBox, message, 'success');
        showToast(`✅ ${studentName} registered for ${successCount} course(s)!`);
        
        // Reset form
        document.getElementById('course-registration-form').reset();
        populateCourseCheckboxes(); // Refresh checkboxes to clear selections
    } else if (successCount > 0 && skippedCourses.length > 0) {
        message = `✅ Registered for ${successCount} course(s). Skipped: ${skippedCourses.join(', ')}`;
        showMessage(messageBox, message, 'success');
        showToast(`✅ ${studentName} registered for ${successCount} course(s)!`);
    } else {
        message = `❌ No courses registered. Skipped: ${skippedCourses.join(', ')}`;
        showMessage(messageBox, message, 'error');
    }
    
    // Update stats
    updateStats(studentId);

    
    // Update drop course dropdown
    populateDropCourseDropdown();
}

// Drop a course
function dropCourse() {
    const studentId = document.getElementById('drop-student-id')?.value.trim();
    const courseCode = document.getElementById('drop-code')?.value.trim().toUpperCase();
    const messageBox = document.getElementById('drop-message');

    messageBox.classList.remove('show', 'success', 'error');

    if (!studentId) {
        showMessage(messageBox, 'Please enter your Student ID!', 'error');
        return;
    }

    if (!courseCode) {
        showMessage(messageBox, 'Please select a course to drop!', 'error');
        return;
    }

    // Recursive function to find all dependent courses
    const getDependentCourses = (code, collected = new Set()) => {
        if (courseDependencies[code]) {
            for (const dep of courseDependencies[code]) {
                collected.add(dep);
                getDependentCourses(dep, collected);
            }
        }
        return collected;
    };

    const toDrop = [courseCode, ...getDependentCourses(courseCode)];

    // Filter out all matching registrations for this student
    const beforeCount = studentRegistrations.length;
    studentRegistrations = studentRegistrations.filter(
        reg => !(reg.studentId === studentId && toDrop.includes(reg.courseCode))
    );
    const afterCount = studentRegistrations.length;
    const droppedCount = beforeCount - afterCount;

    if (droppedCount === 0) {
        showMessage(messageBox, `No matching registrations found for ${studentId} in ${courseCode}`, 'error');
        return;
    }

    // Save and update
    saveToLocalStorage();
    displayRegisteredCourses();
    populateDropCourseDropdown();
    updateStats(studentId);

    showMessage(messageBox, `🗑️ Dropped ${droppedCount} course(s): ${toDrop.join(", ")}`, 'success');
    showToast(`🗑️ ${studentId} dropped ${toDrop.join(", ")}`);
}

// Drop all courses for a given student, including dependent ones
function dropAllCourses() {
    const studentId = prompt("Enter your Student ID to drop all your courses:");
    if (!studentId) {
        alert("Please enter a valid Student ID!");
        return;
    }

    // Find all courses the student is registered for
    const studentCourses = studentRegistrations.filter(reg => reg.studentId === studentId);

    if (studentCourses.length === 0) {
        showToast(`⚠️ No courses found for Student ID: ${studentId}`);
        return;
    }

    // Collect all course codes to drop
    let coursesToDrop = studentCourses.map(reg => reg.courseCode);

    // Check for dependencies (if dropping a prerequisite)
    studentCourses.forEach(reg => {
        const course = courses.find(c => c.code === reg.courseCode);
        if (course) {
            // Find all courses depending on this one
            const dependentCourses = courses
                .filter(c => c.prerequisite === course.code)
                .map(c => c.code);
            coursesToDrop.push(...dependentCourses);
        }
    });

    // Remove duplicates
    coursesToDrop = [...new Set(coursesToDrop)];

    // Filter out all of this student’s dropped courses
    studentRegistrations = studentRegistrations.filter(
        reg => !(reg.studentId === studentId && coursesToDrop.includes(reg.courseCode))
    );

    // Save and update
    saveToLocalStorage();
    displayRegisteredCourses();
    populateDropCourseDropdown();
    updateStats(studentId);

    showToast(`🗑️ All ${coursesToDrop.length} courses dropped for Student ID: ${studentId}`);
}

// Display registered courses in table format
function displayRegisteredCourses() {
    const container = document.getElementById('registered-courses-container');
    const actionsDiv = document.getElementById('table-actions');
    
    if (studentRegistrations.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📚</div>
                <h3>No Courses Registered</h3>
                <p>Start by registering for courses to build your schedule!</p>
            </div>
        `;
        actionsDiv.style.display = 'none';
        return;
    }
    
    // Show actions
    actionsDiv.style.display = 'flex';

    // --- 🧩 Group courses by student and registration date ---
    const grouped = {};

    studentRegistrations.forEach(reg => {
        const key = `${reg.studentId}_${reg.registrationDate}`;
        if (!grouped[key]) {
            grouped[key] = {
                studentName: reg.studentName,
                studentId: reg.studentId,
                department: reg.department,
                registrationDate: reg.registrationDate,
                courses: []
            };
        }
        grouped[key].courses.push(`${reg.courseCode} (${reg.courseName})`);
    });

    // --- 🧾 Sort by latest registration date first ---
    const sorted = Object.values(grouped).sort((a, b) => {
        const dateA = new Date(a.registrationDate);
        const dateB = new Date(b.registrationDate);
        return dateB - dateA; // latest first
    });

    // --- 🧱 Build the table ---
    let tableHTML = `
        <div class="courses-table">
            <table>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Student ID</th>
                        <th>Department</th>
                        <th>Courses Registered</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
    `;

    sorted.forEach(item => {
        tableHTML += `
            <tr>
                <td>${item.studentName}</td>
                <td><strong>${item.studentId}</strong></td>
                <td><span class="department-badge">${item.department}</span></td>
                <td>${item.courses.map(course => {
                    const code = course.split(" ")[0]; // extracts course code
                    return `<span class="course-code-tag" title="${course}">${code}</span>`;
                    }).join(" ")}
                </td>
                <td>${item.registrationDate}</td>
            </tr>
        `;
    });

    tableHTML += `
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = tableHTML;
}

// Helper function to find a course by code (case-insensitive)
function findCourseByCode(courseCode) {
    return courses.find(course => 
        course.courseCode.toUpperCase() === courseCode.toUpperCase()
    );
}

// Helper function to check if already registered (case-insensitive)
function isAlreadyRegistered(courseCode) {
    return registeredCourses.some(code => 
        code.toUpperCase() === courseCode.toUpperCase()
    );
}

// Helper function to check if prerequisite is completed (case-insensitive)
function isPrerequisiteCompleted(prerequisite) {
    return registeredCourses.some(code => 
        code.toUpperCase() === prerequisite.toUpperCase()
    );
}

// Show message in message box
function showMessage(messageBox, message, type) {
    messageBox.textContent = message;
    messageBox.classList.add('show', type);
}

// Clear all message boxes
function clearMessages() {
    const messageBoxes = document.querySelectorAll('.message-box');
    messageBoxes.forEach(box => {
        box.classList.remove('show', 'success', 'error');
    });
}

// Update statistics
function updateStats(currentStudentId = null) {
    // Determine total and used slots for the current student
    const studentId = currentStudentId || document.getElementById('student-id')?.value.trim();

    // If no student ID entered yet, just show defaults
    if (!studentId) {
        document.getElementById('course-count').textContent = 0;
        document.getElementById('slots-remaining').textContent = BASE_SLOTS_PER_STUDENT;
        document.getElementById('max-slots').textContent = BASE_SLOTS_PER_STUDENT;
        return;
    }

    // Count how many courses this specific student registered
    const studentCourses = studentRegistrations.filter(reg => reg.studentId === studentId);
    const registeredCount = studentCourses.length;
    const availableSlots = BASE_SLOTS_PER_STUDENT - registeredCount;

    // Update the UI
    document.getElementById('course-count').textContent = registeredCount;
    document.getElementById('slots-remaining').textContent = availableSlots >= 0 ? availableSlots : 0;
    document.getElementById('max-slots').textContent = BASE_SLOTS_PER_STUDENT;

    // Animate slot number change
    const slotsEl = document.getElementById('slots-remaining');
    slotsEl.classList.add('highlight');
    setTimeout(() => slotsEl.classList.remove('highlight'), 500);
}


// function updateSlotDisplay() {
//     // Get counts
//     const totalSlots = 10; // total available per student
//     const registered = studentRegistrations ? studentRegistrations.length : 0;
//     const available = totalSlots - registered;

//     // Update the DOM
//     document.getElementById('course-count').textContent = registered;
//     document.getElementById('slots-remaining').textContent = available;
//     document.getElementById('max-slots').textContent = totalSlots;

//     // Highlight animation (optional)
//     const slotsEl = document.getElementById('slots-remaining');
//     slotsEl.classList.add('highlight');
//     setTimeout(() => slotsEl.classList.remove('highlight'), 500);
// }



// LocalStorage functions
function saveToLocalStorage() {
    localStorage.setItem('studentRegistrations', JSON.stringify(studentRegistrations));
    localStorage.setItem('registeredCourses', JSON.stringify(registeredCourses));
    localStorage.setItem('uniqueStudentIds', JSON.stringify(Array.from(uniqueStudentIds)));
}

function loadFromLocalStorage() {
    const savedRegistrations = localStorage.getItem('studentRegistrations');
    const savedCourses = localStorage.getItem('registeredCourses');
    const savedIds = localStorage.getItem('uniqueStudentIds');
    
    if (savedRegistrations) studentRegistrations = JSON.parse(savedRegistrations);
    if (savedCourses) registeredCourses = JSON.parse(savedCourses);
    if (savedIds) uniqueStudentIds = new Set(JSON.parse(savedIds));
}

function clearAllRegistrations() {
    const confirmed = confirm('Are you sure you want to clear all registrations? This action cannot be undone.');
    
    if (!confirmed) return;
    
    // Clear arrays
    studentRegistrations = [];
    registeredCourses = [];
    
    // Clear localStorage
    localStorage.removeItem('studentRegistrations');
    localStorage.removeItem('registeredCourses');
    
    // Update display
    displayRegisteredCourses();
    updateStats();
    populateDropCourseDropdown();
    
    showToast('🗑️ All registrations cleared successfully!');
}

// Show toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Handle Enter key press in input fields and dropdowns
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        if (e.target.id === 'register-code') {
            registerCourse();
        } else if (e.target.id === 'drop-code') {
            dropCourse();
        }
    }
});

// Handle dropdown change for better UX
document.addEventListener('change', function(e) {
    if (e.target.id === 'register-code' || e.target.id === 'drop-code') {
        // Clear any previous messages when user selects a different course
        clearMessages();
    }
});

// Modal functionality
let currentModalCourse = null;

function openModal(courseCode) {
    const course = findCourseByCode(courseCode);
    if (!course) return;
    
    currentModalCourse = courseCode;
    
    // Populate modal content
    document.getElementById('modal-course-code').textContent = course.courseCode;
    document.getElementById('modal-title').textContent = course.courseName;
    document.getElementById('modal-description').textContent = course.description;
    
    const prerequisiteElement = document.getElementById('modal-prerequisite');
    if (course.prerequisite) {
        prerequisiteElement.textContent = course.prerequisite;
        prerequisiteElement.className = 'modal-prerequisite has-prereq';
    } else {
        prerequisiteElement.textContent = 'None - You can register directly';
        prerequisiteElement.className = 'modal-prerequisite no-prereq';
    }
    
    // Show modal
    const modal = document.getElementById('course-modal');
    modal.classList.add('show');
    document.body.classList.add('modal-open');
}

function closeModal() {
    const modal = document.getElementById('course-modal');
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
    currentModalCourse = null;
}

function registerFromModal() {
    if (!currentModalCourse) return;
    
    // Close modal
    closeModal();
    
    // Switch to register section
    showSection('register-course');
    
    // Pre-select the course in dropdown
    const dropdown = document.getElementById('register-code');
    dropdown.value = currentModalCourse;
    
    // Highlight the dropdown briefly
    dropdown.focus();
    dropdown.style.borderColor = 'var(--primary-color)';
    dropdown.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.2)';
    
    setTimeout(() => {
        dropdown.style.borderColor = '';
        dropdown.style.boxShadow = '';
    }, 2000);
    
    // Show a helpful message
    showToast(`📚 ${currentModalCourse} selected. Click "Register Course" to enroll!`);
}

// Close modal on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});
document.getElementById('drop-student-id')?.addEventListener('input', populateDropCourseDropdown);

// 👇 Auto-update stats when Student ID changes
document.addEventListener("DOMContentLoaded", () => {
    const studentIdInput = document.getElementById("student-id");
    if (studentIdInput) {
        studentIdInput.addEventListener("input", () => {
            const id = studentIdInput.value.trim();
            updateStats(id);
        });
    }
});


