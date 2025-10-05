import React, { useState } from 'react';
import Appbar from "../components/AppBar";
import { BACKEND_URL } from "../Config";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const MAX_CONTENT_LENGTH = 600;

export default function Publish() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const Navigate = useNavigate();

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
      Navigate('/blogs');
    })
    .catch(error => {
      console.error('Error publishing blog:', error);
      alert('Failed to publish blog. Please try again.');
      setIsPublishing(false);
    });
  };

  return (
    <>
      <Appbar />
      <div className="flex justify-center">
        <div className="max-w-screen-lg w-full">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 focus:outline-none focus:border-black bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5"
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
          onClick={handlePublish}
          disabled={!canPublish}
          className={`bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow ${
            !canPublish ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isPublishing ? 'Publishing...' : 'Publish'}
        </button>
      </div>
    </>
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
            className="focus:outline-none focus:border-black p-2.5 mt-4 block h-64 w-full text-sm text-gray-900 bg-gray-50 border border-gray-100"
            placeholder="Write your thoughts here..."
          />
          <div className="flex justify-between items-center mt-2 text-sm">
            <span className={`font-medium ${isOverLimit ? 'text-red-600' : 'text-gray-600'}`}>
              {currentLength} / {maxLength} characters
            </span>
            {isOverLimit && (
              <span className="text-red-600 font-semibold">
                {Math.abs(remainingChars)} characters over limit!
              </span>
            )}
            {!isOverLimit && remainingChars <= 50 && remainingChars > 0 && (
              <span className="text-orange-500">
                {remainingChars} characters remaining
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}