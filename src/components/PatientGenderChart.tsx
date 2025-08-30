import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";

export default function PatientGenderChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="male" stroke="#3b82f6" name="Male" />
        <Line type="monotone" dataKey="female" stroke="#ec4899" name="Female" />
      </LineChart>
    </ResponsiveContainer>
  );
}
