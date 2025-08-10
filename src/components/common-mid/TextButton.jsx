const TextButton = ({ text, onClick, disabled = false}) => {
    return (
        // 스타일값 적용을 위한 div
        <div>
            <button
                onClick={onClick}
                disabled={disabled}
                // 입력값이 적용되지 않았을 때 버튼값 css 넣어야함
                >
                {text}
            </button>
        </div>
    );
}

export default TextButton;