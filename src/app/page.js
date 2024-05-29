"use client";

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [file, setFile] = useState(null);
  const [model, setModel] = useState('');
  const [method, setMethod] = useState('');
  const [result, setResult] = useState('');
  const [originalImage, setOriginalImage] = useState('');
  const [adversarialImage, setAdversarialImage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
    } else {
      alert('Please upload a valid image file.');
      setFile(null);
    }
  };

  const handleModelChange = (e) => {
    setModel(e.target.value);
  };

  const handleMethodChange = (e) => {
    setMethod(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !model || !method) {
      alert('Please fill out all fields and upload an image.');
      return;
    }

    setLoading(true);
    setResult('');
    setOriginalImage('');
    setAdversarialImage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', model);
    formData.append('method', method);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', response);  // Log the response for debugging
      setOriginalImage(`data:image/png;base64,${response.data.original_image_b64}`);
      setAdversarialImage(`data:image/png;base64,${response.data.adversarial_image_b64}`);
      setLoading(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      setResult('Error uploading file');
      setLoading(false);
    }
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
                accept="image/*"
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
                <option value="InceptionV3">InceptionV3</option>
                <option value="ResNet50">ResNet50</option>

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
                <option value="PGD">PGD</option>
                <option value="FGSM">FGSM</option>
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
        {loading && (
          <div className="flex flex-col items-center justify-center">
            <div className="spinner" role="status"></div>
          </div>
        )}
        {result && (
          <div className="mt-6">
            <h2 className="text-center text-xl font-bold text-gray-900">Results:</h2>
            <pre className="mt-2 bg-gray-200 p-4 rounded-md text-sm text-gray-800 whitespace-pre-wrap">{result}</pre>
          </div>
        )}
        {originalImage && (
          <div className="mt-6">
            <h2 className="text-center text-xl font-bold text-gray-900">Original Image:</h2>
            <img src={originalImage} alt="Original" className="mt-2" />
          </div>
        )}
        {adversarialImage && (
          <div className="mt-6">
            <h2 className="text-center text-xl font-bold text-gray-900">Adversarial Image:</h2>
            <img src={adversarialImage} alt="Adversarial" className="mt-2" />
            <div className="pb-10"></div>  {/* Add some padding at the bottom */}
          </div>
        )}
      </div>
    </div>
  );
}