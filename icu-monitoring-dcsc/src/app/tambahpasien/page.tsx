"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import { FiActivity, FiArrowLeft, FiHeart, FiPhone, FiSave, FiUser } from "react-icons/fi";

import { createPatientCase, type PatientCreatePayload } from "@/lib/api";

const initialForm = {
  medicalRecord: "",
  name: "",
  nik: "",
  birthDate: "",
  age: "",
  gender: "",
  bloodType: "",
  address: "",
  payment: "",
  bpjs: "",
  admissionDate: "",
  doctor: "",
  familyName: "",
  relationship: "",
  phone: "",
  familyAddress: "",
  room: "",
  priority: "",
  icuDate: "",
  source: "",
  complaint: "",
  medicalHistory: "",
  diagnosis: "",
  icuReason: "",
  heartRate: "",
  systolicBp: "",
  diastolicBp: "",
  spo2: "",
  respiratoryRate: "",
  temperature: "",
  gcs: "",
  wbcCount: "",
  hemoglobin: "",
  platelets: "",
  creatinine: "",
  bloodUrea: "",
  lactate: "",
  ventilator: "",
  therapy: "",
};

type FormData = typeof initialForm;

export default function PatientRegistrationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = buildPayload(formData);
      const created = await createPatientCase(payload);
      router.push(`/pasien/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save patient.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-300">
      <main>
        <div className="border-b bg-white px-8 py-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <FiArrowLeft />
            </button>

            <div>
              <h1 className="text-xl font-bold text-gray-900">
                ICU Patient Registration
              </h1>
              <p className="text-sm text-gray-500">
                Create one patient case with clinical data and metadata.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 px-6 pb-10">
          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-7xl space-y-8 rounded-2xl border bg-white p-6 shadow-sm"
          >
            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <FormSection icon={<FiUser className="text-blue-600" />} title="Patient Identity">
              <Input name="medicalRecord" label="Medical Record / Patient Code" placeholder="RM-2026001" value={formData.medicalRecord} onChange={handleChange} required />
              <Input name="name" label="Full Name" placeholder="Patient name" value={formData.name} onChange={handleChange} required />
              <Input name="nik" label="National ID" placeholder="NIK / ID number" value={formData.nik} onChange={handleChange} />
              <Input name="birthDate" label="Birth Date" type="date" value={formData.birthDate} onChange={handleChange} />
              <Input name="age" label="Age" type="number" placeholder="65" value={formData.age} onChange={handleChange} required min={0} max={120} />
              <Select name="gender" label="Gender" value={formData.gender} onChange={handleChange} options={["Male", "Female"]} required />
              <Input name="bloodType" label="Blood Type" placeholder="O+" value={formData.bloodType} onChange={handleChange} />
              <Input name="address" label="Address" placeholder="Full address" value={formData.address} onChange={handleChange} />
            </FormSection>

            <FormSection title="Administration">
              <Select name="payment" label="Payment Type" value={formData.payment} onChange={handleChange} options={["BPJS", "General", "Insurance"]} />
              <Input name="bpjs" label="BPJS Number" placeholder="Participant number" value={formData.bpjs} onChange={handleChange} />
              <Input name="admissionDate" label="Hospital Admission Date" type="date" value={formData.admissionDate} onChange={handleChange} />
              <Input name="doctor" label="Responsible Doctor" placeholder="Dr. Name" value={formData.doctor} onChange={handleChange} />
            </FormSection>

            <FormSection icon={<FiPhone />} title="Family Contact">
              <Input name="familyName" label="Family Name" value={formData.familyName} onChange={handleChange} />
              <Input name="relationship" label="Relationship" value={formData.relationship} onChange={handleChange} />
              <Input name="phone" label="Phone Number" value={formData.phone} onChange={handleChange} />
              <Input name="familyAddress" label="Family Address" value={formData.familyAddress} onChange={handleChange} />
            </FormSection>

            <FormSection icon={<FiActivity />} title="ICU Admission Metadata">
              <Select name="room" label="ICU Room" value={formData.room} onChange={handleChange} options={["ICU-01", "ICU-02", "ICU-03"]} />
              <Select name="priority" label="Manual ICU Priority" value={formData.priority} onChange={handleChange} options={["Critical", "High Risk", "Stable"]} />
              <Input name="icuDate" label="ICU Admission Date" type="date" value={formData.icuDate} onChange={handleChange} />
              <Input name="source" label="Admission Source" placeholder="ER / Ward / Referral" value={formData.source} onChange={handleChange} />
            </FormSection>

            <section>
              <h2 className="flex items-center gap-2 border-b pb-3 text-lg font-bold">
                <FiHeart />
                Required Clinical Data
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                These fields are required by the backend model schema.
              </p>
              <div className="mt-5 grid gap-5 md:grid-cols-3">
                <Input name="heartRate" label="Heart Rate" type="number" placeholder="110" value={formData.heartRate} onChange={handleChange} required min={20} max={250} />
                <Input name="systolicBp" label="Systolic BP" type="number" placeholder="120" value={formData.systolicBp} onChange={handleChange} required min={40} max={260} />
                <Input name="diastolicBp" label="Diastolic BP" type="number" placeholder="80" value={formData.diastolicBp} onChange={handleChange} required min={20} max={180} />
                <Input name="respiratoryRate" label="Respiratory Rate" type="number" placeholder="24" value={formData.respiratoryRate} onChange={handleChange} required min={4} max={80} />
                <Input name="temperature" label="Temperature C" type="number" step="0.1" placeholder="37.5" value={formData.temperature} onChange={handleChange} required min={25} max={45} />
                <Input name="spo2" label="SpO2" type="number" placeholder="92" value={formData.spo2} onChange={handleChange} required min={40} max={100} />
                <Input name="wbcCount" label="WBC Count" type="number" step="0.1" placeholder="15.2" value={formData.wbcCount} onChange={handleChange} required min={0} max={200} />
                <Input name="hemoglobin" label="Hemoglobin" type="number" step="0.1" placeholder="10.8" value={formData.hemoglobin} onChange={handleChange} required min={0} max={25} />
                <Input name="platelets" label="Platelets" type="number" placeholder="145" value={formData.platelets} onChange={handleChange} required min={0} max={1500} />
                <Input name="creatinine" label="Creatinine" type="number" step="0.1" placeholder="2.1" value={formData.creatinine} onChange={handleChange} required min={0} max={30} />
                <Input name="bloodUrea" label="Blood Urea" type="number" step="0.1" placeholder="55" value={formData.bloodUrea} onChange={handleChange} required min={0} max={300} />
                <Input name="lactate" label="Lactate" type="number" step="0.1" placeholder="4.3" value={formData.lactate} onChange={handleChange} required min={0} max={30} />
                <Input name="gcs" label="GCS Score" type="number" placeholder="15" value={formData.gcs} onChange={handleChange} min={3} max={15} />
              </div>
            </section>

            <FormSection title="Clinical Notes">
              <TextArea name="complaint" label="Chief Complaint" value={formData.complaint} onChange={handleChange} />
              <TextArea name="medicalHistory" label="Medical History" value={formData.medicalHistory} onChange={handleChange} />
              <TextArea name="diagnosis" label="Initial Diagnosis" value={formData.diagnosis} onChange={handleChange} />
              <TextArea name="icuReason" label="ICU Admission Reason" value={formData.icuReason} onChange={handleChange} />
            </FormSection>

            <FormSection title="Initial Therapy">
              <TextArea name="ventilator" label="Ventilator / Respiratory Support" value={formData.ventilator} onChange={handleChange} />
              <TextArea name="therapy" label="Medication and Therapy" value={formData.therapy} onChange={handleChange} />
            </FormSection>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <FiSave />
              {loading ? "Saving..." : "Save ICU Patient Case"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

function buildPayload(formData: FormData): PatientCreatePayload {
  return {
    patient_code: formData.medicalRecord.trim(),
    name: formData.name.trim(),
    clinical_data: {
      age: toNumber(formData.age),
      gender: formData.gender as "Male" | "Female",
      heart_rate: toNumber(formData.heartRate),
      systolic_bp: toNumber(formData.systolicBp),
      diastolic_bp: toNumber(formData.diastolicBp),
      respiratory_rate: toNumber(formData.respiratoryRate),
      temperature_c: toNumber(formData.temperature),
      spo2: toNumber(formData.spo2),
      wbc_count: toNumber(formData.wbcCount),
      hemoglobin: toNumber(formData.hemoglobin),
      platelets: toNumber(formData.platelets),
      creatinine: toNumber(formData.creatinine),
      blood_urea: toNumber(formData.bloodUrea),
      lactate: toNumber(formData.lactate),
    },
    metadata: {
      identity: {
        medical_record: formData.medicalRecord,
        nik: formData.nik,
        birth_date: formData.birthDate,
        age: formData.age,
        gender: formData.gender,
        blood_type: formData.bloodType,
        address: formData.address,
      },
      administration: {
        payment: formData.payment,
        bpjs: formData.bpjs,
        admission_date: formData.admissionDate,
        doctor: formData.doctor,
      },
      family_contact: {
        family_name: formData.familyName,
        relationship: formData.relationship,
        phone: formData.phone,
        address: formData.familyAddress,
      },
      icu_admission: {
        room: formData.room,
        manual_priority: formData.priority,
        icu_date: formData.icuDate,
        source: formData.source,
      },
      clinical_notes: {
        complaint: formData.complaint,
        medical_history: formData.medicalHistory,
        diagnosis: formData.diagnosis,
        icu_reason: formData.icuReason,
        gcs: formData.gcs,
      },
      therapy: {
        ventilator: formData.ventilator,
        medication: formData.therapy,
      },
    },
  };
}

function toNumber(value: string) {
  return Number(value);
}

function FormSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="flex items-center gap-2 border-b pb-3 text-lg font-bold">
        {icon}
        {title}
      </h2>
      <div className="mt-5 grid gap-5 md:grid-cols-2">{children}</div>
    </section>
  );
}

type InputProps = {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  step?: string;
  value: string;
  required?: boolean;
  min?: number;
  max?: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function Input({
  name,
  label,
  placeholder,
  type = "text",
  step,
  value,
  required,
  min,
  max,
  onChange,
}: InputProps) {
  return (
    <div>
      <label className="text-sm text-gray-600">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        step={step}
        min={min}
        max={max}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border bg-gray-50 px-4 py-3"
      />
    </div>
  );
}

type SelectProps = {
  name: string;
  label: string;
  options: string[];
  value: string;
  required?: boolean;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

function Select({ name, label, options, value, required, onChange }: SelectProps) {
  return (
    <div>
      <label className="text-sm text-gray-600">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-1 w-full rounded-xl border bg-gray-50 px-4 py-3"
      >
        <option value="">Select</option>
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}

type TextAreaProps = {
  name: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

function TextArea({ name, label, value, onChange }: TextAreaProps) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 h-28 w-full rounded-xl border bg-gray-50 px-4 py-3"
      />
    </div>
  );
}
