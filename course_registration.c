#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#ifndef _WIN32
#include <strings.h>
#else
int strcasecmp(const char *s1, const char *s2) {
    while (*s1 && *s2) {
        if (tolower(*s1) != tolower(*s2)) {
            return tolower(*s1) - tolower(*s2);
        }
        s1++;
        s2++;
    }
    return tolower(*s1) - tolower(*s2);
}
#endif

#define MAX_COURSES 10
#define MAX_REGISTERED 10
#define MAX_STRING_LENGTH 50
#define MAX_STUDENTS 5

typedef struct {
    char courseCode[MAX_STRING_LENGTH];
    char courseName[MAX_STRING_LENGTH];
    char prerequisite[MAX_STRING_LENGTH];
    int totalSlots;     // total seats for this course
    int filledSlots;    // how many students have registered
} Course;

typedef struct {
    char studentID[MAX_STRING_LENGTH];
    char registeredCourses[MAX_REGISTERED][MAX_STRING_LENGTH];
    int numRegistered;
} Student;

Course courses[MAX_COURSES];
int numCourses = 0;
Student students[MAX_STUDENTS];
int numStudents = 0;
int currentStudentIndex = -1;

void initializeSystem();
void displayMenu();
void viewCourses();
void registerCourse();
void viewRegisteredCourses();
void dropCourse();
int findCourseByCode(char* courseCode);
int isPrerequisiteCompleted(char* prerequisite);
void clearInputBuffer();
void loginOrRegisterStudent();

int main() {
    printf("=== College Course Registration System ===\n\n");

    initializeSystem();

    int choice;

    while (1) {
        if (currentStudentIndex == -1)
            loginOrRegisterStudent();

        displayMenu();
        printf("Enter your choice: ");
        scanf("%d", &choice);
        clearInputBuffer();

        switch (choice) {
            case 1:
                viewCourses();
                break;
            case 2:
                registerCourse();
                break;
            case 3:
                viewRegisteredCourses();
                break;
            case 4:
                dropCourse();
                break;
            case 5:
                printf("Switching student...\n\n");
                currentStudentIndex = -1;
                break;
            case 6:
                printf("Thank you for using the Course Registration System!\n");
                exit(0);
            default:
                printf("Invalid choice! Please enter a number between 1-6.\n\n");
        }
    }
    return 0;
}

void loginOrRegisterStudent() {
    char id[MAX_STRING_LENGTH];
    printf("Enter Student ID: ");
    fgets(id, sizeof(id), stdin);
    id[strcspn(id, "\n")] = 0;

    for (int i = 0; i < numStudents; i++) {
        if (strcasecmp(students[i].studentID, id) == 0) {
            currentStudentIndex = i;
            printf("Welcome back, Student %s!\n\n", id);
            return;
        }
    }

    if (numStudents < MAX_STUDENTS) {
        strcpy(students[numStudents].studentID, id);
        students[numStudents].numRegistered = 0;
        currentStudentIndex = numStudents;
        numStudents++;
        printf("New student '%s' added!\n\n", id);
    } else {
        printf("Maximum number of students reached!\n");
    }
}

void initializeSystem() {
    strcpy(courses[0].courseCode, "CS101");
    strcpy(courses[0].courseName, "Introduction to Programming");
    strcpy(courses[0].prerequisite, "");
    courses[0].totalSlots = 3;
    courses[0].filledSlots = 0;
    numCourses++;

    strcpy(courses[1].courseCode, "CS102");
    strcpy(courses[1].courseName, "Data Structures");
    strcpy(courses[1].prerequisite, "CS101");
    courses[1].totalSlots = 2;
    courses[1].filledSlots = 0;
    numCourses++;

    strcpy(courses[2].courseCode, "CS201");
    strcpy(courses[2].courseName, "Algorithms");
    strcpy(courses[2].prerequisite, "CS102");
    courses[2].totalSlots = 2;
    courses[2].filledSlots = 0;
    numCourses++;

    strcpy(courses[3].courseCode, "MATH101");
    strcpy(courses[3].courseName, "Calculus I");
    strcpy(courses[3].prerequisite, "");
    courses[3].totalSlots = 3;
    courses[3].filledSlots = 0;
    numCourses++;

    strcpy(courses[4].courseCode, "MATH102");
    strcpy(courses[4].courseName, "Calculus II");
    strcpy(courses[4].prerequisite, "MATH101");
    courses[4].totalSlots = 2;
    courses[4].filledSlots = 0;
    numCourses++;

    printf("System initialized with %d courses and slot limits.\n\n", numCourses);
}

void displayMenu() {
    printf("==========================================\n");
    printf("Student ID: %s\n", students[currentStudentIndex].studentID);
    printf("==========================================\n");
    printf("1. View all available courses\n");
    printf("2. Register for a course\n");
    printf("3. View registered courses\n");
    printf("4. Drop a course\n");
    printf("5. Switch student\n");
    printf("6. Exit\n");
    printf("==========================================\n");
}

void viewCourses() {
    printf("\n=== AVAILABLE COURSES ===\n");

    if (numCourses == 0) {
        printf("No courses available.\n\n");
        return;
    }

    printf("%-10s %-30s %-15s %-10s\n", "Code", "Course Name", "Prerequisite", "Slots");
    printf("-----------------------------------------------------------------\n");

    for (int i = 0; i < numCourses; i++) {
        printf("%-10s %-30s %-15s %d/%d\n",
               courses[i].courseCode,
               courses[i].courseName,
               strlen(courses[i].prerequisite) > 0 ? courses[i].prerequisite : "None",
               courses[i].filledSlots, courses[i].totalSlots);
    }
    printf("\n");
}

void registerCourse() {
    char courseCode[MAX_STRING_LENGTH];
    Student* s = &students[currentStudentIndex];

    printf("\n=== REGISTER FOR A COURSE ===\n");

    if (s->numRegistered >= MAX_REGISTERED) {
        printf("You have reached the maximum number of registered courses (%d)!\n\n", MAX_REGISTERED);
        return;
    }

    printf("Enter course code to register: ");
    fgets(courseCode, sizeof(courseCode), stdin);
    courseCode[strcspn(courseCode, "\n")] = 0;

    int courseIndex = findCourseByCode(courseCode);
    if (courseIndex == -1) {
        printf("Course '%s' not found!\n\n", courseCode);
        return;
    }

    for (int i = 0; i < s->numRegistered; i++) {
        if (strcasecmp(s->registeredCourses[i], courseCode) == 0) {
            printf("You are already registered for course '%s'!\n\n", courseCode);
            return;
        }
    }

    if (courses[courseIndex].filledSlots >= courses[courseIndex].totalSlots) {
        printf("Sorry, '%s' is full. No slots left!\n\n", courseCode);
        return;
    }

    if (strlen(courses[courseIndex].prerequisite) > 0) {
        if (!isPrerequisiteCompleted(courses[courseIndex].prerequisite)) {
            printf("Prerequisite not completed! You need to complete '%s' first.\n\n",
                   courses[courseIndex].prerequisite);
            return;
        }
    }

    strcpy(s->registeredCourses[s->numRegistered], courseCode);
    s->numRegistered++;
    courses[courseIndex].filledSlots++;

    printf("Course '%s' added successfully for Student %s!\n\n",
           courseCode, s->studentID);
}

void viewRegisteredCourses() {
    Student* s = &students[currentStudentIndex];

    printf("\n=== YOUR REGISTERED COURSES ===\n");

    if (s->numRegistered == 0) {
        printf("You are not registered for any courses.\n\n");
        return;
    }

    printf("%-10s %-30s\n", "Code", "Course Name");
    printf("----------------------------------------\n");

    for (int i = 0; i < s->numRegistered; i++) {
        int courseIndex = findCourseByCode(s->registeredCourses[i]);
        if (courseIndex != -1) {
            printf("%-10s %-30s\n",
                   courses[courseIndex].courseCode,
                   courses[courseIndex].courseName);
        }
    }
    printf("\n");
}

void dropCourse() {
    char courseCode[MAX_STRING_LENGTH];
    Student* s = &students[currentStudentIndex];

    printf("\n=== DROP A COURSE ===\n");

    if (s->numRegistered == 0) {
        printf("You are not registered for any courses.\n\n");
        return;
    }

    printf("Enter course code to drop: ");
    fgets(courseCode, sizeof(courseCode), stdin);
    courseCode[strcspn(courseCode, "\n")] = 0;

    int foundIndex = -1;
    for (int i = 0; i < s->numRegistered; i++) {
        if (strcasecmp(s->registeredCourses[i], courseCode) == 0) {
            foundIndex = i;
            break;
        }
    }

    if (foundIndex == -1) {
        printf("You are not registered for course '%s'!\n\n", courseCode);
        return;
    }

    for (int i = foundIndex; i < s->numRegistered - 1; i++) {
        strcpy(s->registeredCourses[i], s->registeredCourses[i + 1]);
    }
    s->numRegistered--;

    int courseIndex = findCourseByCode(courseCode);
    if (courseIndex != -1 && courses[courseIndex].filledSlots > 0)
        courses[courseIndex].filledSlots--;

    printf("Course '%s' dropped successfully for Student %s!\n\n",
           courseCode, s->studentID);
}

int findCourseByCode(char* courseCode) {
    for (int i = 0; i < numCourses; i++) {
        if (strcasecmp(courses[i].courseCode, courseCode) == 0) {
            return i;
        }
    }
    return -1;
}

int isPrerequisiteCompleted(char* prerequisite) {
    Student* s = &students[currentStudentIndex];
    for (int i = 0; i < s->numRegistered; i++) {
        if (strcasecmp(s->registeredCourses[i], prerequisite) == 0) {
            return 1;
        }
    }
    return 0;
}

void clearInputBuffer() {
    int c;
    while ((c = getchar()) != '\n' && c != EOF);
}
