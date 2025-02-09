import React, { useState } from 'react';
import { X, Plus, Trash2, AlertCircle } from 'lucide-react';
import type { Word } from '../data/words';

interface CustomCategoryModalProps {
  onClose: () => void;
  onSave: (categoryName: string, words: Word[]) => void;
}

export function CustomCategoryModal({ onClose, onSave }: CustomCategoryModalProps) {
  const [categoryName, setCategoryName] = useState('');
  const [words, setWords] = useState<Word[]>([
    { word: '', definition: '' }
  ]);
  const [error, setError] = useState<string | null>(null);

  const handleAddWord = () => {
    setWords([...words, { word: '', definition: '' }]);
    setError(null);
  };

  const handleRemoveWord = (index: number) => {
    setWords(words.filter((_, i) => i !== index));
  };

  const handleWordChange = (index: number, field: keyof Word, value: string) => {
    const newWords = [...words];
    newWords[index] = { ...newWords[index], [field]: value };
    setWords(newWords);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!categoryName.trim()) {
      setError('Please enter a category name');
      return;
    }

    if (words.length < 5) {
      setError('Please add at least 5 words');
      return;
    }

    if (words.some(word => !word.word.trim() || !word.definition.trim())) {
      setError('Please fill in all words and definitions');
      return;
    }

    onSave(categoryName, words);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold dark:text-white">Create Custom Category</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={(e) => {
                setCategoryName(e.target.value);
                setError(null);
              }}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
              placeholder="Enter category name"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold dark:text-white">Words</h3>
              <button
                type="button"
                onClick={handleAddWord}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <Plus className="w-4 h-4" /> Add Word
              </button>
            </div>

            {words.map((word, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium dark:text-white">Word {index + 1}</span>
                  {words.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveWord(index)}
                      className="p-1 text-red-500 hover:bg-red-100 rounded-full"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={word.word}
                  onChange={(e) => handleWordChange(index, 'word', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                  placeholder="Enter word"
                />
                <input
                  type="text"
                  value={word.definition}
                  onChange={(e) => handleWordChange(index, 'definition', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                  placeholder="Enter definition"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            {error && (
              <div className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save Category
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}