import React, { useState } from 'react';
import Appbar from "../components/AppBar";
import { BACKEND_URL } from "../Config";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useSound } from "../hooks/use-sound";
import { click003Sound } from "../lib/click-003";
import { successChimeSound } from "../lib/success-chime";
import { error001Sound } from "../lib/error-001";

const MAX_CONTENT_LENGTH = 600;

export default function Publish() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const Navigate = useNavigate();

  const [playClick] = useSound(click003Sound, { volume: 0.5 });
  const [playSuccess] = useSound(successChimeSound, { volume: 0.5 });
  const [playError] = useSound(error001Sound, { volume: 0.4 });

  const contentLength = content.length;
  const isContentValid = contentLength > 0 && contentLength <= MAX_CONTENT_LENGTH;
  const isTitleValid = title.trim().length > 0;
  const canPublish = isContentValid && isTitleValid && !isPublishing;

  const handlePublish = () => {
    if (!canPublish) return;

    setIsPublishing(true);
    axios.post(`${BACKEND_URL}/api/v1/blog/new-post`, {
      title,
      content,
    }, {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    })
    .then(response => {
      console.log('Blog published:', response.data);
      playSuccess();
      Navigate('/blogs');
    })
    .catch(error => {
      console.error('Error publishing blog:', error);
      playError();
      alert('Failed to publish blog. Please try again.');
      setIsPublishing(false);
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Appbar />
      <div className="flex justify-center pt-8">
        <div className="max-w-5xl w-full">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 focus:outline-none focus:border-black dark:focus:border-white bg-gray-50 dark:bg-black border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5"
          />
        </div>
      </div>

      <TextEditor 
        content={content} 
        setContent={setContent}
        maxLength={MAX_CONTENT_LENGTH}
      />

      <div className="flex justify-center mt-4">
        <button
          onClick={() => {
            playClick();
            handlePublish();
          }}
          disabled={!canPublish}
          className={`bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-200 font-semibold py-2 px-4 border border-gray-400 dark:border-slate-600 rounded shadow ${
            !canPublish ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isPublishing ? 'Publishing...' : 'Publish'}
        </button>
      </div>
      </div>
  );
}

export function TextEditor({ 
  content, 
  setContent,
  maxLength 
}: {
  content: string,
  setContent: React.Dispatch<React.SetStateAction<string>>,
  maxLength: number
}) {
  const currentLength = content.length;
  const isOverLimit = currentLength > maxLength;
  const remainingChars = maxLength - currentLength;

  return (
    <div className="items-center">
      <div className="flex justify-center">
        <div className="w-4/6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="focus:outline-none focus:border-black dark:focus:border-white p-2.5 mt-4 block h-64 w-full text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-slate-700"
            placeholder="Write your thoughts here..."
          />
          <div className="flex justify-between items-center mt-2 text-sm">
            <span className={`font-medium ${isOverLimit ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
              {currentLength} / {maxLength} characters
            </span>
            {isOverLimit && (
              <span className="text-red-600 dark:text-red-400 font-semibold">
                {Math.abs(remainingChars)} characters over limit!
              </span>
            )}
            {!isOverLimit && remainingChars <= 50 && remainingChars > 0 && (
              <span className="text-orange-500 dark:text-orange-400">
                {remainingChars} characters remaining
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}