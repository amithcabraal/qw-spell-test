interface LetterTileProps {
  letter: string;
  status?: 'correct' | 'incorrect' | 'neutral';
}

export function LetterTile({ letter, status = 'neutral' }: LetterTileProps) {
  const baseClasses = "w-12 h-12 flex items-center justify-center text-xl font-bold rounded-lg border-2 mx-1";
  const statusClasses = {
    correct: "bg-green-100 border-green-500 text-green-700",
    incorrect: "bg-red-100 border-red-500 text-red-700",
    neutral: "bg-white border-gray-300 text-gray-700"
  };

  return (
    <div className={`${baseClasses} ${statusClasses[status]}`}>
      {letter}
    </div>
  );
}