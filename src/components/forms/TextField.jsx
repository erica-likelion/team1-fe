const TextField = ({
    value,
    onChange,
    placeholder,
    ref,
    maxLength = 150,
    type = "text",
    height = "h-14",
    multiline = false,  // textarea 사용 여부
    className = ""
}) => (
    <label>
        {multiline ? (
            <textarea
                className={`
                    flex flex-row items-start
                    p-4 gap-2.5 w-[335px] border border-gray-200 rounded-md 
                    placeholder:text-gray-400 outline-none focus:border-blue-400
                    resize-none
                    ${height}
                    ${className}
                `}
                value={value}
                maxLength={maxLength}
                onChange={e => onChange?.(e.target.value)}
                placeholder={placeholder}
            />
        ) : (
        
        <input
            className="
                flex flex-row items-start
                p-4 gap-2.5 w-[335px] border border-gray-200 rounded-md placeholder:text-gray-400 mb-2
                
                [appearance:textfield]
                     [&::-webkit-calendar-picker-indicator]:opacity-0
                     [&::-webkit-calendar-picker-indicator]:pointer-events-none"//html5 date 달력 아이콘 제거
            type = {type}
            value={value}
            maxLength={maxLength}
            onChange={e => onChange?.(e.target.value)}
            placeholder={placeholder}
            ref={ref}
            height={height}
            lang="en-US"
            />
        )}
    </label>


)

export default TextField;