const TextButton = ({ text, progress = "", icon, onClick, disabled = false, className=""}) => {
    const [current, total] = progress?.split('/');

    return (
        <button
                onClick={onClick}
                disabled={disabled}
                className={`flex flex-row justify-center items-center 
                            px-5 py-3 gap-2.5
                            font-semibold rounded-md
                     ${disabled 
                        ? "bg-gray-200 text-white cursor-not-allowed" 
                        : "bg-[#3DE0AB] text-white hover:cursor-pointer hover:bg-[#00C88D] active:bg-[#00C88D]"}    
                     fixed bottom-5 left-1/2 transform -translate-x-1/2 max-w-[335px] w-full z-50 ${className}`}
                >
                {text}
                {progress && <div className="flex gap-0.5 font-medium">
                    <p>{current}</p>
                    <p>{'/'}</p>
                    <p>{total}</p>
                </div>}
                {icon && 
                <img src={icon} className="inline" />}
        </button>
    );
}

export default TextButton;
