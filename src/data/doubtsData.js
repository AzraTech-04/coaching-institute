import { students } from "./studentsData";

export const doubtStatuses = ["Open", "In Progress", "Resolved"];
export const doubtPriorities = ["Low", "Medium", "High"];

export const doubts = [
  {
    id: 1,
    studentId: 1,
    student: "Aditi Sharma",
    course: "JEE Advanced",
    batch: "JEE Advanced - Morning",
    subject: "Physics",
    topic: "Projectile Motion",
    question:
      "How do I solve this projectile motion problem? I am getting confused about the angle and horizontal range relation.",
    facultyId: 1,
    faculty: "Dr. Ramesh Iyer",
    priority: "High",
    status: "Open",
    createdDate: "2026-08-18",
    resolution: "",
  },
  {
    id: 2,
    studentId: 2,
    student: "Rohan Verma",
    course: "NEET",
    batch: "NEET Batch A",
    subject: "Biology",
    topic: "Krebs Cycle",
    question:
      "Can you explain the Krebs cycle in a simpler way and help me remember the intermediates clearly?",
    facultyId: 2,
    faculty: "Dr. Kavita Rao",
    priority: "Medium",
    status: "In Progress",
    createdDate: "2026-08-16",
    resolution:
      "Reviewed the cycle step-by-step with mnemonic cues for each intermediate and linked it to ATP production.",
  },
  {
    id: 3,
    studentId: 3,
    student: "Priya Singh",
    course: "JEE Advanced",
    batch: "JEE Advanced - Evening",
    subject: "Mathematics",
    topic: "Integration",
    question:
      "I don't understand this integration step. Why is the substitution method not working here?",
    facultyId: 1,
    faculty: "Dr. Ramesh Iyer",
    priority: "High",
    status: "Resolved",
    createdDate: "2026-08-12",
    resolution:
      "Covered the correct substitution and highlighted how to identify u and du before integrating.",
  },
  {
    id: 4,
    studentId: 5,
    student: "Sneha Gupta",
    course: "NEET",
    batch: "NEET Batch B",
    subject: "Chemistry",
    topic: "Organic Reaction Mechanism",
    question:
      "Why is this organic reaction mechanism different from the previous one? I am confused by the intermediate structure.",
    facultyId: 4,
    faculty: "Ms. Anjali Desai",
    priority: "Medium",
    status: "Open",
    createdDate: "2026-08-20",
    resolution: "",
  },
  {
    id: 5,
    studentId: 4,
    student: "Karan Mehta",
    course: "Foundation - Class 10",
    batch: "Foundation - Class 10",
    subject: "Mathematics",
    topic: "Quadratic Equations",
    question:
      "Please explain this quadratic equation. I am not sure when to use factorization or the formula method.",
    facultyId: 3,
    faculty: "Mr. Sanjay Bhatt",
    priority: "Low",
    status: "Resolved",
    createdDate: "2026-08-15",
    resolution:
      "Explained discriminant-based approach and showed when each method is most efficient.",
  },
];

export const doubtStudentOptions = students.map((student) => ({
  ...student,
  value: student.id,
}));
