const TitleBlock = ({title, subtitle}) => (
    <div>
        <h2 className="font-medium text-[28px] leading-[130%] tracking-[-0.02em]"> {title}</h2>
        {subtitle && (
            <p className="font-medium text-[12px] leading-[150%] tracking-[-0.02em] mt-12">
                {subtitle}
            </p>
        )}
    </div>
)

export default TitleBlock;