import { useState } from "react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import AddResultModal from "../components/AddResultModal";
import ResultDetailsDrawer from "../components/ResultDetailsDrawer";
import { results as initialResults } from "../data/resultsData";
import { tests } from "../data/testsData";
import { courses } from "../data/coursesData";
import { batches } from "../data/batchesData";
import { students } from "../data/studentsData";

const resultStatuses = ["Pass", "Fail", "Pending"];

function Results() {
  const [results, setResults] = useState(initialResults);
  const [search, setSearch] = useState("");
  const [testFilter, setTestFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All");
  const [batchFilter, setBatchFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [selectedResultId, setSelectedResultId] = useState(null);

  const completedTests = tests.filter((test) => test.status === "Completed");
  const subjects = [...new Set(completedTests.map((test) => test.subject))].sort();
  const resultRows = results
    .map((result) => {
      const test = tests.find((item) => item.id === result.testId);
      const student = students.find((item) => item.id === result.studentId);
      if (!test || !student) return null;
      const percentage = result.totalMarks ? Math.round((result.marksObtained / result.totalMarks) * 100) : 0;
      return { ...result, test, student, percentage };
    })
    .filter(Boolean);
  const filteredResults = resultRows.filter((result) => {
    const query = search.toLowerCase();
    return (
      (!query || result.student.name.toLowerCase().includes(query)) &&
      (testFilter === "All" || String(result.test.id) === testFilter) &&
      (courseFilter === "All" || result.test.course === courseFilter) &&
      (batchFilter === "All" || result.student.batch === batchFilter) &&
      (subjectFilter === "All" || result.test.subject === subjectFilter) &&
      (statusFilter === "All" || result.status === statusFilter)
    );
  });
  const rankedResults = [...resultRows].sort((left, right) => right.percentage - left.percentage);
  const rowsWithRank = filteredResults.map((result) => ({
    ...result,
    rank: rankedResults.findIndex((item) => item.id === result.id) + 1,
  }));
  const scores = filteredResults.map((result) => result.percentage);
  const averageScore = scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
  const stats = [
    { label: "Total Results", value: filteredResults.length, change: "Matching result records", trend: "up" },
    { label: "Average Score", value: scores.length ? `${averageScore}%` : "-", change: "Across selected results", trend: "up" },
    { label: "Highest Score", value: scores.length ? `${Math.max(...scores)}%` : "-", change: "Top percentage", trend: "up" },
    { label: "Students Evaluated", value: new Set(filteredResults.map((result) => result.studentId)).size, change: "Unique students", trend: "up" },
  ];
  const selectedResult = rowsWithRank.find((result) => result.id === selectedResultId);
  const inputClass = "px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white";

  function saveResult(result) {
    if (editingResult) {
      setResults((current) => current.map((item) => item.id === editingResult.id ? { ...item, ...result } : item));
    } else {
      setResults((current) => [{ ...result, id: `result-${Date.now()}` }, ...current]);
    }
    setEditingResult(null);
  }

  function openCreate() {
    setEditingResult(null);
    setFormOpen(true);
  }

  function openEdit(result) {
    setSelectedResultId(null);
    setEditingResult(result);
    setFormOpen(true);
  }

  function historyForStudent(studentId) {
    return rowsWithRank.filter((result) => result.studentId === studentId).slice(0, 4);
  }

  function performanceCategory(percentage) {
    if (percentage >= 85) return "Excellent";
    if (percentage >= 70) return "Good";
    if (percentage >= 50) return "Needs Improvement";
    return "Critical";
  }

  return (
    <div>
      <PageHeader title="Results" subtitle="Review student performance after tests and identify the next academic action." actionLabel="+ Enter Result" onAction={openCreate} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">{stats.map((stat) => <StatCard key={stat.label} {...stat} />)}</div>
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]"><svg className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10.5A6.5 6.5 0 114 10.5a6.5 6.5 0 0113 0z" /></svg><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search students..." className={`w-full pl-9 ${inputClass}`} /></div>
        <select value={testFilter} onChange={(event) => setTestFilter(event.target.value)} className={inputClass}><option value="All">All Tests</option>{completedTests.map((test) => <option key={test.id} value={test.id}>{test.name}</option>)}</select>
        <select value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)} className={inputClass}><option value="All">All Courses</option>{courses.map((course) => <option key={course.id}>{course.name}</option>)}</select>
        <select value={batchFilter} onChange={(event) => setBatchFilter(event.target.value)} className={inputClass}><option value="All">All Batches</option>{batches.map((batch) => <option key={batch.id}>{batch.name}</option>)}</select>
        <select value={subjectFilter} onChange={(event) => setSubjectFilter(event.target.value)} className={inputClass}><option value="All">All Subjects</option>{subjects.map((subject) => <option key={subject}>{subject}</option>)}</select>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className={inputClass}><option value="All">All Statuses</option>{resultStatuses.map((status) => <option key={status}>{status}</option>)}</select>
      </div>
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        {rowsWithRank.length === 0 ? <EmptyState title={results.length ? "No matching results" : "No results yet"} message={results.length ? "Try adjusting your search or filters." : "Enter a result after a completed test to start tracking performance."} actionLabel={!results.length ? "+ Enter Result" : undefined} onAction={openCreate} /> : <div className="overflow-x-auto"><table className="w-full text-sm text-left min-w-[1000px]"><thead className="bg-neutral-50 text-neutral-500 uppercase text-xs"><tr><th className="px-5 py-3">Student</th><th className="px-5 py-3">Test</th><th className="px-5 py-3">Course / batch</th><th className="px-5 py-3">Subject</th><th className="px-5 py-3">Marks</th><th className="px-5 py-3">Percentage</th><th className="px-5 py-3">Rank</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Date</th><th className="px-5 py-3" /></tr></thead><tbody className="divide-y divide-neutral-100">{rowsWithRank.map((result) => <tr key={result.id} onClick={() => setSelectedResultId(result.id)} className="hover:bg-neutral-50 cursor-pointer"><td className="px-5 py-3.5 font-medium text-neutral-800">{result.student.name}</td><td className="px-5 py-3.5 text-neutral-700">{result.test.name}</td><td className="px-5 py-3.5"><p className="text-neutral-700">{result.test.course}</p><p className="text-xs text-neutral-400 mt-0.5">{result.student.batch}</p></td><td className="px-5 py-3.5 text-neutral-600">{result.test.subject}</td><td className="px-5 py-3.5 text-neutral-600">{result.marksObtained}/{result.totalMarks}</td><td className="px-5 py-3.5 font-medium text-neutral-700">{result.percentage}%</td><td className="px-5 py-3.5 text-neutral-600">#{result.rank}</td><td className="px-5 py-3.5"><StatusBadge status={result.status} /></td><td className="px-5 py-3.5 text-neutral-600">{result.test.date}</td><td className="px-5 py-3.5 text-right"><button type="button" onClick={(event) => { event.stopPropagation(); setSelectedResultId(result.id); }} className="text-brand-600 hover:text-brand-700 font-medium">View</button></td></tr>)}</tbody></table></div>}
      </div>
      {formOpen && <AddResultModal key={editingResult?.id || "new-result"} open={formOpen} result={editingResult} onClose={() => { setFormOpen(false); setEditingResult(null); }} onSave={saveResult} />}
      {selectedResult && <ResultDetailsDrawer key={selectedResult.id} result={{ ...selectedResult, score: selectedResult.marksObtained }} history={historyForStudent(selectedResult.studentId)} category={performanceCategory(selectedResult.percentage)} onClose={() => setSelectedResultId(null)} onEdit={openEdit} />}
    </div>
  );
}

export default Results;
