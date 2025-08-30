import Link from 'next/link';

type Doctor = {
  id: number;
  name: string;
  photoUrl: string;
};

type DoctorCardProps = {
  doctor: Doctor;
  specializationId: number;
};

export default function DoctorCard({ doctor, specializationId }: DoctorCardProps) {
  return (
    <div className="border rounded-lg p-4 flex flex-col items-center space-y-4 shadow-md">
      <img src={doctor.photoUrl} alt={doctor.name} className="w-24 h-24 rounded-full object-cover" />
      <h3 className="text-lg font-semibold">{doctor.name}</h3>
      <Link
        href={`/specializations/${specializationId}/doctors/${doctor.id}/book`}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Book Appointment
      </Link>
    </div>
  );
}
