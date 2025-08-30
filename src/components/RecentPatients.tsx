export default function RecentPatients({ patients }: { patients: any[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="text-left p-2">Date</th>
          <th className="text-left p-2">Name</th>
          <th className="text-left p-2">Age</th>
          <th className="text-left p-2">Condition</th>
          <th className="text-left p-2">Room</th>
        </tr>
      </thead>
      <tbody>
        {patients.map((p) => (
          <tr key={p.id} className="border-b">
            <td className="p-2">{new Date(p.date).toLocaleDateString()}</td>
            <td className="p-2">{p.name}</td>
            <td className="p-2">{p.age}</td>
            <td className="p-2">{p.condition}</td>
            <td className="p-2">{p.room}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
