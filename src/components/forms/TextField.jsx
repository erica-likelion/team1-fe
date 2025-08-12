const TextField = ({
    value,
    onChange,
    placeholder,
    maxLength = 150,
    type = "text"
}) => (
    <label>
        <input
            className="
                flex flex-row items-start
                p-4 gap-2.5 w-[335px] h-14 border border-gray-200 rounded-xl placeholder:text-gray-400"
            type = {type}
            value={value}
            maxLength={maxLength}
            onChange={e => onChange?.(e.target.value)}
            placeholder={placeholder}
            />
    </label>


)

export default TextField;