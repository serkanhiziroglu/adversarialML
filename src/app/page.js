"use client";

import { useState } from 'react';
import UploadForm from './UploadForm';
import ResultDisplay from './ResultDisplay';
import InfoSection from './InfoSection';
import RootLayout from './layout';
import { CSSTransition } from 'react-transition-group';

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
    <RootLayout handleTryAgain={resetForm}>
      <div className="min-h-screen">
        <CSSTransition
          in={!formSubmitted}
          timeout={300}
          classNames="fade"
          unmountOnExit
        >
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
        </CSSTransition>
        <CSSTransition
          in={formSubmitted}
          timeout={300}
          classNames="fade"
          unmountOnExit
        >
          <ResultDisplay
            loading={loading}
            originalImage={originalImage}
            adversarialImage={adversarialImage}
            ssim={ssim}
            result={result}
            resetForm={resetForm}
          />
        </CSSTransition>
      </div>
    </RootLayout>
  );
}