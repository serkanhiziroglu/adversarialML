import { useState } from 'react';
import axios from 'axios';

const AdvancedTestingForm = ({ onResult }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            setError('');
        } else {
            setFile(null);
            setError('Please select a valid image file.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please upload an image first.');
            return;
        }

        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onResult(response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
            if (error.message === 'Network Error') {
                setError('Unable to connect to the server. Please make sure the advanced testing server is running.');
            } else {
                setError(error.response?.data?.error || 'An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto flex flex-col items-center justify-center">
            <form onSubmit={handleSubmit} className="space-y-6 w-full">
                <div className="flex flex-col items-center">
                    <input
                        type="file"
                        id="file"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <label
                        htmlFor="file"
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    >
                        Choose File
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                        {file ? `Selected file: ${file.name}` : 'No file chosen'}
                    </p>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Test Image'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdvancedTestingForm;