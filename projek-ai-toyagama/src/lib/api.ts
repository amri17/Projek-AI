const API_URL = "https://dcse-icu-patient-risk.onrender.com";


// ===============================
// TYPE
// ===============================

export interface DashboardSummary {
  cards: {
    total_patients: number;
    active_patients: number;
    waiting: number;
    in_treatment: number;
    closed: number;
    critical_active: number;
    average_active_risk_score: number;
  };

  time_series: {
    date: string;
    waiting: number;
    in_treatment: number;
    closed: number;
    critical: number;
    high: number;
    moderate: number;
    low: number;
  }[];

  active_urgency_distribution: {
    name: string;
    value: number;
  }[];
}


export interface QueuePatient {
  id: string;

  rank: number;

  name: string;

  patient_code: string;

  risk_score?: number;
  normalized_risk_score?: number;

  urgency_level?: string;

  case_status?: "waiting" | "in_treatment" | "closed";

  age?: number;
  gender?: string;
  room?: string;
}

export interface PatientQueueResponse {
  items: QueuePatient[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

// ===============================
// GENERAL API REQUEST
// ===============================

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      cache: "no-store",
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    }
  );


  if (!response.ok) {
    throw new Error(
      `API Error: ${response.status}`
    );
  }


  return response.json();
}

export interface PatientHistory {
  id: string;
  name: string;
  patient_code: string;
  risk_score?: number;
  normalized_risk_score?: number;
  urgency_level?: string;
  case_status?: string;
  updated_at?: string;
}


// ===============================
// DASHBOARD
// ===============================

export async function getDashboardSummary({
  days = 14,
}: {
  days?: number;
}): Promise<DashboardSummary> {
  return apiRequest<DashboardSummary>(
    `/api/dashboard/summary?days=${days}`
  );
}



// ===============================
// PATIENT QUEUE
// ===============================

export async function getPatientQueue({
  page = 1,
  limit = 20,
}: {
  page?: number;
  limit?: number;
}): Promise<PatientQueueResponse> {
  return apiRequest<PatientQueueResponse>(
    `/api/patients/queue?page=${page}&limit=${limit}`
  );
}



// ===============================
// PATIENT HISTORY
// ===============================

export interface PatientHistoryResponse {
  items: PatientHistory[];
  pagination: Pagination;
}

export async function getPatientHistory({
  page = 1,
  limit = 20,
}: {
  page?: number;
  limit?: number;
}): Promise<PatientHistoryResponse> {
  return apiRequest<PatientHistoryResponse>(
    `/api/patients/history?page=${page}&limit=${limit}`
  );
}



// ===============================
// UPDATE PATIENT STATUS
// ===============================

export async function updatePatientStatus(
  id: string,
  status: string
) {

  return apiRequest(
    `/api/patients/${id}/status`,
    {
      method: "PUT",
      body: JSON.stringify({
        status,
      }),
    }
  );

}



// ===============================
// CLOSE PATIENT
// ===============================

export async function closePatient(
  id: string
) {

  return apiRequest(
    `/api/patients/${id}/close`,
    {
      method: "PUT",
    }
  );

}

// ===============================
// CREATE PATIENT CASE
// ===============================

export interface PatientCreatePayload {
  patient_code: string;
  name: string;

  clinical_data: {
    age: number;
    gender: "Male" | "Female";
    heart_rate: number;
    systolic_bp: number;
    diastolic_bp: number;
    respiratory_rate: number;
    temperature_c: number;
    spo2: number;
    wbc_count: number;
    hemoglobin: number;
    platelets: number;
    creatinine: number;
    blood_urea: number;
    lactate: number;
  };

  metadata: {
    identity: {
      medical_record: string;
      nik: string;
      birth_date: string;
      age: string;
      gender: string;
      blood_type: string;
      address: string;
    };

    administration: {
      payment: string;
      bpjs: string;
      admission_date: string;
      doctor: string;
    };

    family_contact: {
      family_name: string;
      relationship: string;
      phone: string;
      address: string;
    };

    icu_admission: {
      room: string;
      manual_priority: string;
      icu_date: string;
      source: string;
    };

    clinical_notes: {
      complaint: string;
      medical_history: string;
      diagnosis: string;
      icu_reason: string;
      gcs: string;
    };

    therapy: {
      ventilator: string;
      medication: string;
    };
  };
}
export interface PatientCreatedResponse {
  id: string;
}


export async function createPatientCase(
  data: PatientCreatePayload
): Promise<PatientCreatedResponse> {

  return apiRequest<PatientCreatedResponse>(
    "/api/patients",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}