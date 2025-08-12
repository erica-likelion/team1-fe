const TextField = ({
    value,
    onChange,
    placeholder,
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
                p-4 gap-2.5 w-[335px] border border-gray-200 rounded-md placeholder:text-gray-400 mb-2"
            type = {type}
            value={value}
            maxLength={maxLength}
            onChange={e => onChange?.(e.target.value)}
            placeholder={placeholder}
            height={height}
            />
        )}
    </label>


)

export default TextField;