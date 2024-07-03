"use client";

import { useState } from 'react';
import axios from 'axios';

const UploadForm = ({ setOriginalImage, setAdversarialImage, setSsim, setResult, setFormSubmitted }) => {
    const [file, setFile] = useState(null);
    const [model, setModel] = useState('');
    const [method, setMethod] = useState('');
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
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
                <h2 className="text-3xl font-bold text-center mb-6">Protect Images from Adversarial Attacks</h2>
                <p className="text-center text-gray-600 mb-8">
                    Strengthen your images against adversarial attacks with our easy-to-use protection tools.
                    Upload an image, choose a model and method, and get your protected image.
                </p>
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                        type="file"
                        id="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <label
                        htmlFor="file"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 cursor-pointer"
                    >
                        Upload your image
                    </label>
                    <p className="mt-2 text-sm text-gray-600">or drop it here</p>
                    {file && <p className="mt-2 text-sm text-gray-600">Selected file: {file.name}</p>}
                </div>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="model" className="block text-sm font-medium text-gray-700">Select Model</label>
                        <select
                            id="model"
                            value={model}
                            onChange={handleModelChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                        >
                            <option value="" disabled>Select Model</option>
                            <option value="EfficientNetB0">EfficientNetB0</option>
                            <option value="InceptionV3">InceptionV3</option>
                            <option value="MobileNetV2">MobileNetV2</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="method" className="block text-sm font-medium text-gray-700">Select Adversarial Method</label>
                        <select
                            id="method"
                            value={method}
                            onChange={handleMethodChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                        >
                            <option value="" disabled>Select Adversarial Method</option>
                            <option value="FGSM">FGSM</option>
                            <option value="PGD">PGD</option>
                            <option value="Carlini & Wagner Attack">Carlini & Wagner Attack</option>
                        </select>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                            Protect Image
                        </button>
                    </div>
                </form>
            </div>
            {loading && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                        <p className="mt-4 text-center text-gray-700">Protecting your image...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadForm;