interface ProfileCardProps {
  doctor: {
    name: string;
    specialization: string;
    rating: number;
    ratingCount: number;
    // photoUrl?: string;
  };
}

export default function ProfileCard({ doctor }: ProfileCardProps) {
  return (
    <div className="flex flex-col items-start space-y-2">
      <h3 className="text-xl font-bold">{doctor.name}</h3>
      <p className="text-gray-600">{doctor.specialization}</p>
      <p>
        Rating: {doctor.rating.toFixed(1)} ({doctor.ratingCount} reviews)
      </p>
    </div>
  );
}
