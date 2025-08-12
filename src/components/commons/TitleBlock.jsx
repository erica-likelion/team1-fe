const TitleBlock = ({title, subtitle}) => (
    <div className="ml-2">
        <h2 className="font-medium text-[28px] leading-[130%] tracking-[-0.02em] mt-5"> {title}</h2>
        {subtitle && (
            <p className="font-medium text-[12px] leading-[150%] tracking-[-0.02em] mt-3">
                {subtitle}
            </p>
        )}
    </div>
)

export default TitleBlock;