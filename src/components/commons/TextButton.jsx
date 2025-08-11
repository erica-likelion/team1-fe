const TextButton = ({ text, onClick, disabled = false}) => {
    return (
     
        <button
                onClick={onClick}
                disabled={disabled}
                // 입력값이 적용되지 않았을 때 버튼값 css 넣어야함
                >
                {text}
        </button>
       
    );
}

export default TextButton;