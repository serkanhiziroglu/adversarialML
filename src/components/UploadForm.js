"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import './ProtectButton.css'; // Import the CSS file for the button

const UploadForm = () => {
    const [file, setFile] = useState(null);
    const [model] = useState('EfficientNetB0');
    const [method] = useState('FGSM');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

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

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            localStorage.setItem('resultData', JSON.stringify(response.data));
            router.push('/result');
        } catch (error) {
            console.error('Error uploading file:', error);
            let errorMessage = 'Error uploading file';

            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                errorMessage = error.response.data.message || error.response.statusText;
            } else if (error.request) {
                // The request was made but no response was received
                errorMessage = 'No response received from server. Please check your connection.';
            } else {
                // Something happened in setting up the request that triggered an Error
                errorMessage = error.message;
            }

            setError(errorMessage);
            setLoading(false);
        }
    };
    return (
        <div className="max-w-6xl mx-auto mt-8">
            <div className="shadow-lg rounded-xl overflow-hidden relative">
                <Image
                    src="/form-bg-11.png"
                    alt="Background"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    priority
                />
                <div className="px-8 py-12 sm:px-12 sm:py-16 relative z-10">
                    <div className="bg-white bg-opacity-80 backdrop-blur-sm backdrop-filter flex items-center justify-center border border-gray-200 rounded-xl px-6 py-4 max-w-3xl mx-auto transition-all duration-300 hover:bg-opacity-90 group relative">
                        <div className="absolute inset-2 border border-dashed border-transparent group-hover:border-gray-300 rounded-lg pointer-events-none"></div>

                        <div className="w-full h-full flex flex-col items-center justify-center z-10 px-4 py-8">
                            <h2 className="text-3xl font-bold mb-2">Protect your images</h2>
                            <p className="text-gray-600 mb-6 text-center">
                                Strengthen your images against adversarial attacks with our easy-to-use protection tools. Upload an image and get your protected image.
                            </p>
                            <motion.div
                                id="file-selector-container"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                                className="flex flex-col items-center"
                            >
                                <input
                                    type="file"
                                    id="file-selector"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="file-selector"
                                    className="mb-2 inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                                        <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
                                    </svg>
                                    Upload your image
                                </label>
                                <p className="text-sm text-gray-500 mb-2">or drop it here</p>
                                <motion.button
                                    whileHover={{
                                        y: [0, -2, 0], // Moves the button up and down
                                        transition: { yoyo: Infinity, duration: 0.5 },
                                    }}
                                    onClick={handleSubmit}
                                    className="button-49 mt-4"
                                >
                                    Protect Image
                                </motion.button>
                            </motion.div>
                            {(error || file) && (
                                <p className="text-sm mt-2 absolute bottom-5">
                                    {error ? (
                                        <span className="text-red-600">{error}</span>
                                    ) : (
                                        <span className="text-gray-600">Selected file: {file.name}</span>
                                    )}
                                </p>
                            )}
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