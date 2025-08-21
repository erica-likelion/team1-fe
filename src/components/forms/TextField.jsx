const TextField = ({
    value,
    onChange,
    placeholder,
    ref,
    maxLength = 150,
    type = "text",
    height = "h-14",
    multiline = false,  // textarea 사용 여부
    className = "",
    prefix = "",  // 앞에 붙을 접두사 (예: +82)
    min = ""    // 최소값 (date, time, number 등에 사용)
}) => {
    if (multiline) {
        return (
            <label>
                <textarea
                    className={`
                        flex flex-row items-start
                        p-4 gap-2.5 w-[335px] border border-gray-200 rounded-md 
                        placeholder:text-gray-400 outline-none no-scrollbar
                        resize-none
                        ${height}
                        ${className}
                    `}
                    value={value}
                    maxLength={maxLength}
                    onChange={e => onChange?.(e.target.value)}
                    placeholder={placeholder}
                    min={min}
                />
            </label>
        );
    }

    // prefix가 있는 경우와 없는 경우를 구분
    if (prefix) {
        return (
            <label className="relative block">
                <div className="flex items-center w-[335px] border border-gray-200 rounded-md bg-gray-50">
                    <span className="px-4 text-gray-600 font-medium">
                        {prefix}
                    </span>
                    <input
                        className={`
                            flex-1 py-4 pr-4 bg-transparent border-transparent
                            placeholder:text-gray-400 outline-none no-scrollbar
                            ${height}
                            ${className}
                        `}
                        type={type}
                        value={value}
                        maxLength={maxLength}
                        onChange={e => onChange?.(e.target.value)}
                        placeholder={placeholder}
                        ref={ref}
                        lang="en-US"
                        min={min}
                    />
                </div>
            </label>
        );
    }

    // 기본 input
    return (
        <label>
            <input
                className={`
                    flex flex-row items-start
                    p-4 gap-2.5 w-[335px] border border-gray-200 rounded-md 
                    placeholder:text-gray-400 mb-2 outline-none
                    [appearance:textfield]
                    [&::-webkit-calendar-picker-indicator]:opacity-0
                    [&::-webkit-calendar-picker-indicator]:pointer-events-none
                    ${height}
                    ${className}
                `}
                type={type}
                value={value}
                maxLength={maxLength}
                onChange={e => onChange?.(e.target.value)}
                placeholder={placeholder}
                ref={ref}
                lang="en-US"
                min={min}
            />
        </label>
    );
};

export default TextField;