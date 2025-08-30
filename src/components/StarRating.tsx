'use client';

interface StarRatingProps {
  rating: number;
  onChange: (rating: number) => void;
}

export function StarRating({ rating, onChange }: StarRatingProps) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="text-2xl focus:outline-none"
        >
          {star <= rating ? '★' : '☆'}
        </button>
      ))}
    </div>
  );
}