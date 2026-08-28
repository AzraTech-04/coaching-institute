import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import EmptyState from "../components/EmptyState";
import {
  AnalyticsFilters,
  AnalyticsSection,
  BarList,
  Donut,
} from "../components/AnalyticsPrimitives";
import { percent } from "../utils/analyticsUtils";
import { batches } from "../data/batchesData";
import { students } from "../data/studentsData";
import { faculty } from "../data/facultyData";
import { courses } from "../data/coursesData";

function BatchAnalytics() {
  const [filters, setFilters] = useState({ course: "All", status: "All" });
  const setFilter = (name, value) =>
    setFilters((current) => ({ ...current, [name]: value }));
  const data = useMemo(() => {
    const scopedBatches = batches.filter(
      (batch) =>
        (filters.course === "All" || batch.course === filters.course) &&
        (filters.status === "All" || batch.status === filters.status),
    );
    const metrics = scopedBatches.map((batch) => ({
      ...batch,
      enrolled: students.filter((student) => student.batch === batch.name)
        .length,
      utilization: batch.capacity
        ? (students.filter((student) => student.batch === batch.name).length /
            batch.capacity) *
          100
        : 0,
    }));
    const facultyMetrics = faculty
      .filter((member) =>
        metrics.some((batch) => batch.facultyId === member.id),
      )
      .map((member) => ({
        ...member,
        batches: metrics.filter((batch) => batch.facultyId === member.id)
          .length,
        students: metrics
          .filter((batch) => batch.facultyId === member.id)
          .reduce((sum, batch) => sum + batch.enrolled, 0),
      }));
    return { metrics, facultyMetrics };
  }, [filters]);
  const clearFilters = () => setFilters({ course: "All", status: "All" });
  const active = data.metrics.filter(
    (batch) => batch.status === "Active",
  ).length;
  const totalCapacity = data.metrics.reduce(
    (sum, batch) => sum + batch.capacity,
    0,
  );
  const enrolled = data.metrics.reduce((sum, batch) => sum + batch.enrolled, 0);
  return (
    <div>
      <PageHeader
        title="Batch Analytics"
        subtitle="Capacity, occupancy, status, and faculty workload across learning groups."
      />
      <AnalyticsFilters
        filters={filters}
        setFilter={setFilter}
        onClear={clearFilters}
        options={[
          {
            name: "course",
            label: "Course",
            values: ["All", ...courses.map((course) => course.name)],
          },
          {
            name: "status",
            label: "Status",
            values: ["All", "Active", "Inactive"],
          },
        ]}
      />
      {!data.metrics.length ? (
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm">
          <EmptyState
            title="No batch data"
            message="No batches match the selected filters."
            actionLabel="Clear Filters"
            onAction={clearFilters}
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Total batches",
                value: data.metrics.length,
                change: "Batches in scope",
                trend: "up",
              },
              {
                label: "Active batches",
                value: active,
                change: `${data.metrics.length - active} inactive`,
                trend: "up",
              },
              {
                label: "Enrolled students",
                value: enrolled,
                change: `of ${totalCapacity} available seats`,
                trend: "up",
              },
              {
                label: "Overall utilization",
                value: percent(
                  totalCapacity ? (enrolled / totalCapacity) * 100 : 0,
                ),
                change: `${totalCapacity - enrolled} seats available`,
                trend: "up",
              },
            ].map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-6">
            <AnalyticsSection
              title="Batch occupancy"
              subtitle="Enrolled students against configured capacity."
              className="xl:col-span-3"
            >
              <BarList
                items={data.metrics.map((batch) => ({
                  label: batch.name,
                  value: batch.utilization,
                }))}
                valueLabel={(item) => `${percent(item.value)} occupied`}
                color="bg-brand-600"
              />
            </AnalyticsSection>
            <AnalyticsSection
              title="Batch status"
              subtitle="Active and inactive configured batches."
            >
              <Donut
                center={data.metrics.length}
                segments={[
                  { label: "Active", value: active, color: "#10b981" },
                  {
                    label: "Inactive",
                    value: data.metrics.length - active,
                    color: "#94a3b8",
                  },
                ]}
              />
            </AnalyticsSection>
          </div>
          <AnalyticsSection
            title="Batch capacity and faculty workload"
            subtitle="Each batch uses existing enrollment, capacity, and faculty assignments."
            className="mb-6"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm text-left">
                <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs">
                  <tr>
                    <th className="px-5 py-3">Batch</th>
                    <th className="px-5 py-3">Course</th>
                    <th className="px-5 py-3">Students</th>
                    <th className="px-5 py-3">Available seats</th>
                    <th className="px-5 py-3">Utilization</th>
                    <th className="px-5 py-3">Faculty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {data.metrics.map((batch) => (
                    <tr key={batch.id}>
                      <td className="px-5 py-3 font-medium text-neutral-800">
                        {batch.name}
                      </td>
                      <td className="px-5 py-3 text-neutral-600">
                        {batch.course}
                      </td>
                      <td className="px-5 py-3 text-neutral-600">
                        {batch.enrolled}
                      </td>
                      <td className="px-5 py-3 text-neutral-600">
                        {Math.max(batch.capacity - batch.enrolled, 0)}
                      </td>
                      <td className="px-5 py-3 text-neutral-600">
                        {percent(batch.utilization)}
                      </td>
                      <td className="px-5 py-3 text-neutral-600">
                        {batch.facultyName}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-neutral-100 px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {data.facultyMetrics.map((member) => (
                <div key={member.id} className="text-sm">
                  <p className="font-medium text-neutral-800">{member.name}</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {member.students} students across {member.batches} batch
                    {member.batches === 1 ? "" : "es"}
                  </p>
                </div>
              ))}
            </div>
          </AnalyticsSection>
        </>
      )}
    </div>
  );
}

export default BatchAnalytics;
