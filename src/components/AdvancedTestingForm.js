import { useState } from 'react';
import axios from 'axios';

const AdvancedTestingForm = ({ onResult }) => {
    const [file, setFile] = useState(null);
    const [model, setModel] = useState('EfficientNetB0');
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

        const formData = new FormData();
        formData.append('file', file);
        formData.append('model', model);

        try {
            const response = await axios.post('http://localhost:5000/advanced-testing', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onResult(response.data);
        } catch (error) {
            console.error('Error uploading file:', error.response ? error.response.data : error);
            setError(error.response ? error.response.data.error : 'Error uploading file');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
                        Upload Image
                    </label>
                    <input
                        type="file"
                        id="file"
                        onChange={handleFileChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="model">
                        Select Model
                    </label>
                    <select
                        id="model"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="EfficientNetB0">EfficientNetB0</option>
                        <option value="InceptionV3">InceptionV3</option>
                        <option value="MobileNetV2">MobileNetV2</option>
                    </select>
                </div>
                {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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