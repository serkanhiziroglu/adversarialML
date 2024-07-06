export default function FAQ() {
    return (
        <div className="flex flex-col items-center">
            <div className="max-w-4xl mx-auto px-4 py-8 text-center">
                <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
                <div className="mt-6">
                    <h2 className="text-xl font-semibold">What is Adversarial Image Protection?</h2>
                    <p className="mt-2">Adversarial Image Protection is a method to strengthen your images against AI-based adversarial attacks, ensuring that they are secure and resistant to unauthorized manipulation or analysis.</p>
                </div>
                <div className="mt-6">
                    <h2 className="text-xl font-semibold">How do I protect my images online?</h2>
                    <p className="mt-2">Protecting your images online is simple:</p>
                    <ol className="list-decimal list-inside mt-2">
                        <li>Upload an image: Click on the "Upload your image" button or drag and drop your file. Our system supports various image formats.</li>
                        <li>Apply protection: Our system will automatically apply adversarial protection to your image, enhancing its security.</li>
                        <li>Download protected image: Once processed, download your high-resolution, protected image ready for safe sharing or online use.</li>
                    </ol>
                </div>
                <div className="mt-6">
                    <h2 className="text-xl font-semibold">What image formats are supported?</h2>
                    <p className="mt-2">Our system accepts a wide range of image formats including JPEG, PNG, BMP, and GIF.</p>
                </div>
                <div className="mt-6">
                    <h2 className="text-xl font-semibold">Is there a limit to the number of images I can protect?</h2>
                    <p className="mt-2">No, you can protect as many images as you need. There are no limits on the number of images you can upload and protect.</p>
                </div>
                <div className="mt-6">
                    <h2 className="text-xl font-semibold">Will the quality of my image be affected?</h2>
                    <p className="mt-2">No, the quality of your image will remain high. The protection process ensures that your image is secure without compromising on resolution or quality.</p>
                </div>
                <div className="mt-6">
                    <h2 className="text-xl font-semibold">How long does it take to process an image?</h2>
                    <p className="mt-2">The processing time is typically very short, usually taking just a few seconds to apply the protection and make the image ready for download.</p>
                </div>
                <div className="mt-6">
                    <h2 className="text-xl font-semibold">Can I use the protected images on social media?</h2>
                    <p className="mt-2">Yes, the protected images can be safely shared on social media platforms.</p>
                </div>
            </div>
        </div>
    )
}