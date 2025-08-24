const ServiceCard = ({
  icon,
  title,
  description,
  description2 = "",
  onClick,
  className=""
}) => {
    
  return (
      <div 
      className={`relative flex items-center w-full py-3 pl-3 pr-2 gap-5 rounded-sm cursor-pointer shadow-[2px_2px_8px_0_rgba(23,23,27,0.15)] ${icon ? "pl-3" : "pl-4.5" } ${className}`}
      onClick={onClick}
      >
        {icon && 
        <div className="w-14 h-14 bg-[#C5F4E1] rounded-sm flex items-center justify-center overflow-hidden">
            <img className="max-w-9 max-h-9" src={icon} alt="card_icon"/>
        </div>}
        <div className="flex-1">
            <p className="font-semibold leading-[150%] tracking-[-0.32px]">{title}</p>
            <p className="font-normal text-[12px] leading-[150%] tracking-[-0.24px]">{description}</p>
        </div>
        <div className="absolute right-2 top-3">
          <p className="text-[10px] font-medium text-[#BDBDBD]">{description2}</p>
        </div>
      </div>
  );
};

export default ServiceCard;