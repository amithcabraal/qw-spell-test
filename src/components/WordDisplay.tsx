import { LetterTile } from './LetterTile';

interface WordDisplayProps {
  userInput: string;
  correctWord?: string;
  showResult: boolean;
}

export function WordDisplay({ userInput, correctWord = '', showResult }: WordDisplayProps) {
  const getLetterStatus = (index: number) => {
    if (!showResult) return 'neutral';
    return userInput[index]?.toLowerCase() === correctWord[index]?.toLowerCase() 
      ? 'correct' 
      : 'incorrect';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-center gap-2">
        {userInput.split('').map((letter, index) => (
          <LetterTile 
            key={`user-${index}`}
            letter={letter}
            status={getLetterStatus(index)}
          />
        ))}
      </div>
      
      {showResult && (
        <div className="mt-4">
          <p className="text-center mb-2 text-gray-600 dark:text-gray-400">Correct spelling:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {correctWord.split('').map((letter, index) => (
              <LetterTile 
                key={`correct-${index}`}
                letter={letter}
                status="neutral"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}