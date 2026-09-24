interface Props {
  status: "Critical" | "High Risk" | "Stable";
}

export default function StatusBadge({ status }: Props) {

  if (status === "Critical") {
    return (
      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold text-sm">
        Critical
      </span>
    );
  }

  if (status === "High Risk") {
    return (
      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-semibold text-sm">
        High Risk
      </span>
    );
  }

  return (
    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold text-sm">
      Stable
    </span>
  );
}