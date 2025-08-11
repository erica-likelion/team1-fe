import Right from "@assets/images/chevron_right.svg";

const TextButton = ({ text, onClick, disabled = false}) => {
    return (
     
        <button
                onClick={onClick}
                disabled={disabled}
                className={`
                    flex flex-row justify-center items-center
                    px-5 py-2 gap-2.5
                    w-80 h-12
                    rounded-xl font-medium
                    ${disabled 
                        ? "bg-gray-200 text-white cursor-not-allowed" 
                        : "bg-[#3DE0AB] text-white hover:bg-[#00C88D] active:bg-[#00C88D]"
                    }    
                    `}
                >
                {text}
                <div className="flex justify-end items-center">
                    <img className="w-6 h-6" src={Right} />
                </div>
        </button>
       
    );
}

export default TextButton;