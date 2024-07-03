// page.js
"use client";

import { useState } from 'react';
import UploadForm from './UploadForm';
import ResultDisplay from './ResultDisplay';
import InfoSection from './InfoSection';

export default function Home() {
  const [originalImage, setOriginalImage] = useState('');
  const [adversarialImage, setAdversarialImage] = useState('');
  const [ssim, setSsim] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white bg-opacity-90 shadow-lg rounded-lg p-8 max-w-4xl mx-auto">
        {!formSubmitted ? (
          <>
            <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
              Strengthen your images against adversarial attacks with our easy-to-use protection tools.
            </h2>
            <UploadForm
              setOriginalImage={setOriginalImage}
              setAdversarialImage={setAdversarialImage}
              setSsim={setSsim}
              setLoading={setLoading}
              setResult={setResult}
              setFormSubmitted={setFormSubmitted}
            />
            <InfoSection />
          </>
        ) : (
          <ResultDisplay
            loading={loading}
            originalImage={originalImage}
            adversarialImage={adversarialImage}
            ssim={ssim}
            result={result}
            setFormSubmitted={setFormSubmitted}
          />
        )}
      </div>
    </div>
  );
}