import TablePagination from "@/components/tablepagination";
import { getPatientHistory } from "@/lib/api";
import type { PatientHistory } from "@/lib/api";

type SearchParams = Promise<{
  page?: string | string[];
  limit?: string | string[];
}>;

function readNumberParam(
  value: string | string[] | undefined,
  fallback: number
) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const parsedValue = Number(rawValue);

  return Number.isFinite(parsedValue) && parsedValue > 0
    ? Math.floor(parsedValue)
    : fallback;
}

export default async function HistoryPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = await searchParams;
  const page = readNumberParam(params?.page, 1);
  const limit = readNumberParam(params?.limit, 20);
  const data = await getPatientHistory({ page, limit });
  const patients: PatientHistory[] = data.items ?? [];

  return (
    <div className="p-6 pt-28">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          ICU Patient History
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Closed patient cases from the backend history endpoint
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr className="text-left">
                <th className="px-5 py-3 font-semibold">Patient</th>
                <th className="px-5 py-3 font-semibold">Patient Code</th>
                <th className="px-5 py-3 font-semibold">Risk Score</th>
                <th className="px-5 py-3 font-semibold">Priority</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Last Updated</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="bg-white transition-colors hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 align-middle">
                      <div className="font-semibold text-slate-900">
                        {patient.name || "-"}
                      </div>
                    </td>

                    <td className="px-5 py-4 align-middle font-mono text-xs text-slate-600">
                      {patient.patient_code || "-"}
                    </td>

                    <td className="px-5 py-4 align-middle">
                      <RiskScore
                        score={patient.risk_score}
                        normalizedScore={patient.normalized_risk_score}
                      />
                    </td>

                    <td className="px-5 py-4 align-middle">
                      <PriorityBadge priority={patient.urgency_level} />
                    </td>

                    <td className="px-5 py-4 align-middle">
                      <StatusBadge status={patient.case_status} />
                    </td>

                    <td className="px-5 py-4 align-middle text-slate-600">
                      {formatDate(patient.updated_at)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <div className="font-medium text-slate-700">
                      No patient history found.
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      Closed ICU cases will appear here.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <TablePagination pagination={data.pagination} basePath="/riwayat" />
      </div>
    </div>
  );
}

function RiskScore({
  score,
  normalizedScore,
}: {
  score?: number;
  normalizedScore?: number;
}) {
  const width =
    typeof normalizedScore === "number"
      ? Math.min(Math.max(normalizedScore * 100, 0), 100)
      : 0;

  return (
    <div className="w-32">
      <div className="font-semibold text-slate-900">{formatScore(score)}</div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-cyan-500"
          style={{
            width: `${width}%`,
          }}
        />
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority?: string }) {
  const styles: Record<string, string> = {
    critical: "bg-red-50 text-red-700 ring-red-100",
    high: "bg-orange-50 text-orange-700 ring-orange-100",
    moderate: "bg-yellow-50 text-yellow-700 ring-yellow-100",
    low: "bg-green-50 text-green-700 ring-green-100",
  };

  return (
    <span
      className={`inline-flex min-w-24 justify-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
        styles[priority ?? ""] ?? "bg-slate-50 text-slate-600 ring-slate-100"
      }`}
    >
      {formatLabel(priority)}
    </span>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const styles: Record<string, string> = {
    waiting: "bg-blue-50 text-blue-700 ring-blue-100",
    in_treatment: "bg-cyan-50 text-cyan-700 ring-cyan-100",
    closed: "bg-slate-100 text-slate-700 ring-slate-200",
  };

  return (
    <span
      className={`inline-flex min-w-28 justify-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
        styles[status ?? ""] ?? "bg-slate-50 text-slate-600 ring-slate-100"
      }`}
    >
      {formatLabel(status)}
    </span>
  );
}

function formatScore(score?: number) {
  return typeof score === "number" ? score.toFixed(2) : "-";
}

function formatLabel(value?: string) {
  if (!value) {
    return "-";
  }

  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(value?: string) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
