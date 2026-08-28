import { batches } from "./batchesData";
import { faculty } from "./facultyData";
import { students } from "./studentsData";

const baseMaterials = [
  {
    id: 1,
    title: "JEE Advanced Physics — Mechanics Notes",
    course: "JEE Advanced",
    batch: "JEE Advanced - Morning",
    subject: "Physics",
    topic: "Mechanics",
    facultyId: 1,
    faculty: "Dr. Ramesh Iyer",
    materialType: "Notes",
    resourceName: "mechanics-notes-advanced.pdf",
    uploadedDate: "2026-08-15",
    status: "Published",
  },
  {
    id: 2,
    title: "JEE Main Mathematics — Calculus Formula Sheet",
    course: "JEE Main",
    batch: "JEE Advanced - Evening",
    subject: "Mathematics",
    topic: "Calculus",
    facultyId: 1,
    faculty: "Dr. Ramesh Iyer",
    materialType: "Reference",
    resourceName: "calculus-formula-sheet.pdf",
    uploadedDate: "2026-08-10",
    status: "Published",
  },
  {
    id: 3,
    title: "NEET Biology — Human Physiology Notes",
    course: "NEET",
    batch: "NEET Batch A",
    subject: "Biology",
    topic: "Human Physiology",
    facultyId: 2,
    faculty: "Dr. Kavita Rao",
    materialType: "PDF",
    resourceName: "human-physiology-notes.pdf",
    uploadedDate: "2026-08-08",
    status: "Published",
  },
  {
    id: 4,
    title: "NEET Chemistry — Organic Chemistry Revision",
    course: "NEET",
    batch: "NEET Batch B",
    subject: "Chemistry",
    topic: "Organic Chemistry",
    facultyId: 4,
    faculty: "Ms. Anjali Desai",
    materialType: "Worksheet",
    resourceName: "organic-chemistry-revision.pdf",
    uploadedDate: "2026-08-12",
    status: "Draft",
  },
  {
    id: 5,
    title: "Foundation Class 10 — Science Chapter Notes",
    course: "Foundation - Class 10",
    batch: "Foundation - Class 10",
    subject: "Science",
    topic: "Life Processes",
    facultyId: 3,
    faculty: "Mr. Sanjay Bhatt",
    materialType: "Notes",
    resourceName: "science-chapter-notes.pdf",
    uploadedDate: "2026-08-14",
    status: "Published",
  },
  {
    id: 6,
    title: "Foundation Class 9 — Mathematics Practice Material",
    course: "Foundation - Class 9",
    batch: "Foundation - Class 10",
    subject: "Mathematics",
    topic: "Algebra",
    facultyId: 3,
    faculty: "Mr. Sanjay Bhatt",
    materialType: "Practice Material",
    resourceName: "class-9-maths-practice.pdf",
    uploadedDate: "2026-08-18",
    status: "Draft",
  },
];

function studentsForBatch(batchName) {
  return students.filter((student) => student.batch === batchName);
}

function studentAccessCount(batchName) {
  return studentsForBatch(batchName).length;
}

export const studyMaterials = baseMaterials.map((material) => {
  const batch = batches.find((item) => item.name === material.batch);
  const studentCount = batch ? studentAccessCount(batch.name) : 0;

  return {
    ...material,
    studentAccessCount: material.studentAccessCount ?? studentCount,
    studentIds: studentsForBatch(material.batch).map((student) => student.id),
  };
});

export const materialTypes = [
  "PDF",
  "Notes",
  "Worksheet",
  "Video",
  "Practice Material",
  "Reference",
];

export const materialStatuses = ["Draft", "Published", "Archived"];

export const studyMaterialFaculty = faculty.map((member) => ({
  ...member,
  subject: member.subject,
}));
