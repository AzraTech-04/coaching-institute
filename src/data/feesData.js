export const paymentMethodOptions = ["UPI", "Cash", "Bank Transfer", "Card"];

const baseFees = [
  {
    id: 1,
    studentId: 1,
    totalFee: 95000,
    dueDate: "2026-09-15",
    paymentHistory: [
      { id: 1, date: "2026-06-01", amount: 50000, method: "Bank Transfer" },
      { id: 2, date: "2026-08-01", amount: 45000, method: "UPI" },
    ],
  },
  {
    id: 2,
    studentId: 2,
    totalFee: 85000,
    dueDate: "2026-09-10",
    paymentHistory: [
      { id: 1, date: "2026-06-05", amount: 85000, method: "Bank Transfer" },
    ],
  },
  {
    id: 3,
    studentId: 3,
    totalFee: 95000,
    dueDate: "2026-08-05",
    paymentHistory: [
      { id: 1, date: "2026-06-10", amount: 40000, method: "Cash" },
    ],
  },
  {
    id: 4,
    studentId: 4,
    totalFee: 45000,
    dueDate: "2026-09-20",
    paymentHistory: [],
  },
  {
    id: 5,
    studentId: 5,
    totalFee: 85000,
    dueDate: "2026-09-12",
    paymentHistory: [
      { id: 1, date: "2026-06-08", amount: 40000, method: "UPI" },
      { id: 2, date: "2026-07-20", amount: 25000, method: "Card" },
    ],
  },
  {
    id: 6,
    studentId: 6,
    totalFee: 95000,
    dueDate: "2026-08-01",
    paymentHistory: [
      { id: 1, date: "2026-06-02", amount: 30000, method: "Cash" },
    ],
  },
];

export const feeRecords = baseFees;
