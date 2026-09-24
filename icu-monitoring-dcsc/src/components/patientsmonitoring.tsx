"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, Eye, Loader2, XCircle } from "lucide-react";

import {
  closePatient,
  updatePatientStatus,
  type QueuePatient,
} from "@/lib/api";

type PendingAction = {
  type: "start" | "close";
  patient: QueuePatient;
};

export default function PatientsMonitoring({
  patients,
}: {
  patients: QueuePatient[];
}) {
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    if (!pendingAction) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      if (pendingAction.type === "start") {
        await updatePatientStatus(pendingAction.patient.id, "in_treatment");
      } else {
        await closePatient(pendingAction.patient.id);
      }

      setPendingAction(null);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update this patient case."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr className="text-left">
                <th className="px-5 py-3 font-semibold">Rank</th>
                <th className="px-5 py-3 font-semibold">Patient</th>
                <th className="px-5 py-3 font-semibold">Patient Code</th>
                <th className="px-5 py-3 font-semibold">Risk Score</th>
                <th className="px-5 py-3 font-semibold">Priority</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Action</th>
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
                      <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-slate-100 px-2 font-semibold text-slate-700">
                        {patient.rank}
                      </span>
                    </td>

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

                    <td className="px-5 py-4 text-right align-middle">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/pasien/${patient.id}`}
                          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 font-medium text-slate-700 transition-colors hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Link>

                        {patient.case_status === "waiting" && (
                          <button
                            type="button"
                            onClick={() =>
                              setPendingAction({ type: "start", patient })
                            }
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-cyan-200 bg-cyan-50 px-3 font-medium text-cyan-700 transition-colors hover:bg-cyan-100"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Start
                          </button>
                        )}

                        {patient.case_status === "in_treatment" && (
                          <button
                            type="button"
                            onClick={() =>
                              setPendingAction({ type: "close", patient })
                            }
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 font-medium text-red-700 transition-colors hover:bg-red-100"
                          >
                            <XCircle className="h-4 w-4" />
                            Close
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <div className="font-medium text-slate-700">
                      No active patients found.
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      New active ICU cases will appear here.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pendingAction && (
        <ConfirmationModal
          action={pendingAction}
          error={error}
          submitting={submitting}
          onCancel={() => {
            if (!submitting) {
              setPendingAction(null);
              setError("");
            }
          }}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}

function ConfirmationModal({
  action,
  error,
  submitting,
  onCancel,
  onConfirm,
}: {
  action: PendingAction;
  error: string;
  submitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const isClose = action.type === "close";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div
          className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${
            isClose ? "bg-red-50 text-red-700" : "bg-cyan-50 text-cyan-700"
          }`}
        >
          {isClose ? (
            <XCircle className="h-5 w-5" />
          ) : (
            <CheckCircle2 className="h-5 w-5" />
          )}
        </div>

        <h2 className="text-lg font-semibold text-slate-900">
          {isClose ? "Close Patient Case" : "Start Patient Treatment"}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {isClose
            ? "This patient will be moved out of the active queue and into history."
            : "This patient status will be updated from Waiting to In Treatment."}
        </p>

        <div className="mt-4 rounded-lg bg-slate-50 p-3">
          <div className="font-semibold text-slate-900">
            {action.patient.name || "-"}
          </div>
          <div className="mt-1 font-mono text-xs text-slate-500">
            {action.patient.patient_code || "-"}
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={submitting}
            onClick={onCancel}
            className="h-10 rounded-lg border border-slate-200 px-4 font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={onConfirm}
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
              isClose ? "bg-red-600 hover:bg-red-700" : "bg-cyan-600 hover:bg-cyan-700"
            }`}
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isClose ? "Close Patient" : "Start Treatment"}
          </button>
        </div>
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
