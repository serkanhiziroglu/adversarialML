"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import ProtectButton from './ProtectButton';
import FileInput from './FileInput';
import LoadingIndicator from '../LoadingIndicator'; // Importing the LoadingIndicator component

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
            const response = await axios.post('http://localhost:5000/protect', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            localStorage.setItem('resultData', JSON.stringify(response.data));
            router.push('/protect');
        } catch (error) {
            console.error('Error uploading file:', error);
            let errorMessage = 'Error uploading file';

            if (error.response) {
                errorMessage = error.response.data.error || error.response.statusText;
            } else if (error.request) {
                errorMessage = 'No response received from server. Please check your connection.';
            } else {
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
                                <FileInput onChange={handleFileChange} />
                                <p className="text-sm text-gray-500 mb-2">or drop it here</p>
                                <ProtectButton onClick={handleSubmit} />
                            </motion.div>
                            {(error || file) && (
                                <p className="text-sm mt-2 absolute bottom-5 text-overflow-ellipsis">
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
                <LoadingIndicator /> // Using the LoadingIndicator component
            )}

            <style jsx>{`
                .text-overflow-ellipsis {
                    max-width: 200px; /* Adjust as needed */
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            `}</style>
        </div>
    );
};

export default UploadForm;