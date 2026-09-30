import AIExplanation from "@/components/monitoring/AIExplanation";
import MonitoringSummary from "@/components/monitoring/MonitoringSummary";
import PatientIdentity from "@/components/monitoring/PatientIdentity";
import RiskFactorAnalysis from "@/components/monitoring/RiskFactorAnalysis";
import VitalSignsCard from "@/components/monitoring/VitalSignscard";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://dcse-icu-patient-risk.onrender.com";

export default async function PatientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await fetch(`${API_URL}/api/patients/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return <div className="p-6">Patient not found.</div>;
  }

  const patient = await response.json();
  const metadata = patient.metadata ?? {};
  const identity = metadata.identity ?? {};
  const administration = metadata.administration ?? {};
  const familyContact = metadata.family_contact ?? {};
  const icuAdmission = metadata.icu_admission ?? {};
  const clinicalNotes = metadata.clinical_notes ?? {};
  const therapy = metadata.therapy ?? {};
  const prediction = patient.prediction ?? {};

  return (
    <main className="min-h-screen space-y-6 bg-slate-100 px-6 pb-6 pt-24">
      <div className="flex justify-between rounded-2xl bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Patient Monitoring
          </h1>

          <p className="text-slate-500">
            {patient.patient_code} - {patient.name}
          </p>
        </div>

        <div className={`rounded-full px-4 py-2 ${urgencyStyle(prediction.urgency_level)}`}>
          {formatLabel(prediction.urgency_level)}
        </div>
      </div>

      <PatientIdentity
        data={{
          medicalRecord: identity.medical_record ?? patient.patient_code,
          name: patient.name,
          nik: identity.nik,
          age: patient.clinical_data?.age ?? "-",
          gender: identity.gender ?? patient.clinical_data?.gender ?? "-",
          bloodType: identity.blood_type ?? "-",
          birthDate: identity.birth_date ?? "-",
          address: identity.address ?? "-",
          room: icuAdmission.room ?? "-",
          doctor: administration.doctor ?? "-",
          admissionDate: administration.admission_date ?? patient.created_at ?? "-",
          payment: administration.payment,
          phone: familyContact.phone,
          familyName: familyContact.family_name,
          relationship: familyContact.relationship,
          source: icuAdmission.source,
        }}
      />

      <VitalSignsCard data={patient.clinical_data} />

      <MetadataNotes
        clinicalNotes={clinicalNotes}
        therapy={therapy}
        icuAdmission={icuAdmission}
      />

      <MonitoringSummary
        data={{
          condition: formatLabel(prediction.urgency_level),
          observation: [
            `Risk Score: ${prediction.risk_score ?? "-"}%`,
            `Priority Rank: ${prediction.urgency_priority ?? "-"}`,
            `Status: ${formatLabel(patient.case_status)}`,
          ],
          recommendation: ["Continue ICU monitoring"],
        }}
      />

      <AIExplanation
        data={{
          summary:
            patient.llm_explanation?.summary ?? "No AI explanation available",
          generated_at: patient.llm_explanation?.generated_at ?? patient.created_at,
        }}
      />

      <RiskFactorAnalysis data={patient.shap_explanation?.top_features ?? []} />
    </main>
  );
}

function MetadataNotes({
  clinicalNotes,
  therapy,
  icuAdmission,
}: {
  clinicalNotes: Record<string, string>;
  therapy: Record<string, string>;
  icuAdmission: Record<string, string>;
}) {
  const items = [
    ["Manual Priority", icuAdmission.manual_priority],
    ["ICU Admission Date", icuAdmission.icu_date],
    ["Chief Complaint", clinicalNotes.complaint],
    ["Medical History", clinicalNotes.medical_history],
    ["Initial Diagnosis", clinicalNotes.diagnosis],
    ["ICU Admission Reason", clinicalNotes.icu_reason],
    ["GCS", clinicalNotes.gcs],
    ["Ventilator Support", therapy.ventilator],
    ["Medication and Therapy", therapy.medication],
  ];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-slate-800">
        Patient Metadata
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map(([label, value]) => (
          <div key={label} className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-1 font-medium text-slate-800">{value || "-"}</p>
          </div>
        ))}
      </div>
    </div>
  );
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

function urgencyStyle(value?: string) {
  const styles: Record<string, string> = {
    critical: "bg-red-100 text-red-700",
    high: "bg-orange-100 text-orange-700",
    moderate: "bg-yellow-100 text-yellow-700",
    low: "bg-green-100 text-green-700",
  };

  return styles[value ?? ""] ?? "bg-slate-100 text-slate-700";
}
