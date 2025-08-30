import { SpecializationCardProps } from '@/types/Specialization';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function SpecializationCard({ specialization }: SpecializationCardProps) {

  if (!specialization || !specialization.id || !specialization.name) {
    console.error('Invalid specialization data:', specialization);
    return null; 
  }

  return (
    <Link 
      href={`/specializations/${specialization.id}`}
      passHref
      legacyBehavior
    >
      <a className="border rounded-lg p-4 flex items-center space-x-4 hover:shadow-lg transition-shadow cursor-pointer">
        <Heart className="text-red-500 w-6 h-6" />
        <span className="font-semibold text-lg">
          {specialization.name}
        </span>
      </a>
    </Link>
  );
}