"use client";

import { useState } from 'react';
import axios from 'axios';

const UploadForm = ({ setOriginalImage, setAdversarialImage, setSsim, setResult, setFormSubmitted }) => {
    const [file, setFile] = useState(null);
    const [model] = useState('EfficientNetB0');
    const [method] = useState('FGSM');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            setError('');
        } else {
            setFile(null);
            setError('This file type is not supported. Please ensure your file is one of the following types and try again: .jpg, .jpeg, .png, .heic, .heif, .webp, .svg');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please upload an image first.');
            return;
        }

        setLoading(true);
        setResult('');
        setOriginalImage('');
        setAdversarialImage('');
        setSsim('');

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
            setOriginalImage(`data:image/png;base64,${response.data.original_image_b64}`);
            setAdversarialImage(`data:image/png;base64,${response.data.adversarial_image_b64}`);
            setSsim(response.data.ssim);
            setLoading(false);
            setFormSubmitted(true);
        } catch (error) {
            console.error('Error uploading file:', error);
            setResult('Error uploading file');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto mt-8">
            <div
                className=" shadow-lg rounded-xl overflow-hidden"
                style={{ backgroundImage: 'url(/form-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="px-8 py-12 sm:px-12 sm:py-16">
                    <div className="bg-white bg-opacity-80 backdrop-blur-sm backdrop-filter flex items-center flex-col border border-gray-200 rounded-xl px-8 py-6 max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-2">Protect your images</h2>
                        <p className="text-gray-600 mb-6 text-center">
                            Strengthen your images against adversarial attacks with our easy-to-use protection tools. Upload an image and get your protected image.
                        </p>
                        <div className="flex flex-col items-center">
                            <input
                                type="file"
                                id="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="file"
                                className="mb-2 inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 cursor-pointer"
                            >
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                                    <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
                                </svg>
                                Upload your image
                            </label>
                            <p className="text-sm text-gray-500 mb-2">or drop it here</p>
                            {file && <p className="text-sm text-gray-600 mb-2">Selected file: {file.name}</p>}
                            {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                                Protect Image
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {loading && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                        <p className="mt-5 text-center text-gray-700">👇 Protecting your image...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadForm;