import Image from 'next/image';

const ResultDisplay = ({ loading, originalImage, adversarialImage, ssim, result, resetForm }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {loading && (
                <div className="flex flex-col items-center justify-center mt-4">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                    <p className="mt-2 text-xl text-gray-900">LOADING</p>
                </div>
            )}
            {!loading && (originalImage || adversarialImage) && (
                <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
                    {originalImage && (
                        <div className="mt-6">
                            <h2 className="text-center text-xl font-bold text-gray-900">Original Image:</h2>
                            <div className="mt-2 relative w-full h-64">
                                <Image
                                    src={originalImage}
                                    alt="Original"
                                    layout="fill"
                                    objectFit="contain"
                                />
                            </div>
                        </div>
                    )}
                    {adversarialImage && (
                        <div className="mt-6">
                            <h2 className="text-center text-xl font-bold text-gray-900">Adversarial Image:</h2>
                            <div className="mt-2 relative w-full h-64">
                                <Image
                                    src={adversarialImage}
                                    alt="Adversarial"
                                    layout="fill"
                                    objectFit="contain"
                                />
                            </div>
                            <p className="mt-2 mb-4 text-center font-bold text-sm text-gray-800">SSIM: {ssim}</p>
                            <div className="pb-10"></div>
                        </div>
                    )}
                    {result && (
                        <div className="mt-6">
                            <h2 className="text-center text-xl font-bold text-gray-900">Results:</h2>
                            <pre className="mt-2 bg-gray-200 p-4 rounded-md text-sm text-gray-800 whitespace-pre-wrap">{result}</pre>
                        </div>
                    )}
                    <div className="flex items-center justify-center mt-4">
                        <button
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            onClick={resetForm}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResultDisplay;