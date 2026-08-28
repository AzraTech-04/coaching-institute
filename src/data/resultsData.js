export const resultDocuments = [
  { name: "Result Sheet", submitted: true },
  { name: "Answer Key", submitted: true },
  { name: "Performance Report", submitted: false },
];

export const results = [
  {
    id: "result-1-1",
    testId: 1,
    studentId: 1,
    marksObtained: 91,
    totalMarks: 100,
    status: "Pass",
  },
  {
    id: "result-1-6",
    testId: 1,
    studentId: 6,
    marksObtained: 42,
    totalMarks: 100,
    status: "Pass",
  },
  {
    id: "result-3-2",
    testId: 3,
    studentId: 2,
    marksObtained: 78,
    totalMarks: 100,
    status: "Pass",
  },
];

export const subjectBreakdowns = {
  1: [
    { subject: "Physics", percentage: 78 },
    { subject: "Chemistry", percentage: 84 },
    { subject: "Mathematics", percentage: 91 },
  ],
  3: [{ subject: "Biology", percentage: 86 }],
};

export const resultDetails = {
  "1-1": {
    correctAnswers: 23,
    incorrectAnswers: 3,
    attemptedQuestions: 26,
    notAttemptedQuestions: 4,
  },
  "1-6": {
    correctAnswers: 12,
    incorrectAnswers: 9,
    attemptedQuestions: 21,
    notAttemptedQuestions: 9,
  },
  "3-2": {
    correctAnswers: 78,
    incorrectAnswers: 12,
    attemptedQuestions: 90,
    notAttemptedQuestions: 10,
  },
};

export const studentHistory = {
  1: [
    {
      test: {
        id: "history-1",
        name: "JEE Advanced Full Test 00",
        totalMarks: 100,
      },
      score: 84,
      percentage: 84,
      rank: 2,
    },
  ],
  2: [
    {
      test: {
        id: "history-2",
        name: "NEET Biology Unit Test",
        totalMarks: 100,
      },
      score: 72,
      percentage: 72,
      rank: 3,
    },
  ],
  6: [
    {
      test: {
        id: "history-3",
        name: "JEE Advanced Mechanics Test",
        totalMarks: 100,
      },
      score: 37,
      percentage: 37,
      rank: 5,
    },
  ],
};
