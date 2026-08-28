export const admissionsRecords = [
  {
    id: 1,
    counsellingId: 4,
    name: "Isha Bansal",
    course: "NEET",
    batch: "NEET Batch B",
    counsellor: "Dr. Kavita Rao",
    admissionDate: "2026-08-11",
    status: "Confirmed",
    feeStatus: "Paid",
    totalFee: 85000,
    paidAmount: 85000,
    documentsSubmitted: 4,
    documentsRequired: 4,
    notes: "All documents verified. Enrolled in NEET Batch B.",
  },
  {
    id: 2,
    counsellingId: null,
    name: "Rohan Verma",
    course: "NEET",
    batch: "NEET Batch A",
    counsellor: "Dr. Kavita Rao",
    admissionDate: "2026-08-05",
    status: "Confirmed",
    feeStatus: "Partially Paid",
    totalFee: 85000,
    paidAmount: 50000,
    documentsSubmitted: 3,
    documentsRequired: 4,
    notes: "Awaiting transfer certificate.",
  },
  {
    id: 3,
    counsellingId: null,
    name: "Aditi Sharma",
    course: "JEE Advanced",
    batch: "JEE Advanced - Morning",
    counsellor: "Dr. Ramesh Iyer",
    admissionDate: "2026-08-01",
    status: "Confirmed",
    feeStatus: "Paid",
    totalFee: 95000,
    paidAmount: 95000,
    documentsSubmitted: 4,
    documentsRequired: 4,
    notes: "Full payment received at admission.",
  },
  {
    id: 4,
    counsellingId: null,
    name: "Karan Mehta",
    course: "Foundation - Class 10",
    batch: "Foundation - Class 10",
    counsellor: "Mr. Sanjay Bhatt",
    admissionDate: "2026-08-15",
    status: "Pending",
    feeStatus: "Pending",
    totalFee: 45000,
    paidAmount: 0,
    documentsSubmitted: 1,
    documentsRequired: 4,
    notes: "Awaiting fee payment to confirm seat.",
  },
];

export function addAdmissionRecord(counsellingRecord) {
  const existingAdmission = admissionsRecords.find(
    (admission) => admission.counsellingId === counsellingRecord.id,
  );
  if (existingAdmission) return existingAdmission;

  const admission = {
    id: Math.max(0, ...admissionsRecords.map((item) => item.id)) + 1,
    counsellingId: counsellingRecord.id,
    name: counsellingRecord.name,
    course: counsellingRecord.course,
    batch: "Unassigned",
    counsellor: counsellingRecord.counsellor,
    admissionDate: counsellingRecord.followUpDate || counsellingRecord.date,
    status: "Pending",
    feeStatus: "Pending",
    totalFee: 0,
    paidAmount: 0,
    documentsSubmitted: 0,
    documentsRequired: 4,
    notes: counsellingRecord.notes || "Admission created from counselling.",
  };
  admissionsRecords.unshift(admission);
  return admission;
}

export const admissionStatusOptions = ["Pending", "Confirmed", "Cancelled"];
export const feeStatusOptions = [
  "Paid",
  "Partially Paid",
  "Overdue",
  "Pending",
];
