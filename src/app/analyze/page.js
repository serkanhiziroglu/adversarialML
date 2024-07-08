"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import AdvancedTestingForm from '../../components/AdvancedTestingForm';

export default function AdvancedTesting() {
    const [result, setResult] = useState(null);

    const handleResult = (data) => {
        setResult(data);
    };

    return (
        <div className=" px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="overflow-hidden">
                    <div className="p-8">
                        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Advanced Testing</h1>
                        <p className="text-center text-gray-600 mb-8">
                            Upload an image to test it against three different models.
                        </p>
                        <AdvancedTestingForm onResult={handleResult} />
                        {result && (
                            <motion.div
                                className="mt-12 bg-white p-8 shadow-lg rounded-lg"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Results</h2>
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="flex-1">
                                        <img
                                            src={`data:image/png;base64,${result.original_image_b64}`}
                                            alt="Uploaded image"
                                            className="w-full h-auto rounded-lg shadow-md"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        {Object.entries(result.predictions).map(([modelName, prediction]) => (
                                            <div key={modelName} className="mb-6 bg-gray-50 rounded-lg p-4 shadow">
                                                <h3 className="text-xl font-semibold mb-2 text-gray-800">{modelName}</h3>
                                                <p className="text-gray-600">Label: <span className="font-medium">{prediction.label}</span></p>
                                                <p className="text-gray-600">Confidence: <span className="font-medium">{(prediction.confidence * 100).toFixed(2)}%</span></p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}