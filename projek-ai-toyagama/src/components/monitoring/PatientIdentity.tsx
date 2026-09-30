interface PatientIdentityProps {
  data: {
    medicalRecord: string;
    name: string;
    age: number | string;
    gender: string;
    bloodType: string;
    birthDate: string;
    address: string;
    room: string;
    doctor: string;
    admissionDate: string;
    nik?: string;
    payment?: string;
    phone?: string;
    familyName?: string;
    relationship?: string;
    source?: string;
  };
}


export default function PatientIdentity({
  data
}: PatientIdentityProps) {

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      <h2 className="text-lg font-semibold text-slate-800 mb-5">
        Patient Identity
      </h2>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


        <div>
          <p className="text-sm text-slate-500">
            Medical Record
          </p>

          <p className="font-medium text-slate-800">
            {data.medicalRecord}
          </p>
        </div>


        <div>
          <p className="text-sm text-slate-500">
            Name
          </p>

          <p className="font-medium text-slate-800">
            {data.name}
          </p>
        </div>


        <div>
          <p className="text-sm text-slate-500">
            Age
          </p>

          <p className="font-medium text-slate-800">
            {data.age === "-" ? "-" : `${data.age} Years`}
          </p>
        </div>


        <div>
          <p className="text-sm text-slate-500">
            Gender
          </p>

          <p className="font-medium text-slate-800">
            {data.gender}
          </p>
        </div>


        <div>
          <p className="text-sm text-slate-500">
            National ID
          </p>

          <p className="font-medium text-slate-800">
            {data.nik || "-"}
          </p>
        </div>


        <div>
          <p className="text-sm text-slate-500">
            Blood Type
          </p>

          <p className="font-medium text-slate-800">
            {data.bloodType}
          </p>
        </div>


        <div>
          <p className="text-sm text-slate-500">
            Birth Date
          </p>

          <p className="font-medium text-slate-800">
            {data.birthDate}
          </p>
        </div>


        <div>
          <p className="text-sm text-slate-500">
            ICU Room
          </p>

          <p className="font-medium text-slate-800">
            {data.room}
          </p>
        </div>


        <div>
          <p className="text-sm text-slate-500">
            Payment
          </p>

          <p className="font-medium text-slate-800">
            {data.payment || "-"}
          </p>
        </div>


        <div>
          <p className="text-sm text-slate-500">
            Doctor
          </p>

          <p className="font-medium text-slate-800">
            {data.doctor}
          </p>
        </div>


        <div>
          <p className="text-sm text-slate-500">
            Admission Date
          </p>

          <p className="font-medium text-slate-800">
            {data.admissionDate}
          </p>
        </div>


        <div>
          <p className="text-sm text-slate-500">
            Admission Source
          </p>

          <p className="font-medium text-slate-800">
            {data.source || "-"}
          </p>
        </div>


        <div>
          <p className="text-sm text-slate-500">
            Address
          </p>

          <p className="font-medium text-slate-800">
            {data.address}
          </p>
        </div>


        <div>
          <p className="text-sm text-slate-500">
            Family Contact
          </p>

          <p className="font-medium text-slate-800">
            {[data.familyName, data.relationship, data.phone]
              .filter(Boolean)
              .join(" / ") || "-"}
          </p>
        </div>


      </div>

    </div>
  );
}
