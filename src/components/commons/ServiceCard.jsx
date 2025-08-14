const ServiceCard = ({
  icon,
  title,
  description,
  onClick,
  className=""
}) => {
    
  return (
      <div 
      className={`flex items-center w-full py-3 pr-2 gap-5 rounded-sm cursor-pointer shadow-[0_0_12px_0_rgba(23,23,27,0.15)] ${icon ? "pl-3" : "pl-4.5" } ${className}`}
      onClick={onClick}
      >
        {icon && 
        <div className="w-14 h-14 bg-[#C5F4E1] rounded-sm flex items-center justify-center overflow-hidden">
            <img className="max-w-9 max-h-9" src={icon} />
        </div>}
        <div className="flex-1">
            <p className="font-semibold">{title}</p>
            <p className="font-normal text-[12px]">{description}</p>
        </div>
      </div>
  );
};

export default ServiceCard;