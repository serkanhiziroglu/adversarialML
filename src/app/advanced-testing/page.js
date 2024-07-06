"use client";

import { useState } from 'react';
import AdvancedTestingForm from '../../components/AdvancedTestingForm';
import ResultDisplay from '../../components/ResultDisplay';

export default function AdvancedTesting() {
    const [result, setResult] = useState(null);

    const handleResult = (data) => {
        setResult(data);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div className="p-8">
                    <h1 className="text-3xl font-bold text-center mb-6">Advanced Testing</h1>
                    <p className="text-center text-gray-600 mb-8">
                        Are you sure your adversarial method worked? Let's try! Here you can select various models to test your image against.
                    </p>
                    <AdvancedTestingForm onResult={handleResult} />
                    {result && (
                        <ResultDisplay
                            loading={false}
                            originalImage={`data:image/png;base64,${result.original_image_b64}`}
                            adversarialImage={`data:image/png;base64,${result.adversarial_image_b64}`}
                            prediction={result.prediction}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}