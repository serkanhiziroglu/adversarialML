"use client";

import { useState, useEffect } from 'react';
import ResultDisplay from '../../components/ResultDisplay';
import { useRouter } from 'next/navigation';

export default function Result() {
    const [originalImage, setOriginalImage] = useState('');
    const [adversarialImage, setAdversarialImage] = useState('');
    const [ssim, setSsim] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const router = useRouter();

    useEffect(() => {
        const storedData = localStorage.getItem('resultData');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setOriginalImage(`data:image/png;base64,${parsedData.original_image_b64}`);
            setAdversarialImage(`data:image/png;base64,${parsedData.adversarial_image_b64}`);
            setSsim(parsedData.ssim);
            setResult(parsedData.result);
        }
    }, []);

    const resetForm = () => {
        localStorage.removeItem('resultData');
        router.push('/');
    };

    return (
        <ResultDisplay
            loading={loading}
            originalImage={originalImage}
            adversarialImage={adversarialImage}
            ssim={ssim}
            result={result}
            resetForm={resetForm}
        />
    );
}