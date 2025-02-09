import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Volume2, HelpCircle, Share2, Sun, Moon, Laptop, Menu, ArrowRight, Plus } from 'lucide-react';
import { categories } from './data/words';
import type { Category, Word } from './data/words';
import { WordDisplay } from './components/WordDisplay';
import { CustomCategoryModal } from './components/CustomCategoryModal';

const congratulatoryMessages = [
  "Excellent spelling! You nailed it!",
  "Perfect! Keep up the great work!",
  "Outstanding job! You're a spelling champion!",
  "Fantastic work! You got it right!",
  "Brilliant spelling! You're on fire!",
  "Amazing! You're a spelling wizard!",
  "Superb job! That's exactly right!",
  "Wonderful! You're getting better and better!",
  "Incredible work! You're mastering these words!",
  "Spectacular! You're doing great!"
];

const encouragementMessages = [
  "Good try! Keep practicing!",
  "Better luck next time! Don't give up!"
];

function App() {
  const [showWelcome, setShowWelcome] = useState(() => {
    return localStorage.getItem('welcomeDismissed') !== 'true';
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'system';
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [showCustomCategoryModal, setShowCustomCategoryModal] = useState(false);
  const [customCategories, setCustomCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('customCategories');
    return saved ? JSON.parse(saved) : [];
  });

  // Save custom categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('customCategories', JSON.stringify(customCategories));
  }, [customCategories]);

  const handleSaveCustomCategory = (categoryName: string, words: Word[]) => {
    const newCategory: Category = {
      name: categoryName,
      words,
      isCustom: true
    };
    setCustomCategories([...customCategories, newCategory]);
  };

  const currentWord = selectedCategory 
    ? [...categories, ...customCategories].find(c => c.name === selectedCategory)?.words[currentWordIndex]
    : null;

  // Initialize speech synthesis on component mount
  useEffect(() => {
    if ('speechSynthesis' in window) {
      // Load voices
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log('Available voices:', voices.length);
      };

      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();
    } else {
      console.error('Speech synthesis not supported');
    }
  }, []);

  // Automatically announce new word when it changes
  useEffect(() => {
    if (currentWord && !showResult && !showSummary) {
      // Small delay to ensure the UI has updated
      const timer = setTimeout(() => {
        speakText(currentWord.word);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentWord, currentWordIndex, selectedCategory]);

  const speakText = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    if (isSpeaking) {
      window.speechSynthesis.cancel();
    }

    console.log('Speaking text:', text);
    
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Get available voices
      const voices = window.speechSynthesis.getVoices();
      console.log('Current voices:', voices.length);
      
      // Try to find an English voice
      const englishVoice = voices.find(voice => 
        voice.lang.startsWith('en-')
      );
      
      if (englishVoice) {
        console.log('Using voice:', englishVoice.name);
        utterance.voice = englishVoice;
      }

      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        console.log('Speech started');
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        console.log('Speech ended');
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        console.error('Speech error:', event);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
    }
  }, [isSpeaking]);

  useEffect(() => {
    // Theme handling
    const root = window.document.documentElement;
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentWordIndex(0);
    setUserInput('');
    setShowResult(false);
    setCorrectAnswers(0);
    setShowSummary(false);
  };

  const getRandomMessage = (messages: string[]) => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  };

  const handleSubmit = () => {
    setShowResult(true);
    
    if (currentWord) {
      const isCorrect = userInput.toLowerCase() === currentWord.word.toLowerCase();
      if (isCorrect) {
        setCorrectAnswers(prev => prev + 1);
      }
      
      const feedbackMessage = isCorrect 
        ? getRandomMessage(congratulatoryMessages)
        : getRandomMessage(encouragementMessages);
      
      // Add a small delay before speaking the feedback
      setTimeout(() => {
        speakText(feedbackMessage);
      }, 500);
    }
  };

  const handleNextWord = () => {
    if (currentWordIndex < 4) {
      setCurrentWordIndex(prev => prev + 1);
      setUserInput('');
      setShowResult(false);
    } else {
      setShowSummary(true);
      // Announce the final score
      const scoreMessage = `You scored ${correctAnswers} out of 5!`;
      setTimeout(() => {
        speakText(scoreMessage);
      }, 500);
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setCurrentWordIndex(0);
    setUserInput('');
    setShowResult(false);
    setCorrectAnswers(0);
    setShowSummary(false);
  };

  const dismissWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('welcomeDismissed', 'true');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Spelling Game</h1>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        
        {/* Menu */}
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 z-10">
            <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Theme</div>
            <button
              onClick={() => setTheme('light')}
              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white flex items-center gap-2"
            >
              <Sun className="w-4 h-4" /> Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white flex items-center gap-2"
            >
              <Moon className="w-4 h-4" /> Dark
            </button>
            <button
              onClick={() => setTheme('system')}
              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white flex items-center gap-2"
            >
              <Laptop className="w-4 h-4" /> System
            </button>
            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
            <button
              onClick={() => setShowCustomCategoryModal(true)}
              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create Custom Test
            </button>
            <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4" /> Help
            </button>
            <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white flex items-center gap-2">
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white flex items-center gap-2">
              <Settings className="w-4 h-4" /> Settings
            </button>
          </div>
        )}
      </header>

      {/* Welcome Modal */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Welcome to Spelling Game!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Test your spelling skills with our fun and interactive game. Choose a category,
              listen to the word, and try to spell it correctly!
            </p>
            <button
              onClick={dismissWelcome}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        {!selectedCategory ? (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...categories, ...customCategories].map((category) => (
                <button
                  key={category.name}
                  onClick={() => handleCategorySelect(category.name)}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center relative"
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{category.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">5 words</p>
                  {category.isCustom && (
                    <span className="absolute top-2 right-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Custom
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : showSummary ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-center dark:text-white">Category Complete!</h2>
              <p className="text-xl text-center mb-6 dark:text-gray-300">
                You scored {correctAnswers} out of 5!
              </p>
              <div className="flex justify-center">
                <button
                  onClick={handleBackToCategories}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                >
                  Try Another Category
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">{selectedCategory}</h2>
              <p className="text-gray-600 dark:text-gray-300">Word {currentWordIndex + 1}/5</p>
            </div>

            {currentWord && (
              <div className="space-y-6">
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => speakText(currentWord.word)}
                    disabled={isSpeaking}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Volume2 className="w-5 h-5" /> Listen to Word
                  </button>
                  <button
                    onClick={() => speakText(currentWord.definition)}
                    disabled={isSpeaking}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <HelpCircle className="w-5 h-5" /> Hear Definition
                  </button>
                </div>

                <div className="space-y-4">
                  <WordDisplay 
                    userInput={userInput}
                    correctWord={currentWord.word}
                    showResult={showResult}
                  />
                  
                  {!showResult ? (
                    <>
                      <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                        placeholder="Type your answer..."
                      />

                      <button
                        onClick={handleSubmit}
                        disabled={!userInput}
                        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Submit
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleNextWord}
                      className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
                    >
                      {currentWordIndex < 4 ? 'Next Word' : 'Show Summary'}
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Custom Category Modal */}
      {showCustomCategoryModal && (
        <CustomCategoryModal
          onClose={() => setShowCustomCategoryModal(false)}
          onSave={handleSaveCustomCategory}
        />
      )}
    </div>
  );
}

export default App;