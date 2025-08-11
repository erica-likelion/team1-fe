const TextField = ({
    value,
    onChange,
    placeholder,
    maxLength = 150,
    type = "text"
}) => (
    <label>
        <input
            className="dd"
            type = {type}
            value={value}
            maxLength={maxLength}
            onChange={e => onChange?.(e.target.value)}
            placeholder={placeholder}
            />
    </label>


)

export default TextField;