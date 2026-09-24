"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  Bed,
  CheckCircle2,
  Clock,
  ListChecks,
  Users,
} from "lucide-react";

import PatientsMonitoring from "@/components/patientsmonitoring";
import StatCard from "@/components/statcard";
import {
  getDashboardSummary,
  getPatientQueue,
  type DashboardSummary,
  type QueuePatient,
} from "@/lib/api";

export default function BerandaPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [patients, setPatients] = useState<QueuePatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdate, setLastUpdate] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [summaryData, queueData] = await Promise.all([
          getDashboardSummary({ days: 14 }),
          getPatientQueue({ page: 1, limit: 5 }),
        ]);

        setSummary(summaryData);
        setPatients(queueData.items ?? []);
        setLastUpdate(new Date().toLocaleTimeString());
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to fetch dashboard data."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  const cards = summary?.cards;

  return (
    <div className="min-h-screen w-full bg-slate-100">
      <div className="space-y-6 p-6 py-25">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                ICU-Q Dashboard
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Cards and time series are powered by the dashboard API.
              </p>
            </div>

            <div className="text-sm text-slate-500">
              Last Update:{" "}
              <span className="font-semibold text-slate-800">
                {lastUpdate || "-"}
              </span>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<Users className="h-8 w-8" />}
            value={formatNumber(cards?.total_patients, loading)}
            label="Total Cases"
            color="text-cyan-600"
          />

          <StatCard
            icon={<Bed className="h-8 w-8" />}
            value={formatNumber(cards?.active_patients, loading)}
            label="Active ICU Cases"
            color="text-blue-600"
          />

          <StatCard
            icon={<Clock className="h-8 w-8" />}
            value={formatNumber(cards?.waiting, loading)}
            label="Waiting"
            color="text-amber-600"
          />

          <StatCard
            icon={<Activity className="h-8 w-8" />}
            value={formatNumber(cards?.in_treatment, loading)}
            label="In Treatment"
            color="text-emerald-600"
          />

          <StatCard
            icon={<CheckCircle2 className="h-8 w-8" />}
            value={formatNumber(cards?.closed, loading)}
            label="Closed Cases"
            color="text-slate-600"
          />

          <StatCard
            icon={<AlertTriangle className="h-8 w-8" />}
            value={formatNumber(cards?.critical_active, loading)}
            label="Critical Active"
            color="text-red-600"
          />

          <StatCard
            icon={<ListChecks className="h-8 w-8" />}
            value={formatNumber(cards?.average_active_risk_score, loading)}
            label="Avg Active Risk"
            color="text-violet-600"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <ChartPanel
            title="Daily Case Trend by Status"
            subtitle="New cases grouped by current case status"
          >
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={summary?.time_series ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tickFormatter={formatShortDate} />
                <YAxis allowDecimals={false} />
                <Tooltip labelFormatter={formatLongDate} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="waiting"
                  name="Waiting"
                  stroke="#d97706"
                  fill="#fef3c7"
                />
                <Area
                  type="monotone"
                  dataKey="in_treatment"
                  name="In Treatment"
                  stroke="#059669"
                  fill="#d1fae5"
                />
                <Area
                  type="monotone"
                  dataKey="closed"
                  name="Closed"
                  stroke="#475569"
                  fill="#e2e8f0"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel
            title="Daily Case Trend by Priority"
            subtitle="New cases grouped by urgency level"
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={summary?.time_series ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tickFormatter={formatShortDate} />
                <YAxis allowDecimals={false} />
                <Tooltip labelFormatter={formatLongDate} />
                <Legend />
                <Bar dataKey="critical" name="Critical" stackId="priority" fill="#dc2626" />
                <Bar dataKey="high" name="High" stackId="priority" fill="#ea580c" />
                <Bar dataKey="moderate" name="Moderate" stackId="priority" fill="#ca8a04" />
                <Bar dataKey="low" name="Low" stackId="priority" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_1fr]">
          <DistributionPanel
            title="Active Priority Split"
            data={summary?.active_urgency_distribution ?? []}
          />

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Active Queue
                </h2>
                <p className="text-sm text-slate-500">
                  Top 5 patients from the active priority queue
                </p>
              </div>
            </div>

            <PatientsMonitoring patients={patients} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartPanel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function DistributionPanel({
  title,
  data,
}: {
  title: string;
  data: { name: string; value: number }[];
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      <div className="mt-5 space-y-4">
        {data.map((item) => {
          const percent = total === 0 ? 0 : (item.value / total) * 100;
          return (
            <div key={item.name}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">
                  {formatLabel(item.name)}
                </span>
                <span className="text-slate-500">{item.value}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${priorityColor(item.name)}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatNumber(value: number | undefined, loading: boolean) {
  if (loading) {
    return "...";
  }
  return typeof value === "number" ? value.toString() : "0";
}

function formatLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatShortDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });
}

function formatLongDate(value: unknown) {
  return new Date(`${String(value)}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
}

function priorityColor(priority: string) {
  const colors: Record<string, string> = {
    critical: "bg-red-600",
    high: "bg-orange-600",
    moderate: "bg-yellow-500",
    low: "bg-green-600",
  };

  return colors[priority] ?? "bg-slate-500";
}
