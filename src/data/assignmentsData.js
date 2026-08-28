const submissionStatus = (studentId, submittedIds = []) =>
  submittedIds.includes(studentId) ? "Submitted" : "Pending";

const buildSubmissions = (studentIds, submittedIds = []) =>
  studentIds.map((studentId) => ({
    studentId,
    status: submissionStatus(studentId, submittedIds),
  }));

export const assignments = [
  {
    id: 1,
    title: "Physics Numerical Practice",
    course: "JEE Advanced",
    batch: "JEE Advanced - Morning",
    subject: "Physics",
    facultyId: 1,
    faculty: "Dr. Ramesh Iyer",
    assignedDate: "2026-08-10",
    dueDate: "2026-08-12",
    totalMarks: 50,
    instructions:
      "Solve all numerical problems from chapters 1 to 4. Show complete working for each derivation.",
    status: "Active",
    submissions: buildSubmissions([1, 6], [1]),
  },
  {
    id: 2,
    title: "Organic Chemistry Worksheet",
    course: "NEET",
    batch: "NEET Batch A",
    subject: "Chemistry",
    facultyId: 2,
    faculty: "Dr. Kavita Rao",
    assignedDate: "2026-08-11",
    dueDate: "2026-08-15",
    totalMarks: 40,
    instructions:
      "Complete the reaction mechanism worksheet and revise the named reactions thoroughly.",
    status: "Pending",
    submissions: buildSubmissions([2], [2]),
  },
  {
    id: 3,
    title: "Calculus Problem Set",
    course: "JEE Advanced",
    batch: "JEE Advanced - Evening",
    subject: "Mathematics",
    facultyId: 1,
    faculty: "Dr. Ramesh Iyer",
    assignedDate: "2026-08-13",
    dueDate: "2026-08-18",
    totalMarks: 60,
    instructions:
      "Attempt all derivative and integration questions. Submit neatly with steps and final answers.",
    status: "Active",
    submissions: buildSubmissions([3], []),
  },
  {
    id: 4,
    title: "Biology Human Physiology Assignment",
    course: "NEET",
    batch: "NEET Batch B",
    subject: "Biology",
    facultyId: 2,
    faculty: "Dr. Kavita Rao",
    assignedDate: "2026-08-14",
    dueDate: "2026-08-19",
    totalMarks: 45,
    instructions:
      "Prepare a concise assignment on the digestive and respiratory systems with diagrams where needed.",
    status: "Completed",
    submissions: buildSubmissions([5], [5]),
  },
  {
    id: 5,
    title: "Foundation Science Chapter Practice",
    course: "Foundation - Class 10",
    batch: "Foundation - Class 10",
    subject: "Science",
    facultyId: 3,
    faculty: "Mr. Sanjay Bhatt",
    assignedDate: "2026-08-16",
    dueDate: "2026-08-21",
    totalMarks: 30,
    instructions:
      "Revise the chapter summaries and answer the short answer practice questions in the workbook.",
    status: "Draft",
    submissions: buildSubmissions([4], []),
  },
];

export const assignmentStatuses = ["Draft", "Active", "Pending", "Completed"];
