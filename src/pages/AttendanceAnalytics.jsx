import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import EmptyState from "../components/EmptyState";
import {
  AnalyticsFilters,
  AnalyticsSection,
  BarList,
  Donut,
  LineChart,
} from "../components/AnalyticsPrimitives";
import { percent, periodMatch, periodOptions } from "../utils/analyticsUtils";
import { students } from "../data/studentsData";
import { batches } from "../data/batchesData";
import { attendanceRecords } from "../data/attendanceData";

function AttendanceAnalytics() {
  const [filters, setFilters] = useState({
    period: "Last 30 Days",
    course: "All",
    batch: "All",
  });
  const setFilter = (name, value) =>
    setFilters((current) => ({ ...current, [name]: value }));
  const data = useMemo(() => {
    const scopedStudents = students.filter(
      (student) =>
        (filters.course === "All" || student.course === filters.course) &&
        (filters.batch === "All" || student.batch === filters.batch),
    );
    const ids = new Set(scopedStudents.map((student) => student.id));
    const records = attendanceRecords.filter(
      (record) =>
        ids.has(record.studentId) && periodMatch(record.date, filters.period),
    );
    const attendancePercentage = (attendance) =>
      attendance.length
        ? (attendance.filter((record) => record.status === "Present").length /
            attendance.length) *
          100
        : 0;
    const batchMetrics = batches
      .filter((batch) =>
        scopedStudents.some((student) => student.batch === batch.name),
      )
      .map((batch) => ({
        label: batch.name,
        value: attendancePercentage(
          records.filter((record) => record.batchId === batch.id),
        ),
      }));
    const statuses = ["Present", "Absent", "Late", "Leave"].map((status) => ({
      label: status,
      value: records.filter((record) => record.status === status).length,
      color: {
        Present: "#10b981",
        Absent: "#ef4444",
        Late: "#f59e0b",
        Leave: "#94a3b8",
      }[status],
    }));
    const dates = [...new Set(records.map((record) => record.date))]
      .sort()
      .slice(-6);
    const trend = dates.map((date) => ({
      label: date.slice(5),
      attendance: Math.round(
        attendancePercentage(records.filter((record) => record.date === date)),
      ),
    }));
    const lowAttendance = scopedStudents
      .map((student) => ({
        ...student,
        measured: attendancePercentage(
          records.filter((record) => record.studentId === student.id),
        ),
      }))
      .filter(
        (student) =>
          student.measured < 75 &&
          records.some((record) => record.studentId === student.id),
      )
      .sort((a, b) => a.measured - b.measured);
    return {
      scopedStudents,
      records,
      batchMetrics,
      statuses,
      trend,
      lowAttendance,
    };
  }, [filters]);
  const clearFilters = () =>
    setFilters({ period: "Last 30 Days", course: "All", batch: "All" });
  const rate = data.records.length
    ? (data.records.filter((record) => record.status === "Present").length /
        data.records.length) *
      100
    : 0;
  return (
    <div>
      <PageHeader
        title="Attendance Analytics"
        subtitle="Attendance health, trends, and low-attendance signals across batches."
      />
      <AnalyticsFilters
        filters={filters}
        setFilter={setFilter}
        onClear={clearFilters}
        options={[
          { name: "period", label: "Time period", values: periodOptions },
          {
            name: "course",
            label: "Course",
            values: [
              "All",
              ...new Set(students.map((student) => student.course)),
            ],
          },
          {
            name: "batch",
            label: "Batch",
            values: ["All", ...batches.map((batch) => batch.name)],
          },
        ]}
      />
      {!data.scopedStudents.length ? (
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm">
          <EmptyState
            title="No attendance data"
            message="No students match the selected filters."
            actionLabel="Clear Filters"
            onAction={clearFilters}
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              {
                label: "Overall attendance",
                value: percent(rate),
                change: `${data.records.length} records measured`,
                trend: rate >= 75 ? "up" : "down",
              },
              {
                label: "Present records",
                value: data.statuses[0].value,
                change: "Recorded as present",
                trend: "up",
              },
              {
                label: "Low-attendance students",
                value: data.lowAttendance.length,
                change: "Below 75%",
                trend: data.lowAttendance.length ? "down" : "up",
              },
            ].map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-6">
            <AnalyticsSection
              title="Attendance trend"
              subtitle="Daily average across filtered records."
              className="xl:col-span-3"
            >
              <LineChart
                points={data.trend}
                lines={[
                  { key: "attendance", label: "Attendance", color: "#5b21b6" },
                ]}
              />
            </AnalyticsSection>
            <AnalyticsSection
              title="Attendance breakdown"
              subtitle="Record counts by status."
              className="xl:col-span-2"
            >
              <Donut center={percent(rate)} segments={data.statuses} />
            </AnalyticsSection>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <AnalyticsSection
              title="Attendance by batch"
              subtitle="Presence rate by batch."
            >
              <BarList items={data.batchMetrics} color="bg-emerald-500" />
            </AnalyticsSection>
            <AnalyticsSection
              title="Low-attendance students"
              subtitle="Students below 75% across measured records."
            >
              {data.lowAttendance.length ? (
                <div className="divide-y divide-neutral-100">
                  {data.lowAttendance.map((student) => (
                    <div
                      key={student.id}
                      className="px-5 py-3 flex justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-neutral-800">
                          {student.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {student.batch}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-red-600">
                        {percent(student.measured)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="px-5 pb-5 pt-4 text-sm text-neutral-500">
                  No students fall below 75%.
                </p>
              )}
            </AnalyticsSection>
          </div>
        </>
      )}
    </div>
  );
}

export default AttendanceAnalytics;
