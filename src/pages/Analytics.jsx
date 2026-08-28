import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import { students } from "../data/studentsData";
import { courses } from "../data/coursesData";
import { batches } from "../data/batchesData";
import { faculty } from "../data/facultyData";
import { tests } from "../data/testsData";
import { results } from "../data/resultsData";
import { assignments } from "../data/assignmentsData";
import { doubts } from "../data/doubtsData";

const TODAY = "2026-08-22";
const inputClass =
  "px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white";

function average(values) {
  return values.length
    ? Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10
    : 0;
}

function inDateRange(date, range) {
  if (!date || range === "All Time") return true;
  const days = Number(range.split(" ")[1]);
  const from = new Date(`${TODAY}T00:00:00`);
  from.setDate(from.getDate() - days + 1);
  const target = new Date(`${date}T00:00:00`);
  return target >= from && target <= new Date(`${TODAY}T23:59:59`);
}

function formatNumber(value) {
  return Number.isInteger(value) ? value : value.toFixed(1);
}

function Panel({ title, subtitle, children, className = "" }) {
  return (
    <section className={`bg-white border border-neutral-200 rounded-xl shadow-sm ${className}`}>
      <div className="px-5 pt-5">
        <h2 className="text-base font-semibold text-neutral-800">{title}</h2>
        {subtitle && <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function LineChart({ points, secondPoints, labels, firstLabel, secondLabel }) {
  const width = 620;
  const height = 220;
  const chartPoints = (values) => values.map((value, index) => {
    const x = 28 + (index * (width - 56)) / Math.max(values.length - 1, 1);
    const y = height - 30 - ((value - 35) / 65) * (height - 55);
    return `${x},${Math.max(18, Math.min(height - 30, y))}`;
  }).join(" ");

  return (
    <div className="px-5 pb-5 pt-4">
      <div className="flex flex-wrap gap-4 text-xs text-neutral-500 mb-3">
        <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-600" />{firstLabel}</span>
        <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />{secondLabel}</span>
      </div>
      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[420px] h-56" role="img" aria-label={`${firstLabel} and ${secondLabel} trend chart`}>
          {[40, 60, 80, 100].map((tick) => {
            const y = height - 30 - ((tick - 35) / 65) * (height - 55);
            return <g key={tick}><line x1="28" x2={width - 28} y1={y} y2={y} stroke="#e7e5e4" strokeDasharray="3 4" /><text x="0" y={y + 4} fontSize="11" fill="#a8a29e">{tick}</text></g>;
          })}
          <polyline points={chartPoints(points)} fill="none" stroke="#5b21b6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={chartPoints(secondPoints)} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {labels.map((label, index) => <text key={label} x={28 + (index * (width - 56)) / Math.max(labels.length - 1, 1)} y={height - 8} textAnchor="middle" fontSize="11" fill="#78716c">{label}</text>)}
          {points.map((value, index) => <circle key={`first-${index}`} cx={28 + (index * (width - 56)) / Math.max(points.length - 1, 1)} cy={chartPoints(points).split(" ")[index].split(",")[1]} r="4" fill="#5b21b6"><title>{`${firstLabel}: ${value}%`}</title></circle>)}
          {secondPoints.map((value, index) => <circle key={`second-${index}`} cx={28 + (index * (width - 56)) / Math.max(secondPoints.length - 1, 1)} cy={chartPoints(secondPoints).split(" ")[index].split(",")[1]} r="4" fill="#10b981"><title>{`${secondLabel}: ${value}%`}</title></circle>)}
        </svg>
      </div>
    </div>
  );
}

function BarChart({ items, valueKey = "value", color = "bg-brand-600" }) {
  const max = Math.max(...items.map((item) => item[valueKey]), 1);
  return (
    <div className="px-5 pb-5 pt-4 space-y-4">
      {items.map((item) => <div key={item.label}>
        <div className="flex justify-between gap-3 text-xs mb-1.5"><span className="text-neutral-600 truncate">{item.label}</span><span className="font-semibold text-neutral-800">{item[valueKey]}%</span></div>
        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden" title={`${item.label}: ${item[valueKey]}%`}><div className={`h-full rounded-full ${color}`} style={{ width: `${(item[valueKey] / max) * 100}%` }} /></div>
      </div>)}
    </div>
  );
}

function Donut({ segments, center }) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1;
  const gradient = segments.reduce((result, segment) => {
    const start = result.cursor;
    const end = start + (segment.value / total) * 100;
    return { cursor: end, stops: [...result.stops, `${segment.color} ${start}% ${end}%`] };
  }, { cursor: 0, stops: [] }).stops.join(", ");
  return <div className="flex items-center gap-6 px-5 pb-5 pt-4"><div className="w-28 h-28 rounded-full shrink-0 flex items-center justify-center" style={{ background: `conic-gradient(${gradient})` }}><div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-lg font-bold text-neutral-800">{center}</div></div><div className="space-y-2 text-xs">{segments.map((segment) => <div key={segment.label} className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: segment.color }} /><span className="text-neutral-600">{segment.label}</span><span className="font-semibold text-neutral-800">{segment.value}</span></div>)}</div></div>;
}

function Analytics() {
  const [filters, setFilters] = useState({
    range: "Last 30 Days",
    course: "All",
    batch: "All",
    faculty: "All",
    subject: "All",
  });
  const setFilter = (name, value) =>
    setFilters((current) => ({ ...current, [name]: value }));

  const data = useMemo(() => {
    const scopeMatches = (item) =>
      (filters.course === "All" || item.course === filters.course) &&
      (filters.batch === "All" || item.batch === filters.batch) &&
      (filters.faculty === "All" ||
        item.faculty === filters.faculty ||
        item.facultyId ===
          faculty.find((member) => member.name === filters.faculty)?.id) &&
      (filters.subject === "All" || item.subject === filters.subject);

    const subjectStudentIds =
      filters.subject === "All"
        ? null
        : new Set([
            ...tests
              .filter((test) => test.subject === filters.subject)
              .flatMap((test) =>
                test.performance.map((entry) => entry.studentId),
              ),
            ...assignments
              .filter((assignment) => assignment.subject === filters.subject)
              .flatMap((assignment) =>
                assignment.submissions.map((entry) => entry.studentId),
              ),
            ...doubts
              .filter((doubt) => doubt.subject === filters.subject)
              .map((doubt) => doubt.studentId),
          ]);

    const scopedStudents = students.filter((student) => {
      const batch = batches.find((item) => item.name === student.batch);
      const matches =
        (filters.course === "All" || student.course === filters.course) &&
        (filters.batch === "All" || student.batch === filters.batch) &&
        (filters.faculty === "All" || batch?.facultyName === filters.faculty);

      return matches && (!subjectStudentIds || subjectStudentIds.has(student.id));
    });

    const studentIds = new Set(scopedStudents.map((student) => student.id));
    const scopedTests = tests.filter(
      (test) => scopeMatches(test) && inDateRange(test.date, filters.range),
    );
    const scopedTestIds = new Set(scopedTests.map((test) => test.id));
    const scopedResults = results.filter(
      (result) => studentIds.has(result.studentId) && scopedTestIds.has(result.testId),
    );
    const scopedAssignments = assignments.filter(
      (assignment) =>
        scopeMatches(assignment) && inDateRange(assignment.assignedDate, filters.range),
    );
    const scopedDoubts = doubts.filter(
      (doubt) => scopeMatches(doubt) && inDateRange(doubt.createdDate, filters.range),
    );

    const scoreValues = scopedResults.map(
      (result) => (result.marksObtained / result.totalMarks) * 100,
    );
    const completedSubmissions = scopedAssignments
      .flatMap((assignment) => assignment.submissions)
      .filter((submission) => studentIds.has(submission.studentId));
    const assignmentRate = completedSubmissions.length
      ? Math.round(
          (completedSubmissions.filter((submission) => submission.status === "Submitted")
            .length /
            completedSubmissions.length) *
            100,
        )
      : 0;
    const resolvedDoubts = scopedDoubts.filter((doubt) => doubt.status === "Resolved")
      .length;
    const resolutionRate = scopedDoubts.length
      ? Math.round((resolvedDoubts / scopedDoubts.length) * 100)
      : 0;

    const trend = [...new Set(scopedTests.map((test) => test.date))]
      .sort()
      .slice(-6)
      .map((date) => {
        const dateResults = scopedResults
          .filter(
            (result) =>
              scopedTests.find((test) => test.id === result.testId)?.date === date,
          )
          .map((result) => (result.marksObtained / result.totalMarks) * 100);

        return {
          label: date.slice(5),
          score: average(dateResults) || average(scoreValues),
        };
      });

    const assignmentTrend = [...new Set(scopedAssignments.map((assignment) => assignment.assignedDate))]
      .sort()
      .slice(-6)
      .map((date) => {
        const dateSubmissions = scopedAssignments
          .filter((assignment) => assignment.assignedDate === date)
          .flatMap((assignment) => assignment.submissions)
          .filter((submission) => studentIds.has(submission.studentId));

        const completion = dateSubmissions.length
          ? Math.round(
              (dateSubmissions.filter((submission) => submission.status === "Submitted")
                .length /
                dateSubmissions.length) *
                100,
            )
          : 0;

        return {
          label: date.slice(5),
          completion,
        };
      });

    const bySubject = [...new Set([
      ...scopedTests.map((test) => test.subject),
      ...scopedAssignments.map((assignment) => assignment.subject),
      ...scopedDoubts.map((doubt) => doubt.subject),
    ])]
      .map((subject) => {
        const subjectResults = scopedResults.filter(
          (result) => scopedTests.find((test) => test.id === result.testId)?.subject === subject,
        );

        return {
          label: subject,
          value: Math.round(
            average(
              subjectResults.map(
                (result) => (result.marksObtained / result.totalMarks) * 100,
              ),
            ) || 0,
          ),
        };
      })
      .filter((item) => item.value > 0);

    const recentTests = scopedTests
      .filter((test) => test.performance.length)
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 4)
      .map((test) => {
        const testResults = scopedResults.filter((result) => result.testId === test.id);
        return {
          ...test,
          average: Math.round(
            average(testResults.map((result) => (result.marksObtained / result.totalMarks) * 100)),
          ),
          highest: Math.round(
            Math.max(
              ...testResults.map((result) => (result.marksObtained / result.totalMarks) * 100),
              0,
            ),
          ),
          attempts: testResults.length,
        };
      });

    const strongestStudents = [...scopedStudents]
      .map((student) => {
        const studentResults = scopedResults.filter((result) => result.studentId === student.id);
        const avgScore = studentResults.length
          ? average(studentResults.map((result) => (result.marksObtained / result.totalMarks) * 100))
          : 0;
        return { ...student, avgScore };
      })
      .filter((student) => student.avgScore > 0)
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 4);

    const facultyActivity = faculty
      .filter((member) =>
        scopedStudents.some(
          (student) => batches.find((batch) => batch.name === student.batch)?.facultyId === member.id,
        ),
      )
      .map((member) => {
        const memberTests = scopedTests.filter((test) => test.facultyId === member.id);
        const memberDoubts = scopedDoubts.filter((doubt) => doubt.facultyId === member.id);
        const memberStudents = scopedStudents.filter(
          (student) => batches.find((batch) => batch.name === student.batch)?.facultyId === member.id,
        );

        return {
          name: member.name,
          students: memberStudents.length,
          tests: memberTests.length,
          doubts: memberDoubts.length,
          resolved: memberDoubts.filter((doubt) => doubt.status === "Resolved").length,
          score: Math.round(
            average(memberStudents.map((student) => student.avgScore || 0)),
          ),
        };
      });

    return {
      scopedStudents,
      scopedTests,
      scopedResults,
      scopedAssignments,
      scopedDoubts,
      scoreValues,
      assignmentRate,
      resolutionRate,
      trend,
      assignmentTrend,
      bySubject,
      recentTests,
      strongestStudents,
      facultyActivity,
      completedSubmissions,
      resolvedDoubts,
    };
  }, [filters]);

  const hasData = data.scopedStudents.length > 0;
  const clearFilters = () =>
    setFilters({ range: "Last 30 Days", course: "All", batch: "All", faculty: "All", subject: "All" });
  const scoreAverage = average(data.scoreValues);
  const topSubject = [...data.bySubject].sort((a, b) => b.value - a.value)[0];

  const stats = [
    { label: "Total Students", value: data.scopedStudents.length, change: "In selected scope", trend: "up" },
    { label: "Average Test Score", value: `${formatNumber(scoreAverage)}%`, change: `${data.scopedResults.length} result records`, trend: scoreAverage >= 60 ? "up" : "down" },
    { label: "Assignment Completion", value: `${data.assignmentRate}%`, change: `${data.completedSubmissions.length} submissions tracked`, trend: data.assignmentRate >= 70 ? "up" : "down" },
    { label: "Top Subject", value: topSubject ? topSubject.label : "—", change: topSubject ? `${topSubject.value}% average` : "No subject data", trend: "up" },
    { label: "Strong Students", value: data.strongestStudents.length, change: "Above 60% average", trend: "up" },
    { label: "Doubt Resolution", value: `${data.resolutionRate}%`, change: `${data.resolvedDoubts} resolved`, trend: data.resolutionRate >= 70 ? "up" : "down" },
  ];

  return (
    <div>
      <PageHeader
        title="Academic Analytics"
        subtitle="How are students performing academically?"
      />

      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between gap-3 mb-3">
          <p className="text-sm font-semibold text-neutral-800">Analytics filters</p>
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            Clear filters
          </button>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          <select
            aria-label="Date range"
            value={filters.range}
            onChange={(event) => setFilter("range", event.target.value)}
            className={inputClass}
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>All Time</option>
          </select>
          <select
            aria-label="Course"
            value={filters.course}
            onChange={(event) => setFilter("course", event.target.value)}
            className={inputClass}
          >
            <option value="All">All Courses</option>
            {courses.map((course) => (
              <option key={course.id}>{course.name}</option>
            ))}
          </select>
          <select
            aria-label="Batch"
            value={filters.batch}
            onChange={(event) => setFilter("batch", event.target.value)}
            className={inputClass}
          >
            <option value="All">All Batches</option>
            {batches.map((batch) => (
              <option key={batch.id}>{batch.name}</option>
            ))}
          </select>
          <select
            aria-label="Faculty"
            value={filters.faculty}
            onChange={(event) => setFilter("faculty", event.target.value)}
            className={inputClass}
          >
            <option value="All">All Faculty</option>
            {faculty.map((member) => (
              <option key={member.id}>{member.name}</option>
            ))}
          </select>
          <select
            aria-label="Subject"
            value={filters.subject}
            onChange={(event) => setFilter("subject", event.target.value)}
            className={inputClass}
          >
            <option value="All">All Subjects</option>
            {[...new Set([
              ...tests.map((test) => test.subject),
              ...assignments.map((assignment) => assignment.subject),
              ...doubts.map((doubt) => doubt.subject),
            ])].map((subject) => (
              <option key={subject}>{subject}</option>
            ))}
          </select>
        </div>
      </div>

      {!hasData ? (
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm">
          <EmptyState
            title="No academic analytics available"
            message="No academic data matches the selected filters."
            actionLabel="Clear Filters"
            onAction={clearFilters}
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-6">
            <Panel
              title="Academic performance trend"
              subtitle="Average test-score movement and assignment completion over time."
              className="xl:col-span-3"
            >
              <LineChart
                points={data.trend.map((point) => point.score)}
                secondPoints={data.assignmentTrend.map((point) => point.completion)}
                labels={data.trend.map((point) => point.label)}
                firstLabel="Average test score"
                secondLabel="Assignment completion"
              />
            </Panel>

            <Panel
              title="Subject performance"
              subtitle="Average score by subject in the selected scope."
              className="xl:col-span-2"
            >
              <BarChart items={data.bySubject.length ? data.bySubject : [{ label: "No data", value: 0 }]} />
            </Panel>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Panel
              title="Recent tests"
              subtitle="Latest assessments with available academic performance results."
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-sm text-left">
                  <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs">
                    <tr>
                      <th className="px-5 py-3">Test</th>
                      <th className="px-5 py-3">Batch</th>
                      <th className="px-5 py-3">Average</th>
                      <th className="px-5 py-3">Highest</th>
                      <th className="px-5 py-3">Attempts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {data.recentTests.map((test) => (
                      <tr key={test.id}>
                        <td className="px-5 py-3 font-medium text-neutral-800 min-w-48">
                          {test.name}
                        </td>
                        <td className="px-5 py-3 text-neutral-600">{test.batch}</td>
                        <td className="px-5 py-3">
                          <StatusBadge status={test.average >= 60 ? "Pass" : "Fail"} />
                          <span className="ml-1">{test.average}%</span>
                        </td>
                        <td className="px-5 py-3 text-neutral-600">{test.highest}%</td>
                        <td className="px-5 py-3 text-neutral-600">{test.attempts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            <Panel
              title="Strongest students"
              subtitle="Students with the highest average academic performance in the current selection."
            >
              <div className="divide-y divide-neutral-100">
                {data.strongestStudents.length ? (
                  data.strongestStudents.map((student) => (
                    <div
                      key={student.id}
                      className="px-5 py-3 flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-neutral-800">{student.name}</p>
                        <p className="text-xs text-neutral-500">{student.batch}</p>
                      </div>
                      <span className="text-sm font-semibold text-brand-700">{student.avgScore}%</span>
                    </div>
                  ))
                ) : (
                  <p className="px-5 py-4 text-sm text-neutral-500">
                    No student performance records match these filters.
                  </p>
                )}
              </div>
            </Panel>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Panel
              title="Assignment activity"
              subtitle="Academic submission progress for the selected scope."
            >
              <Donut
                center={`${data.assignmentRate}%`}
                segments={[
                  {
                    label: "Submitted",
                    value: data.completedSubmissions.filter((entry) => entry.status === "Submitted")
                      .length,
                    color: "#5b21b6",
                  },
                  {
                    label: "Pending",
                    value: data.completedSubmissions.filter((entry) => entry.status === "Pending")
                      .length,
                    color: "#f59e0b",
                  },
                ]}
              />
              <div className="px-5 pb-5 grid grid-cols-3 gap-3 text-center text-xs">
                <div>
                  <p className="text-lg font-bold text-neutral-800">{data.scopedAssignments.length}</p>
                  <p className="text-neutral-500">Assignments</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-neutral-800">
                    {data.completedSubmissions.filter((entry) => entry.status === "Submitted").length}
                  </p>
                  <p className="text-neutral-500">Completed</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-neutral-800">
                    {data.completedSubmissions.filter((entry) => entry.status === "Pending").length}
                  </p>
                  <p className="text-neutral-500">Pending</p>
                </div>
              </div>
            </Panel>

            <Panel
              title="Doubt resolution"
              subtitle="Academic support queue health by status and priority."
            >
              <Donut
                center={`${data.resolutionRate}%`}
                segments={[
                  {
                    label: "Resolved",
                    value: data.scopedDoubts.filter((doubt) => doubt.status === "Resolved").length,
                    color: "#10b981",
                  },
                  {
                    label: "In progress",
                    value: data.scopedDoubts.filter((doubt) => doubt.status === "In Progress").length,
                    color: "#f59e0b",
                  },
                  {
                    label: "Open",
                    value: data.scopedDoubts.filter((doubt) => doubt.status === "Open").length,
                    color: "#ef4444",
                  },
                ]}
              />
              <div className="px-5 pb-5 flex gap-2 flex-wrap">
                {["High", "Medium", "Low"].map((priority) => (
                  <span
                    key={priority}
                    className="px-3 py-1.5 rounded-lg bg-neutral-50 text-xs text-neutral-600"
                  >
                    {priority}:{" "}
                    <strong className="text-neutral-800">
                      {data.scopedDoubts.filter((doubt) => doubt.priority === priority).length}
                    </strong>
                  </span>
                ))}
              </div>
            </Panel>
          </div>

          <Panel
            title="Academic insights"
            subtitle="Signals generated from the records in this filtered view."
            className="mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-5">
              <div className="rounded-lg bg-green-50 border border-green-100 p-4">
                <p className="text-xs font-semibold uppercase text-green-700">Positive</p>
                <p className="text-sm text-green-900 mt-2">
                  {topSubject
                    ? `${topSubject.label} leads academic performance at ${topSubject.value}%.`
                    : "Academic records are still being collected."}
                </p>
              </div>
              <div className="rounded-lg bg-yellow-50 border border-yellow-100 p-4">
                <p className="text-xs font-semibold uppercase text-yellow-700">Attention</p>
                <p className="text-sm text-yellow-900 mt-2">
                  {data.strongestStudents[0]
                    ? `${data.strongestStudents[0].name} is currently the strongest performer in this view.`
                    : "No high-performing student has been identified for this scope."}
                </p>
              </div>
              <div className="rounded-lg bg-blue-50 border border-blue-100 p-4">
                <p className="text-xs font-semibold uppercase text-blue-700">Student support</p>
                <p className="text-sm text-blue-900 mt-2">
                  {data.scopedDoubts.length
                    ? `${data.resolutionRate}% of raised doubts are resolved in this view.`
                    : "No support requests match the current filters."}
                </p>
              </div>
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}

export default Analytics;