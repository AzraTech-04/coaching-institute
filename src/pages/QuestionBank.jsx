import { useState } from "react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import AddQuestionModal from "../components/AddQuestionModal";
import QuestionDetailsDrawer from "../components/QuestionDetailsDrawer";
import { courses } from "../data/coursesData";
import {
  difficultyLevels,
  questionStatuses,
  questionTypes,
  questions as initialQuestions,
} from "../data/questionBankData";

function QuestionBank() {
  const [questions, setQuestions] = useState(initialQuestions);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [topicFilter, setTopicFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);

  const subjects = [
    ...new Set(questions.map((question) => question.subject)),
  ].sort();
  const topics = [
    ...new Set(questions.map((question) => question.topic)),
  ].sort();
  const filteredQuestions = questions.filter((question) => {
    const query = search.toLowerCase();
    return (
      (!query ||
        `${question.text} ${question.topic} ${question.course} ${question.subject}`
          .toLowerCase()
          .includes(query)) &&
      (subjectFilter === "All" || question.subject === subjectFilter) &&
      (courseFilter === "All" || question.course === courseFilter) &&
      (difficultyFilter === "All" ||
        question.difficulty === difficultyFilter) &&
      (typeFilter === "All" || question.type === typeFilter) &&
      (topicFilter === "All" || question.topic === topicFilter) &&
      (statusFilter === "All" || question.status === statusFilter)
    );
  });
  const selectedQuestion = questions.find(
    (question) => question.id === selectedQuestionId,
  );
  const stats = [
    {
      label: "Total Questions",
      value: questions.length,
      change: "In question bank",
      trend: "up",
    },
    {
      label: "Active Questions",
      value: questions.filter((question) => question.status === "Active")
        .length,
      change: "Available for tests",
      trend: "up",
    },
    {
      label: "Questions Used in Tests",
      value: questions.filter((question) => question.usedInTests.length > 0)
        .length,
      change: "Connected to assessments",
      trend: "up",
    },
    {
      label: "Subjects Covered",
      value: new Set(questions.map((question) => question.subject)).size,
      change: "Across active courses",
      trend: "up",
    },
  ];

  function saveQuestion(question) {
    if (editingQuestion) {
      setQuestions((current) =>
        current.map((item) =>
          item.id === editingQuestion.id ? { ...item, ...question } : item,
        ),
      );
    } else {
      setQuestions((current) => [
        {
          ...question,
          id: Date.now(),
          usedInTests: [],
          attempted: 0,
          materials: [
            { name: "Reference Solution", submitted: false },
            { name: "Supporting Material", submitted: false },
          ],
        },
        ...current,
      ]);
    }
    setEditingQuestion(null);
  }

  function openCreate() {
    setEditingQuestion(null);
    setFormOpen(true);
  }

  function openEdit(question) {
    setSelectedQuestionId(null);
    setEditingQuestion(question);
    setFormOpen(true);
  }

  function emptyTitle() {
    if (!questions.length) return "No questions yet";
    if (statusFilter === "Archived") return "No archived questions";
    if (courseFilter !== "All") return "No questions for selected course";
    if (subjectFilter !== "All") return "No questions for selected subject";
    return "No matching questions";
  }

  const inputClass =
    "px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white";

  return (
    <div>
      <PageHeader
        title="Question Bank"
        subtitle="Create, classify, and maintain questions for every assessment."
        actionLabel="+ Add Question"
        onAction={openCreate}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <svg
            className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 10.5A6.5 6.5 0 114 10.5a6.5 6.5 0 0113 0z"
            />
          </svg>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search questions, topics..."
            className={`w-full pl-9 ${inputClass}`}
          />
        </div>
        <select
          value={subjectFilter}
          onChange={(event) => setSubjectFilter(event.target.value)}
          className={inputClass}
        >
          <option value="All">All Subjects</option>
          {subjects.map((subject) => (
            <option key={subject}>{subject}</option>
          ))}
        </select>
        <select
          value={courseFilter}
          onChange={(event) => setCourseFilter(event.target.value)}
          className={inputClass}
        >
          <option value="All">All Courses</option>
          {courses.map((course) => (
            <option key={course.id}>{course.name}</option>
          ))}
        </select>
        <select
          value={difficultyFilter}
          onChange={(event) => setDifficultyFilter(event.target.value)}
          className={inputClass}
        >
          <option value="All">All Difficulties</option>
          {difficultyLevels.map((level) => (
            <option key={level}>{level}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
          className={inputClass}
        >
          <option value="All">All Question Types</option>
          {questionTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
        <select
          value={topicFilter}
          onChange={(event) => setTopicFilter(event.target.value)}
          className={inputClass}
        >
          <option value="All">All Topics</option>
          {topics.map((topic) => (
            <option key={topic}>{topic}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className={inputClass}
        >
          <option value="All">All Statuses</option>
          {questionStatuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </div>
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        {filteredQuestions.length === 0 ? (
          <EmptyState
            title={emptyTitle()}
            message={
              questions.length
                ? "Try adjusting your search or filters to find what you are looking for."
                : "Add your first question to start building the institute question bank."
            }
            actionLabel={!questions.length ? "+ Add Question" : undefined}
            onAction={openCreate}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[1280px]">
              <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3">Question</th>
                  <th className="px-5 py-3">Subject / topic</th>
                  <th className="px-5 py-3">Course</th>
                  <th className="px-5 py-3">Difficulty</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Marks</th>
                  <th className="px-5 py-3">Created by</th>
                  <th className="px-5 py-3">Created date</th>
                  <th className="px-5 py-3">Usage</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredQuestions.map((question) => (
                  <tr
                    key={question.id}
                    className="hover:bg-neutral-50 cursor-pointer"
                    onClick={() => setSelectedQuestionId(question.id)}
                  >
                    <td className="px-5 py-3.5 max-w-[340px]">
                      <p className="font-medium text-neutral-800 line-clamp-2">
                        {question.text}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-neutral-700">{question.subject}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {question.topic}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-neutral-600">
                      {question.course}
                    </td>
                    <td className="px-5 py-3.5 text-neutral-600">
                      {question.difficulty}
                    </td>
                    <td className="px-5 py-3.5 text-neutral-600">
                      {question.type}
                    </td>
                    <td className="px-5 py-3.5 text-neutral-600">
                      {question.marks}
                    </td>
                    <td className="px-5 py-3.5 text-neutral-600">
                      {question.createdBy}
                    </td>
                    <td className="px-5 py-3.5 text-neutral-600">
                      {question.createdDate}
                    </td>
                    <td className="px-5 py-3.5 text-neutral-600">
                      {question.usedInTests.length} test
                      {question.usedInTests.length === 1 ? "" : "s"}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={question.status} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedQuestionId(question.id);
                        }}
                        className="text-brand-600 hover:text-brand-700 font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {formOpen && (
        <AddQuestionModal
          open={formOpen}
          question={editingQuestion}
          onClose={() => {
            setFormOpen(false);
            setEditingQuestion(null);
          }}
          onSave={saveQuestion}
        />
      )}
      {selectedQuestion && (
        <QuestionDetailsDrawer
          key={selectedQuestion.id}
          question={selectedQuestion}
          onClose={() => setSelectedQuestionId(null)}
          onEdit={openEdit}
          onStatusChange={(status) =>
            setQuestions((current) =>
              current.map((question) =>
                question.id === selectedQuestionId
                  ? { ...question, status }
                  : question,
              ),
            )
          }
        />
      )}
    </div>
  );
}

export default QuestionBank;
