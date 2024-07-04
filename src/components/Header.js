"use client";
export const Header = ({ onReset }) => (
    <header className="bg-neutral-700 shadow-sm mb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex justify-between items-center py-4">
                <h1
                    className="text-3xl font-bold text-white cursor-pointer relative group"
                    onClick={onReset}
                >
                    <span className="relative z-10 ">Adversarial Image Protection</span>
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-in-out"></span>
                </h1>
            </div>
        </div>
    </header>
);
