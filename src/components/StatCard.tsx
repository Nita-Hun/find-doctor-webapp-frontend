export default function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white rounded shadow p-4 flex flex-col items-center justify-center">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
    </div>
  );
}
