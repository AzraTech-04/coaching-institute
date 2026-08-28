export const counsellingRecords = [
  {
    id: 1,
    leadId: 2,
    name: "Neha Kapoor",
    course: "NEET",
    counsellor: "Dr. Kavita Rao",
    date: "2026-08-22",
    time: "11:00 AM",
    status: "Scheduled",
    followUpDate: "2026-08-24",
    notes: "First counselling session. Interested in NEET Batch A.",
  },
  {
    id: 2,
    name: "Rahul Joshi",
    leadId: 3,
    course: "Foundation - Class 10",
    counsellor: "Mr. Sanjay Bhatt",
    date: "2026-08-20",
    time: "4:00 PM",
    status: "Follow-up Required",
    followUpDate: "2026-08-23",
    notes: "Comparing with another institute. Needs fee comparison sheet.",
  },
  {
    id: 3,
    name: "Amit Kulkarni",
    leadId: null,
    course: "JEE Advanced",
    counsellor: "Dr. Ramesh Iyer",
    date: "2026-08-19",
    time: "10:00 AM",
    status: "Completed",
    followUpDate: "2026-08-21",
    notes: "Session completed. Awaiting decision.",
  },
  {
    id: 4,
    name: "Isha Bansal",
    leadId: 4,
    course: "NEET",
    counsellor: "Dr. Kavita Rao",
    date: "2026-08-09",
    time: "2:00 PM",
    status: "Converted",
    followUpDate: "2026-08-10",
    notes: "Convinced by demo class. Proceeding to admission.",
  },
  {
    id: 5,
    name: "Yash Trivedi",
    leadId: 5,
    course: "JEE Advanced",
    counsellor: "Ms. Anjali Desai",
    date: "2026-08-04",
    time: "3:30 PM",
    status: "Not Interested",
    followUpDate: "2026-08-05",
    notes: "Decided on a different institute.",
  },
];

export function addCounsellingRecord(lead) {
  const existingRecord = counsellingRecords.find(
    (record) => record.leadId === lead.id,
  );
  if (existingRecord) return existingRecord;

  const record = {
    id: Math.max(0, ...counsellingRecords.map((item) => item.id)) + 1,
    leadId: lead.id,
    name: lead.name,
    course: lead.course,
    counsellor: "Unassigned",
    date: lead.followUpDate,
    time: "Not scheduled",
    status: "Scheduled",
    followUpDate: lead.followUpDate,
    notes: lead.notes,
  };
  counsellingRecords.unshift(record);
  return record;
}

export const counsellorOptions = [
  "Dr. Ramesh Iyer",
  "Dr. Kavita Rao",
  "Mr. Sanjay Bhatt",
  "Ms. Anjali Desai",
];
export const counsellingStatusOptions = [
  "Scheduled",
  "Completed",
  "Follow-up Required",
  "Converted",
  "Not Interested",
];
