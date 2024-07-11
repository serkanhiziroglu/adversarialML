const InfoSection = () => (
    <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">How to protect an image online?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card color="hover:bg-red-300" title="Upload an image" description="Select the 'Upload your image' button or easily drag and drop your file. Our system accepts various image formats." iconPath="M12.75 13.81v7.44a.75.75 0 11-1.5 0v-7.4L9.49 15.6a.75.75 0 11-1.06-1.06l2.35-2.36c.68-.68 1.8-.68 2.48 0l2.35 2.36a.75.75 0 11-1.06 1.06l-1.8-1.8zM9 18v1.5H6.75v-.01A5.63 5.63 0 015.01 8.66a6 6 0 0111.94-.4 5.63 5.63 0 01.3 11.23v.01H15V18h1.88a4.12 4.12 0 10-1.5-7.97A4.51 4.51 0 0011 4.5a4.5 4.5 0 00-4.43 5.29 4.13 4.13 0 00.68 8.2V18H9z" />
            <Card color="hover:bg-blue-300" title="Apply protection" description="Our system will automatically apply adversarial protection to your image, making it resistant to AI-based attacks." iconPath="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zm0-2.5c-1.5-1.1-6-4.5-6-7.5V6.5l6-2.25 6 2.25v5.5c0 3-4.5 6.4-6 7.5z" />
            <Card color="hover:bg-green-300" title="Download protected image" description="Once processed, download your protected image in high-resolution format, ready to be safely shared or used online." iconPath="M11.25 15.85l-4.38-4.38a.75.75 0 00-1.06 1.06l4.95 4.95c.69.68 1.8.68 2.48 0l4.95-4.95a.75.75 0 10-1.06-1.06l-4.38 4.38V4.25a.75.75 0 10-1.5 0v11.6zm-7.5 3.4h16.5a.75.75 0 110 1.5H3.75a.75.75 0 110-1.5z" />
        </div>
    </div>
);

const Card = ({ color, title, description, iconPath }) => (
    <div className={`bg-gray-200 rounded-2xl p-6 shadow-lg ${color} transition duration-300`}>
        <div className="flex items-center mb-4 gap-4">
            <div className="bg-[#39373a] flex items-center justify-center w-12 h-12 rounded-lg">
                <svg className="w-6 h-6" fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d={iconPath} />
                </svg>
            </div>
            <h3 className="text-lg font-bold">{title}</h3>
        </div>
        <p className="text-zinc-900/[0.6] text-center">{description}</p>
    </div>
);

export default InfoSection;