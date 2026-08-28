import { batches } from "./batchesData";
import { students } from "./studentsData";
import { faculty } from "./facultyData";

const baseCourses = [
  {
    id: 1,
    name: "JEE Advanced",
    category: "Engineering",
    level: "Class 11-12",
    duration: "2 years",
    subjects: ["Physics", "Chemistry", "Mathematics"],
    status: "Active",
  },
  {
    id: 2,
    name: "JEE Main",
    category: "Engineering",
    level: "Class 11-12",
    duration: "2 years",
    subjects: ["Physics", "Chemistry", "Mathematics"],
    status: "Active",
  },
  {
    id: 3,
    name: "NEET",
    category: "Medical",
    level: "Class 11-12",
    duration: "2 years",
    subjects: ["Physics", "Chemistry", "Biology"],
    status: "Active",
  },
  {
    id: 4,
    name: "Foundation - Class 10",
    category: "Foundation",
    level: "Class 10",
    duration: "1 year",
    subjects: ["Mathematics", "Science", "English"],
    status: "Active",
  },
  {
    id: 5,
    name: "Foundation - Class 9",
    category: "Foundation",
    level: "Class 9",
    duration: "1 year",
    subjects: ["Mathematics", "Science", "English"],
    status: "Inactive",
  },
];

function countBatchesForCourse(courseName) {
  return batches.filter((b) => b.name.startsWith(courseName)).length;
}

function countStudentsForCourse(courseName) {
  return students.filter((s) => s.course === courseName).length;
}

function facultyForCourse(courseName) {
  const names = faculty
    .filter((f) =>
      batches.some((b) => b.facultyId === f.id && b.course === courseName),
    )
    .map((f) => f.name);
  return [...new Set(names)];
}

export const courses = baseCourses.map((course) => ({
  ...course,
  activeBatches: countBatchesForCourse(course.name),
  enrolledStudents: countStudentsForCourse(course.name),
  facultyNames: facultyForCourse(course.name),
}));

export const categoryOptions = ["Engineering", "Medical", "Foundation"];
export const levelOptions = ["Class 9", "Class 10", "Class 11-12"];
