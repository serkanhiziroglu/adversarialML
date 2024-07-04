"use client";

import { useState } from 'react';
import UploadForm from '../components/UploadForm';
import ResultDisplay from '../components/ResultDisplay';
import InfoSection from '../components/InfoSection';
import { Header } from '../components/Header';
import Footer from '../components/Footer';  // Import the new Footer component

export default function Home() {
  const [originalImage, setOriginalImage] = useState('');
  const [adversarialImage, setAdversarialImage] = useState('');
  const [ssim, setSsim] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const resetForm = () => {
    setOriginalImage('');
    setAdversarialImage('');
    setSsim('');
    setResult('');
    setFormSubmitted(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onReset={resetForm} />
      <main className="flex-grow">
        {!formSubmitted && (
          <div>
            <UploadForm
              setOriginalImage={setOriginalImage}
              setAdversarialImage={setAdversarialImage}
              setSsim={setSsim}
              setLoading={setLoading}
              setResult={setResult}
              setFormSubmitted={setFormSubmitted}
            />
            <InfoSection />
          </div>
        )}
        {formSubmitted && (
          <ResultDisplay
            loading={loading}
            originalImage={originalImage}
            adversarialImage={adversarialImage}
            ssim={ssim}
            result={result}
            resetForm={resetForm}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}