"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ResultPage = () => {
    const [adversarialImage, setAdversarialImage] = useState('');
    const [ssim, setSsim] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const storedData = localStorage.getItem('resultData');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setAdversarialImage(`data:image/png;base64,${parsedData.adversarial_image_b64}`);
            setSsim(parsedData.ssim);
        }
    }, []);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = adversarialImage;
        link.download = 'protected_image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const resetForm = () => {
        localStorage.removeItem('resultData');
        router.push('/');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {adversarialImage && (
                <div className="bg-white rounded-lg p-8 max-w-4xl mx-auto">
                    <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">Your Protected Image is Ready!</h2>
                    <p className="text-center text-gray-600 mb-6">
                        Your image has been successfully protected with adversarial perturbations.
                        This makes it more resistant to AI-based attacks while remaining visually similar to the original.
                    </p>
                    <div className="mb-6">
                        <h3 className="text-center text-xl font-semibold text-gray-700 mb-4">Adversarial Image:</h3>
                        <div className="mb-6 flex justify-center">
                            <img
                                src={adversarialImage}
                                alt="Adversarial"
                                className="max-w-full h-auto rounded shadow-md border border-gray-200"
                            />
                        </div>
                    </div>
                    <div className="text-center mb-6">
                        <p className="text-sm text-gray-500">Protected using FGSM (Fast Gradient Sign Method)</p>
                        <p className="text-sm text-gray-500 mt-2">
                            SSIM (Structural Similarity Index): <span className="font-semibold">{ssim}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            (SSIM ranges from 0 to 1, where 1 indicates perfect similarity)
                        </p>
                    </div>
                    <p className="text-center text-gray-600 mb-4">
                        You can now download your protected image or try again with a different image.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={handleDownload}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                        >
                            Download Image
                        </button>
                        <button
                            onClick={resetForm}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResultPage;