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
import { leads } from "../data/leadsData";
import { counsellingRecords } from "../data/counsellingData";
import { admissionsRecords } from "../data/admissionsData";
import { courses } from "../data/coursesData";

function LeadConversion() {
  const [filters, setFilters] = useState({
    period: "Last 30 Days",
    course: "All",
  });
  const setFilter = (name, value) =>
    setFilters((current) => ({ ...current, [name]: value }));
  const data = useMemo(() => {
    const courseMatch = (item) =>
      filters.course === "All" || item.course === filters.course;
    const scopedLeads = leads.filter(courseMatch);
    const scopedCounselling = counsellingRecords.filter(
      (record) =>
        courseMatch(record) && periodMatch(record.date, filters.period),
    );
    const scopedAdmissions = admissionsRecords.filter(
      (record) =>
        courseMatch(record) &&
        periodMatch(record.admissionDate, filters.period),
    );
    const statuses = ["New", "Contacted", "Follow-up", "Converted", "Lost"].map(
      (status) => ({
        label: status,
        value: scopedLeads.filter((lead) => lead.status === status).length,
        color: {
          New: "#5b21b6",
          Contacted: "#3b82f6",
          "Follow-up": "#f59e0b",
          Converted: "#10b981",
          Lost: "#ef4444",
        }[status],
      }),
    );
    const trendDates = [
      ...new Set([
        ...scopedCounselling.map((record) => record.date),
        ...scopedAdmissions.map((record) => record.admissionDate),
      ]),
    ]
      .sort()
      .slice(-6);
    const trend = trendDates.map((date) => ({
      label: date.slice(5),
      conversions: scopedAdmissions.filter(
        (record) => record.admissionDate === date,
      ).length,
      counselling: scopedCounselling.filter((record) => record.date === date)
        .length,
    }));
    const coursePerformance = [
      ...new Set(scopedLeads.map((lead) => lead.course)),
    ].map((course) => ({
      label: course,
      value: scopedLeads.filter(
        (lead) => lead.course === course && lead.status === "Converted",
      ).length,
    }));
    return {
      scopedLeads,
      scopedCounselling,
      scopedAdmissions,
      statuses,
      trend,
      coursePerformance,
    };
  }, [filters]);
  const clearFilters = () =>
    setFilters({ period: "Last 30 Days", course: "All" });
  const converted =
    data.statuses.find((status) => status.label === "Converted")?.value || 0;
  const conversionRate = data.scopedLeads.length
    ? (converted / data.scopedLeads.length) * 100
    : 0;
  return (
    <div>
      <PageHeader
        title="Lead Conversion"
        subtitle="Track the journey from enquiry and counselling to confirmed admission."
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
            values: ["All", ...courses.map((course) => course.name)],
          },
        ]}
      />
      {!data.scopedLeads.length ? (
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm">
          <EmptyState
            title="No lead data"
            message="No leads match the selected course."
            actionLabel="Clear Filters"
            onAction={clearFilters}
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Total leads",
                value: data.scopedLeads.length,
                change: "Current lead records",
                trend: "up",
              },
              {
                label: "Counselling",
                value: data.scopedCounselling.length,
                change: "Sessions in period",
                trend: "up",
              },
              {
                label: "Converted",
                value: converted,
                change: "Converted leads",
                trend: "up",
              },
              {
                label: "Conversion rate",
                value: percent(conversionRate),
                change: "Converted leads / total leads",
                trend: conversionRate >= 25 ? "up" : "down",
              },
            ].map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-6">
            <AnalyticsSection
              title="Lead and counselling trend"
              subtitle="Dated counselling and admission records in the period."
              className="xl:col-span-3"
            >
              <LineChart
                points={data.trend}
                lines={[
                  {
                    key: "counselling",
                    label: "Counselling",
                    color: "#3b82f6",
                  },
                  { key: "conversions", label: "Admissions", color: "#10b981" },
                ]}
                emptyMessage="No dated counselling or admission activity in this period."
              />
            </AnalyticsSection>
            <AnalyticsSection
              title="Lead status"
              subtitle="Current lead pipeline status."
            >
              <Donut
                center={data.scopedLeads.length}
                segments={data.statuses}
              />
            </AnalyticsSection>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnalyticsSection
              title="Converted admissions by course"
              subtitle="Confirmed conversion count by course."
            >
              <BarList
                items={data.coursePerformance}
                valueLabel={(item) => `${item.value} converted`}
              />
            </AnalyticsSection>
            <AnalyticsSection
              title="Pipeline notes"
              subtitle="Available fields in the existing prototype."
            >
              <div className="p-5 space-y-3 text-sm text-neutral-600">
                <p>
                  <strong className="text-neutral-800">Counselling:</strong>{" "}
                  {
                    data.scopedCounselling.filter(
                      (record) => record.status === "Converted",
                    ).length
                  }{" "}
                  counselling records marked converted.
                </p>
                <p>
                  <strong className="text-neutral-800">Admissions:</strong>{" "}
                  {data.scopedAdmissions.length} admission records in the
                  selected period.
                </p>
                <p className="text-xs text-neutral-500">
                  Lead records do not include a created date, so the time filter
                  applies to counselling and admissions activity only.
                </p>
              </div>
            </AnalyticsSection>
          </div>
        </>
      )}
    </div>
  );
}

export default LeadConversion;
