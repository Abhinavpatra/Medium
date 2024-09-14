import React, { useState } from 'react';
import Appbar from "../components/AppBar";
import { BACKEND_URL } from "../Config";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function Publish() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const Navigate=useNavigate();
  const handlePublish = () => {
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
    })
    .catch(error => {
      console.error('Error publishing blog:', error);
    })
    .finally(() => {
      Navigate('/blogs');
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

      <TextEditor content={content} setContent={setContent} />

      <div className="flex justify-center">
        <button
          onClick={handlePublish}
          className="mt-4 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
        >
          Publish
        </button>
      </div>
    </>
  );
}

export function TextEditor({ content, setContent }:{
  content: string,
    setContent: React.Dispatch<React.SetStateAction<string>>
}) {
  return (
    <div className="items-center">
      <div className="flex justify-center">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="focus:outline-none focus:border-black p-2.5 mt-4 block h-64 w-4/6 text-sm text-gray-900 bg-gray-50 border border-gray-100"
          placeholder="Write your thoughts here..."
        />
      </div>
    </div>
  );
}
