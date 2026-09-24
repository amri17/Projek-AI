import PatientMonitoringTable from "@/components/patientsmonitoring";
import TablePagination from "@/components/tablepagination";
import { getPatientQueue } from "@/lib/api";

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

export default async function QueuePage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = await searchParams;
  const page = readNumberParam(params?.page, 1);
  const limit = readNumberParam(params?.limit, 20);
  const data = await getPatientQueue({ page, limit });

  return (
    <div className="min-h-screen w-full bg-gray-300 py-10">
      <div className="p-6 pt-20">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between p-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Patient Queue
              </h2>

              <p className="text-sm text-gray-500">
                Active ICU priority queue from the backend
              </p>
            </div>
          </div>

          <PatientMonitoringTable patients={data.items ?? []} />

          <TablePagination pagination={data.pagination} basePath="/antrean" />
        </div>
      </div>
    </div>
  );
}
