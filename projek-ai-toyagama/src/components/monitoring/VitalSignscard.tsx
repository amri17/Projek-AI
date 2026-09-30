interface VitalSignsProps {
  data: {
    heart_rate: number;
    spo2: number;
    systolic_bp: number;
    diastolic_bp: number;
    temperature_c: number;
    respiratory_rate: number;
    lactate: number;
    creatinine: number;
    blood_urea: number;
    hemoglobin: number;
    platelets: number;
    wbc_count: number;
  };
}

export default function VitalSignsCard({
  data,
}: VitalSignsProps) {
  const vitals = [
  {
    label: "Heart Rate",
    value: `${data.heart_rate} bpm`,
  },
  {
    label: "SpO₂",
    value: `${data.spo2}%`,
  },
  {
    label: "Blood Pressure",
    value: `${data.systolic_bp}/${data.diastolic_bp} mmHg`,
  },
  {
    label: "Temperature",
    value: `${data.temperature_c} °C`,
  },
  {
    label: "Respiratory Rate",
    value: `${data.respiratory_rate} rpm`,
  },
  {
    label: "Lactate",
    value: `${data.lactate} mmol/L`,
  },
  {
    label: "Creatinine",
    value: `${data.creatinine} mg/dL`,
  },
  {
    label: "Blood Urea",
    value: `${data.blood_urea} mg/dL`,
  },
  {
    label: "Hemoglobin",
    value: `${data.hemoglobin} g/dL`,
  },
  {
    label: "Platelets",
    value: data.platelets,
  },
  {
    label: "WBC Count",
    value: data.wbc_count,
  },
];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-5">
        Clinical Data
      </h2>

      <div
        className="
        grid
        grid-cols-2
        md:grid-cols-3
        xl:grid-cols-4
        gap-4
      "
      >
        {vitals.map((item) => (
          <div
            key={item.label}
            className="bg-slate-50 rounded-xl p-4"
          >
            <p className="text-sm text-slate-500">
              {item.label}
            </p>

            <p className="text-xl font-bold text-slate-800">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}