export const patients = [

  {
    // =====================
    // IDENTITAS PASIEN
    // =====================

    patient_id: "PAT-000001",

    identity: {

      name: "Ahmad",

      age: 65,

      gender: "Male",

      birthDate: "12 Mei 1961",

      address: "Yogyakarta"

    },


    // =====================
    // DATA KLINIS
    // Sesuai ClinicalData API
    // =====================

    clinical_data: {


      heart_rate: 112,


      systolic_bp: 90,

      diastolic_bp: 60,


      spo2: 85,


      respiratory_rate: 30,


      temperature_c: 38.4,


      blood_urea: 55,


      creatinine: 2.1,


      hemoglobin: 10.8,


      lactate: 4.3,


      platelets: 145,


      wbc_count: 15.2

    },



    // =====================
    // HASIL MODEL AI
    // Dari Backend
    // =====================

    prediction:{


      risk_score: 87,


      urgency:"Critical",


      status:"waiting"

    },



    // =====================
    // INFORMASI ICU
    // (Tambahan Frontend)
    // bukan input model
    // =====================

    icu_information:{


      complaint:
      "Sesak napas dan penurunan saturasi oksigen",


      diagnosis:[
        "Respiratory Failure",
        "Pneumonia"
      ],


      admission_reason:
      "Membutuhkan monitoring respirasi intensif",


      doctor:
      "dr. Andi Pratama, Sp.An",


      room:
      "ICU-02"


    },


    // =====================
    // ALERT UNTUK DASHBOARD
    // dibuat dari clinical_data
    // =====================


    clinical_alert:[

      {
        parameter:"SpO2",
        value:85,
        unit:"%"
      },


      {
        parameter:"Lactate",
        value:4.3,
        unit:"mmol/L"
      },


      {
        parameter:"Heart Rate",
        value:112,
        unit:"bpm"
      }

    ]

  }

];