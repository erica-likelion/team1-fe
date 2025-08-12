const TextButton = ({ text, icon, onClick, disabled = false, className=""}) => {
    return (
        <button
                onClick={onClick}
                disabled={disabled}
                className={`flex items-center justify-center py-3 gap-2.5 bg-[#3DE0AB]
                     text-[#FAFAFA] font-medium rounded-lg hover:cursor-pointer
                     fixed bottom-5 left-1/2 transform -translate-x-1/2 max-w-[375px] w-full z-50 ${className}`}
                >
                {text}
                {icon && 
                <img src={icon} className="inline" />}
        </button>
    );
}

export default TextButton;