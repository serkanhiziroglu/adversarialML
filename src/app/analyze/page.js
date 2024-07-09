"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import AnalyzeForm from '../../components/AnalyzeForm';
import Results from '../../components/AnalyzeResults';

export default function AdvancedTesting() {
    const [result, setResult] = useState(null);

    const handleResult = (data) => {
        setResult(data);
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="overflow-hidden">
                    <div className="p-8">
                        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Advanced Testing</h1>
                        <p className="text-center text-gray-600 mb-8">
                            Upload an image to test it against three different models.
                        </p>
                        <AnalyzeForm onResult={handleResult} />
                        {result && <Results result={result} />}
                    </div>
                </div>
            </div>
        </div>
    );
}