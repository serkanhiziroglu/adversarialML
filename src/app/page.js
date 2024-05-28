"use client";

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [model, setModel] = useState('');
  const [method, setMethod] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleModelChange = (e) => {
    setModel(e.target.value);
  };

  const handleMethodChange = (e) => {
    setMethod(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(file, model, method);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Upload an Image for Adversarial Testing
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm">
            <div className="flex flex-col items-center justify-center space-y-2">
              <label htmlFor="file" className="sr-only">Upload Image</label>
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file"
                className="cursor-pointer bg-indigo-600 text-white py-2 px-4 rounded-md text-center w-full"
              >
                {file ? file.name : "Choose File"}
              </label>
            </div>
            <div className="flex items-center justify-center space-y-2">
              <label htmlFor="model" className="sr-only">Select Model</label>
              <select
                id="model"
                value={model}
                onChange={handleModelChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-center"
              >
                <option value="" disabled>Select Model</option>
                <option value="EfficientNetB0">EfficientNetB0</option>
                <option value="ResNet50">ResNet50</option>
                <option value="InceptionV3">InceptionV3</option>
                {/* Add more models as needed */}
              </select>
            </div>
            <div className="flex items-center justify-center space-y-2">
              <label htmlFor="method" className="sr-only">Select Adversarial Method</label>
              <select
                id="method"
                value={method}
                onChange={handleMethodChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-center"
              >
                <option value="" disabled>Select Adversarial Method</option>
                <option value="pgd">PGD</option>
                <option value="fgsm">FGSM</option>
                {/* Add more methods as needed */}
              </select>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 