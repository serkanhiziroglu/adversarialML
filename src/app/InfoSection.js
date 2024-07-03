const InfoSection = () => (
    <div className="max-w-6xl mx-auto mt-12 bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">How to protect an image</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
                <div className="bg-purple-100 rounded-lg p-3 mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                        <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Upload an image</h3>
                <p className="text-gray-600 text-center">Select the "Upload your image" button or easily drag and drop your files into the section.</p>
            </div>
            <div className="flex flex-col items-center">
                <div className="bg-purple-100 rounded-lg p-3 mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Protect image</h3>
                <p className="text-gray-600 text-center">Our AI strengthens your image against adversarial attacks.</p>
            </div>
            <div className="flex flex-col items-center">
                <div className="bg-purple-100 rounded-lg p-3 mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Download protected image</h3>
                <p className="text-gray-600 text-center">Get your reinforced image ready for use.</p>
            </div>
        </div>
    </div>
);

export default InfoSection;