import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import AddTestModal from "../components/AddTestModal";
import TestDetailsDrawer from "../components/TestDetailsDrawer";
import {
  tests as initialTests,
  testStatuses,
  testTypes,
} from "../data/testsData";
import { courses } from "../data/coursesData";
import { batches } from "../data/batchesData";
import { students } from "../data/studentsData";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function Tests() {
  const [tests, setTests] = useState(initialTests);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [batchFilter, setBatchFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [selectedTestId, setSelectedTestId] = useState(null);

  useEffect(() => {
    async function loadTests() {
      try {
        const response = await fetch(`${API_URL}/tests/`);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const data = await response.json();
        setTests(data);
      } catch (error) {
        console.error("Failed to load tests:", error);
      }
    }

    loadTests();
  }, []);

  const filteredTests = tests.filter((test) => {
    const query = search.toLowerCase();
    return (
      (!query ||
        `${test.name} ${test.subject} ${test.batch}`
          .toLowerCase()
          .includes(query)) &&
      (courseFilter === "All" || test.course === courseFilter) &&
      (batchFilter === "All" || test.batch === batchFilter) &&
      (typeFilter === "All" || test.type === typeFilter) &&
      (subjectFilter === "All" || test.subject === subjectFilter) &&
      (statusFilter === "All" || test.status === statusFilter) &&
      (!dateFilter || test.date === dateFilter)
    );
  });
  const selectedTest = tests.find((test) => test.id === selectedTestId);
  const selectedBatch = selectedTest
    ? batches.find((batch) => batch.name === selectedTest.batch)
    : null;
  const scheduledCount = tests.filter(
    (test) => test.status === "Scheduled",
  ).length;
  const completedCount = tests.filter(
    (test) => test.status === "Completed",
  ).length;
  const attemptedCount = tests.reduce(
    (sum, test) => sum + (test.performance?.length || 0),
    0,
  );
  const stats = [
    {
      label: "Total Tests",
      value: tests.length,
      change: "All test records",
      trend: "up",
    },
    {
      label: "Scheduled",
      value: scheduledCount,
      change: "Upcoming tests",
      trend: "up",
    },
    {
      label: "Completed",
      value: completedCount,
      change: "Results available",
      trend: "up",
    },
    {
      label: "Student Attempts",
      value: attemptedCount,
      change: "Across completed tests",
      trend: "up",
    },
  ];

  async function saveTest(test) {
    const payload = {
      ...test,
      status: test.status || "Scheduled",
      materials: test.materials || [
        { name: "Question Paper", submitted: false },
        { name: "Answer Key", submitted: false },
        { name: "Instructions", submitted: false },
      ],
      performance: test.performance || [],
    };

    try {
      if (editingTest) {
        const response = await fetch(`${API_URL}/tests/${editingTest.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const updatedTest = await response.json();
        setTests((current) =>
          current.map((item) =>
            item.id === editingTest.id ? updatedTest : item,
          ),
        );
        setEditingTest(null);
        return;
      }

      let createdTest;
      try {
        const response = await fetch(`${API_URL}/tests/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        createdTest = await response.json();
      } catch (error) {
        if (error instanceof TypeError) {
          createdTest = {
            ...payload,
            id: Math.max(0, ...tests.map((item) => item.id || 0)) + 1,
          };
        } else {
          throw error;
        }
      }
      setTests((current) => [createdTest, ...current]);
    } catch (error) {
      console.error("Failed to save test:", error);
      throw error;
    }
  }

  function openCreateModal() {
    setEditingTest(null);
    setModalOpen(true);
  }

  function openEditModal(test) {
    setSelectedTestId(null);
    setEditingTest(test);
    setModalOpen(true);
  }

  async function updateStatus(testId, status) {
    const targetTest = tests.find((test) => test.id === testId);
    if (!targetTest) return;

    const updatedTest = { ...targetTest, status };
    setTests((current) =>
      current.map((test) => (test.id === testId ? updatedTest : test)),
    );

    try {
      const response = await fetch(`${API_URL}/tests/${testId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...targetTest, status }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const savedTest = await response.json();
      setTests((current) =>
        current.map((test) => (test.id === testId ? savedTest : test)),
      );
    } catch (error) {
      console.error("Failed to update test status:", error);
    }
  }

  async function completeTest(testId) {
    const targetTest = tests.find((test) => test.id === testId);
    if (!targetTest) return;

    try {
      const testBatch = batches.find(
        (batch) => batch.name === targetTest.batch,
      );
      const batchStudents =
        testBatch?.studentList ||
        students.filter((student) => student.batch === targetTest.batch);
      const scoreRatios = [0.42, 0.78, 0.84, 0.91, 0.88, 0.95];
      const performance = batchStudents.map((student, index) => ({
        studentId: student.id,
        score: Math.round(targetTest.totalMarks * (scoreRatios[index] || 0.72)),
      }));
      const completedTest = {
        ...targetTest,
        status: "Completed",
        performance,
      };
      setTests((current) =>
        current.map((test) => (test.id === testId ? completedTest : test)),
      );

      const response = await fetch(`${API_URL}/tests/${testId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...completedTest,
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const updatedTest = await response.json();
      setTests((current) =>
        current.map((test) => (test.id === testId ? updatedTest : test)),
      );
    } catch (error) {
      console.error("Failed to complete test:", error);
    }
  }

  const tableEmptyTitle =
    tests.length === 0
      ? "No tests yet"
      : statusFilter === "Scheduled"
        ? "No scheduled tests"
        : statusFilter === "Completed"
          ? "No completed tests"
          : "No matching tests";
  const tableEmptyMessage =
    tests.length === 0
      ? "Create your first test to start tracking student performance."
      : statusFilter === "Scheduled"
        ? "There are no upcoming tests matching this view."
        : statusFilter === "Completed"
          ? "Completed tests and their student performance will appear here."
          : "Try adjusting your search or filters to find what you are looking for.";
  const inputClass =
    "px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white";

  return (
    <div>
      <PageHeader
        title="Tests"
        subtitle="Plan assessments, track participation, and review student performance."
        actionLabel="+ Create Test"
        onAction={openCreateModal}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
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
            placeholder="Search tests..."
            className={`w-full pl-9 ${inputClass}`}
          />
        </div>
        <select
          value={courseFilter}
          onChange={(event) => setCourseFilter(event.target.value)}
          className={inputClass}
        >
          <option value="All">All Courses</option>
          {courses.map((course) => (
            <option key={course.id} value={course.name}>
              {course.name}
            </option>
          ))}
        </select>
        <select
          value={batchFilter}
          onChange={(event) => setBatchFilter(event.target.value)}
          className={inputClass}
        >
          <option value="All">All Batches</option>
          {batches.map((batch) => (
            <option key={batch.id} value={batch.name}>
              {batch.name}
            </option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
          className={inputClass}
        >
          <option value="All">All Test Types</option>
          {testTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
        <select
          value={subjectFilter}
          onChange={(event) => setSubjectFilter(event.target.value)}
          className={inputClass}
        >
          <option value="All">All Subjects</option>
          {[...new Set(tests.map((test) => test.subject))].map((subject) => (
            <option key={subject}>{subject}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className={inputClass}
        >
          <option value="All">All Statuses</option>
          {testStatuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(event) => setDateFilter(event.target.value)}
          className={inputClass}
        />
      </div>
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        {filteredTests.length === 0 ? (
          <EmptyState
            title={tableEmptyTitle}
            message={tableEmptyMessage}
            actionLabel={tests.length === 0 ? "+ Create Test" : undefined}
            onAction={openCreateModal}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[980px]">
              <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3">Test name</th>
                  <th className="px-5 py-3">Course / batch</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Subject</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Duration</th>
                  <th className="px-5 py-3">Marks</th>
                  <th className="px-5 py-3">Students</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredTests.map((test) => {
                  const batch = batches.find(
                    (item) => item.name === test.batch,
                  );
                  return (
                    <tr
                      key={test.id}
                      className="hover:bg-neutral-50 cursor-pointer"
                      onClick={() => setSelectedTestId(test.id)}
                    >
                      <td className="px-5 py-3.5 font-medium text-neutral-800">
                        {test.name}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-neutral-700">{test.course}</p>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          {test.batch}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-neutral-600">
                        {test.type}
                      </td>
                      <td className="px-5 py-3.5 text-neutral-600">
                        {test.subject}
                      </td>
                      <td className="px-5 py-3.5 text-neutral-600">
                        {test.date}
                        <p className="text-xs text-neutral-400 mt-0.5">
                          {test.startTime}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-neutral-600">
                        {test.duration} min
                      </td>
                      <td className="px-5 py-3.5 text-neutral-600">
                        {test.totalMarks}
                      </td>
                      <td className="px-5 py-3.5 text-neutral-600">
                        {batch?.students || 0}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={test.status} />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedTestId(test.id);
                          }}
                          className="text-brand-600 hover:text-brand-700 font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {modalOpen && (
        <AddTestModal
          key={editingTest ? editingTest.id : "new-test"}
          open={modalOpen}
          test={editingTest}
          onClose={() => {
            setModalOpen(false);
            setEditingTest(null);
          }}
          onSave={saveTest}
        />
      )}
      <TestDetailsDrawer
        key={selectedTest?.id || "no-test"}
        test={selectedTest}
        batch={selectedBatch}
        onClose={() => setSelectedTestId(null)}
        onEdit={openEditModal}
        onStatusChange={(status) => updateStatus(selectedTestId, status)}
        onComplete={() => completeTest(selectedTestId)}
      />
    </div>
  );
}

export default Tests;
