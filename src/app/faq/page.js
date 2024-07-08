import FAQContent from './FAQContent';
import ImageHeader from './ImageHeader';

export default function FAQ() {
    return (
        <div className="flex flex-col items-center">

            <div className="max-w-4xl mx-auto px-4 py-8 text-center">
                <ImageHeader />
                <h1 className="mt-6 text-3xl font-bold">Frequently Asked Questions</h1>
                {FAQContent.map((faq, index) => (
                    <div className="mt-6" key={index}>
                        <h2 className="text-xl font-semibold">{faq.question}</h2>
                        <p className="mt-2">{faq.answer}</p>
                        {faq.steps && (
                            <ol className="list-decimal list-inside mt-2">
                                {faq.steps.map((step, idx) => (
                                    <li key={idx}>{step}</li>
                                ))}
                            </ol>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}