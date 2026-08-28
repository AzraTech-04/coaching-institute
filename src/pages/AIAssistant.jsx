import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import { students } from "../data/studentsData";
import { attendanceRecords } from "../data/attendanceData";
import { tests } from "../data/testsData";
import { results } from "../data/resultsData";
import { feeRecords } from "../data/feesData";
import { counsellingRecords } from "../data/counsellingData";
import { leads } from "../data/leadsData";
import { doubts } from "../data/doubtsData";

const TODAY = "2026-08-22";
const prompts = [
  "Which students need attention?",
  "Show students with low attendance",
  "Who is performing poorly?",
  "Which students have upcoming tests?",
  "Show pending fee follow-ups",
  "Give me today's important actions",
];

function Card({ title, subtitle, children, className = "" }) {
  return (
    <section
      className={`bg-white border border-neutral-200 rounded-xl shadow-sm ${className}`}
    >
      <div className="px-5 pt-5">
        <h2 className="text-base font-semibold text-neutral-800">{title}</h2>
        {subtitle && (
          <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function Icon({ type }) {
  const paths = {
    spark:
      "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zm7 12l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15z",
    alert:
      "M12 9v4m0 4h.01M10.3 3.8L2.7 17a2 2 0 001.7 3h15.2a2 2 0 001.7-3L13.7 3.8a2 2 0 00-3.4 0z",
    chart: "M4 19V5m0 14h16M8 15l3-4 3 2 5-7",
    calendar:
      "M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z",
    money: "M3 7h18v12H3zM7 7V5h10v2m-6 6h2",
    users:
      "M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2m14-11a4 4 0 11-8 0 4 4 0 018 0zm4 11v-2a4 4 0 00-3-3.87M18 3.13a4 4 0 010 7.75",
  };
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d={paths[type] || paths.spark}
      />
    </svg>
  );
}

function feeForStudent(studentId) {
  const fee = feeRecords.find((record) => record.studentId === studentId);
  if (!fee) return null;
  const paid = fee.paymentHistory.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );
  const overdue = paid < fee.totalFee && fee.dueDate < TODAY;
  return {
    ...fee,
    paid,
    remaining: fee.totalFee - paid,
    status:
      paid >= fee.totalFee
        ? "Paid"
        : overdue
          ? "Overdue"
          : paid
            ? "Partially Paid"
            : "Pending",
  };
}

function attendanceForStudent(studentId) {
  const records = attendanceRecords.filter(
    (record) => record.studentId === studentId,
  );
  return {
    records,
    percentage: records.length
      ? (records.filter((record) => record.status === "Present").length /
          records.length) *
        100
      : null,
  };
}

function scoreForStudent(studentId) {
  const studentResults = results.filter(
    (result) => result.studentId === studentId,
  );
  return {
    records: studentResults,
    percentage: studentResults.length
      ? studentResults.reduce(
          (sum, result) =>
            sum + (result.marksObtained / result.totalMarks) * 100,
          0,
        ) / studentResults.length
      : null,
  };
}

function AIAssistant() {
  const [selectedStudentId, setSelectedStudentId] = useState(6);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Good morning. I can help you review attendance, performance, tests, fee follow-ups, and student actions using the institute records.",
    },
  ]);
  const messagesContainerRef = useRef(null);
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages]);
  const selectedStudent = students.find(
    (student) => student.id === Number(selectedStudentId),
  );
  const derived = useMemo(() => {
    const studentSignals = students.map((student) => ({
      student,
      attendance: attendanceForStudent(student.id),
      score: scoreForStudent(student.id),
      fee: feeForStudent(student.id),
    }));
    const lowAttendance = studentSignals.filter(
      (item) =>
        item.attendance.percentage !== null && item.attendance.percentage < 75,
    );
    const poorPerformance = studentSignals.filter(
      (item) => (item.score.percentage ?? item.student.avgScore) < 60,
    );
    const feeFollowUps = studentSignals.filter(
      (item) =>
        item.fee &&
        ["Pending", "Overdue", "Partially Paid"].includes(item.fee.status),
    );
    const upcomingTests = tests.filter(
      (test) =>
        test.date >= TODAY && ["Scheduled", "Ongoing"].includes(test.status),
    );
    const pendingFollowUps =
      leads.filter((lead) => ["New", "Follow-up"].includes(lead.status))
        .length +
      counsellingRecords.filter(
        (record) => record.status === "Follow-up Required",
      ).length;
    const unresolvedDoubts = doubts.filter(
      (doubt) => doubt.status !== "Resolved",
    );
    return {
      studentSignals,
      lowAttendance,
      poorPerformance,
      feeFollowUps,
      upcomingTests,
      pendingFollowUps,
      unresolvedDoubts,
    };
  }, []);
  const studentSignal = derived.studentSignals.find(
    (item) => item.student.id === Number(selectedStudentId),
  );
  const selectedTests = tests.filter((test) =>
    studentSignal?.score.records.some((result) => result.testId === test.id),
  );
  const attentionCount = new Set([
    ...derived.lowAttendance.map((item) => item.student.id),
    ...derived.poorPerformance.map((item) => item.student.id),
    ...derived.feeFollowUps
      .filter((item) => item.fee.status === "Overdue")
      .map((item) => item.student.id),
  ]).size;
  const insights = [
    ...derived.lowAttendance.slice(0, 1).map((item) => ({
      type: "alert",
      category: "Attendance Alert",
      title: `${item.student.name} is below the attendance threshold`,
      detail: `${Math.round(item.attendance.percentage)}% attendance across ${item.attendance.records.length} recorded sessions.`,
      priority: "High",
      action: "Review attendance history",
      actionPath: "/attendance",
    })),
    ...derived.poorPerformance.slice(0, 1).map((item) => ({
      type: "chart",
      category: "Performance Alert",
      title: `${item.student.name} needs academic support`,
      detail: `${Math.round(item.score.percentage ?? item.student.avgScore)}% average performance in available records.`,
      priority: "High",
      action: "Review recent results",
      actionPath: "/academics/results",
    })),
    ...derived.upcomingTests.slice(0, 1).map((test) => ({
      type: "calendar",
      category: "Upcoming Test",
      title: `${test.name} is scheduled`,
      detail: `${test.course} | ${test.batch} | ${test.date}`,
      priority: "Medium",
      action: "Prepare test checklist",
      actionPath: "/tests",
    })),
    ...derived.feeFollowUps
      .filter((item) => item.fee.status === "Overdue")
      .slice(0, 1)
      .map((item) => ({
        type: "money",
        category: "Fee Follow-up",
        title: `${item.student.name} has an overdue balance`,
        detail: `Rs ${item.fee.remaining.toLocaleString("en-IN")} remains from the current fee record.`,
        priority: "High",
        action: "Review payment history",
        actionPath: "/fees",
      })),
  ];
  const stats = [
    {
      label: "Students Needing Attention",
      value: attentionCount,
      change: "Attendance, score, or fee signal",
      trend: attentionCount ? "down" : "up",
    },
    {
      label: "Low Attendance Alerts",
      value: derived.lowAttendance.length,
      change: "Below 75% measured attendance",
      trend: derived.lowAttendance.length ? "down" : "up",
    },
    {
      label: "Upcoming Tests",
      value: derived.upcomingTests.length,
      change: "Scheduled or ongoing",
      trend: "up",
    },
    {
      label: "Pending Follow-ups",
      value: derived.pendingFollowUps,
      change: "Leads and counselling records",
      trend: derived.pendingFollowUps ? "down" : "up",
    },
  ];

  function responseFor(input) {
    const normalized = input.toLowerCase();
    if (normalized.includes("need attention"))
      return (
        derived.studentSignals
          .filter(
            (item) =>
              item.attendance.percentage < 75 ||
              (item.score.percentage ?? item.student.avgScore) < 60 ||
              item.fee?.status === "Overdue",
          )
          .map((item) => item.student.name)
          .join(", ") || "No students currently match the attention conditions."
      );
    if (normalized.includes("low attendance"))
      return (
        derived.lowAttendance
          .map(
            (item) =>
              `${item.student.name} (${Math.round(item.attendance.percentage)}%)`,
          )
          .join(", ") || "No students are below 75% attendance."
      );
    if (
      normalized.includes("performing poorly") ||
      normalized.includes("poorly")
    )
      return (
        derived.poorPerformance
          .map(
            (item) =>
              `${item.student.name} (${Math.round(item.score.percentage ?? item.student.avgScore)}%)`,
          )
          .join(", ") ||
        "No students are below the current performance threshold."
      );
    if (normalized.includes("upcoming test"))
      return (
        derived.upcomingTests
          .map((test) => `${test.name} on ${test.date}`)
          .join("; ") ||
        "There are no scheduled or ongoing tests from the current records."
      );
    if (normalized.includes("pending fee"))
      return (
        derived.feeFollowUps
          .map((item) => `${item.student.name} (${item.fee.status})`)
          .join(", ") || "No pending fee follow-ups found."
      );
    if (normalized.includes("focus") || normalized.includes("today"))
      return `Prioritize ${derived.lowAttendance.length} attendance alert(s), ${derived.poorPerformance.length} performance alert(s), ${derived.feeFollowUps.filter((item) => item.fee.status === "Overdue").length} overdue fee follow-up(s), and ${derived.upcomingTests.length} upcoming test(s).`;
    return "I'm currently optimized for institute-related insights such as attendance, performance, tests, fees, and student follow-ups.";
  }

  function sendMessage(text = query) {
    const clean = text.trim();
    if (!clean) return;
    setMessages((current) => [
      ...current,
      { role: "user", text: clean },
      { role: "assistant", text: responseFor(clean) },
    ]);
    setQuery("");
  }

  const studentAttendance = studentSignal?.attendance.percentage;
  const studentScore =
    studentSignal?.score.percentage ?? selectedStudent?.avgScore ?? 0;
  const studentFee = studentSignal?.fee;
  const strengths = selectedStudent
    ? [
        studentScore >= 75 ? "Strong academic performance" : null,
        studentAttendance >= 85 ? "Consistent attendance" : null,
        studentFee?.status === "Paid" ? "Fee account is up to date" : null,
      ].filter(Boolean)
    : [];
  const concerns = selectedStudent
    ? [
        studentAttendance !== null && studentAttendance < 75
          ? "Attendance is below the recommended level"
          : null,
        studentScore < 60 ? "Recent performance needs support" : null,
        studentFee && studentFee.status !== "Paid"
          ? `${studentFee.status} fee account`
          : null,
      ].filter(Boolean)
    : [];

  return (
    <div>
      <PageHeader
        title="AI Assistant"
        subtitle="Get intelligent insights and recommendations across your institute."
      />
      <div className="flex items-center gap-3 bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 mb-6 text-brand-800">
        <span className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-brand-600">
          <Icon type="spark" />
        </span>
        <div>
          <p className="text-sm font-semibold">Aravya AI is ready</p>
          <p className="text-xs text-brand-700">
            Insights are calculated from your existing institute records.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-6">
        <Card
          title="Today's AI Insights"
          subtitle="Prioritized signals found in the current records."
          className="xl:col-span-3"
        >
          <div className="divide-y divide-neutral-100">
            {insights.length ? (
              insights.map((insight) => (
                <div key={insight.title} className="px-5 py-4 flex gap-3">
                  <span className="w-9 h-9 rounded-lg bg-neutral-100 text-brand-600 flex items-center justify-center shrink-0">
                    <Icon type={insight.type} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-semibold uppercase text-neutral-500">
                        {insight.category}
                      </p>
                      <StatusBadge status={insight.priority} />
                    </div>
                    <p className="text-sm font-semibold text-neutral-800 mt-1">
                      {insight.title}
                    </p>
                    <p className="text-sm text-neutral-600 mt-1">
                      {insight.detail}
                    </p>
                    <Link
                      to={insight.actionPath}
                      className="inline-flex text-xs font-medium text-brand-600 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded mt-2"
                    >
                      {insight.action} →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="px-5 py-8 text-sm text-neutral-500">
                No priority insights found in the current records.
              </p>
            )}
          </div>
        </Card>
        <Card
          title="Recommended Actions"
          subtitle="Practical next steps based on available signals."
          className="xl:col-span-2"
        >
          <div className="p-5 space-y-3">
            {[
              {
                text: "Follow up with low-attendance students",
                count: derived.lowAttendance.length,
                priority: "High",
              },
              {
                text: "Review students below performance threshold",
                count: derived.poorPerformance.length,
                priority: "High",
              },
              {
                text: "Contact overdue fee accounts",
                count: derived.feeFollowUps.filter(
                  (item) => item.fee.status === "Overdue",
                ).length,
                priority: "High",
              },
              {
                text: "Prepare for upcoming tests",
                count: derived.upcomingTests.length,
                priority: "Medium",
              },
              {
                text: "Review unresolved student doubts",
                count: derived.unresolvedDoubts.length,
                priority: "Medium",
              },
            ].map((action) => (
              <div
                key={action.text}
                className="flex items-start justify-between gap-3 border border-neutral-100 rounded-lg p-3"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-800">
                    {action.text}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {action.count} record{action.count === 1 ? "" : "s"}{" "}
                    identified
                  </p>
                </div>
                <StatusBadge status={action.priority} />
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-6">
        <Card
          title="Student AI Summary"
          subtitle="Select a student for a record-based assessment."
          className="xl:col-span-2"
        >
          <div className="p-5">
            <label
              htmlFor="student-select"
              className="text-xs font-medium text-neutral-600"
            >
              Student
            </label>
            <select
              id="student-select"
              value={selectedStudentId}
              onChange={(event) => setSelectedStudentId(event.target.value)}
              className="w-full mt-1 px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
            {selectedStudent ? (
              <div className="mt-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-neutral-800">
                      AI Summary for {selectedStudent.name}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {selectedStudent.course} | {selectedStudent.batch}
                    </p>
                  </div>
                  <StatusBadge
                    status={concerns.length ? "Pending" : "Active"}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-neutral-50 rounded-lg p-3">
                    <p className="text-xs text-neutral-500">Attendance</p>
                    <p className="text-lg font-bold text-neutral-800 mt-1">
                      {studentAttendance === null
                        ? "No data"
                        : `${Math.round(studentAttendance)}%`}
                    </p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-3">
                    <p className="text-xs text-neutral-500">Performance</p>
                    <p className="text-lg font-bold text-neutral-800 mt-1">
                      {Math.round(studentScore)}%
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-neutral-500">
                      Strengths
                    </p>
                    <p className="text-sm text-neutral-700 mt-1">
                      {strengths.length
                        ? strengths.join("; ")
                        : "More records are needed to identify a strength."}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-neutral-500">
                      Areas requiring attention
                    </p>
                    <p className="text-sm text-neutral-700 mt-1">
                      {concerns.length
                        ? concerns.join("; ")
                        : "No immediate concerns detected."}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-neutral-500">
                      Fee status
                    </p>
                    <p className="text-sm text-neutral-700 mt-1">
                      {studentFee
                        ? `${studentFee.status} | Rs ${studentFee.remaining.toLocaleString("en-IN")} remaining`
                        : "No fee record available."}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState
                title="Select a student"
                message="Student context will appear here."
              />
            )}
          </div>
        </Card>
        <Card
          title="Ask Aravya"
          subtitle="Use a suggested prompt or ask an institute-related question."
          className="xl:col-span-3"
        >
          <div className="h-[24rem] flex flex-col">
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-5 space-y-3"
            >
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-sm ${message.role === "user" ? "bg-brand-600 text-white" : "bg-neutral-100 text-neutral-700"}`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 pb-3 flex flex-wrap gap-2">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="px-2.5 py-1.5 rounded-lg border border-neutral-200 text-xs text-neutral-600 hover:border-brand-300 hover:text-brand-700"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage();
              }}
              className="border-t border-neutral-100 p-4 flex gap-2"
            >
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ask about institute records..."
                aria-label="Ask the AI Assistant"
                className="min-w-0 flex-1 px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg"
              >
                Send
              </button>
            </form>
          </div>
        </Card>
      </div>
      <Card
        title="Recent AI Activity"
        subtitle="A lightweight prototype activity trail."
        className="mb-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-5">
          {[
            "Attendance analysis generated",
            "Student performance summary viewed",
            "Fee follow-up recommendation generated",
            "Batch performance reviewed",
          ].map((activity) => (
            <div
              key={activity}
              className="flex items-center gap-2 text-sm text-neutral-600"
            >
              <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
              {activity}
            </div>
          ))}
        </div>
      </Card>
      {selectedTests.length > 0 && (
        <p className="sr-only">
          Selected student has {selectedTests.length} linked test records.
        </p>
      )}
    </div>
  );
}

export default AIAssistant;
