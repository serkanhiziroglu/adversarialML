// InfoSection.js
const InfoSection = () => {
    return (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <h3 className="mt-2 text-xl font-semibold">Upload an image</h3>
                <p className="mt-1 text-gray-500">Select or drag and drop your image into the upload area.</p>
            </div>
            <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h3 className="mt-2 text-xl font-semibold">Protect image</h3>
                <p className="mt-1 text-gray-500">Our AI strengthens your image against adversarial attacks.</p>
            </div>
            <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <h3 className="mt-2 text-xl font-semibold">Download protected image</h3>
                <p className="mt-1 text-gray-500">Get your reinforced image ready for use.</p>
            </div>
        </div>
    );
};

export default InfoSection;