import Right from "@assets/images/chevron_right.svg";

const ServiceCard = ({
  icon,
  step,
  title,
  description,
  onClick,
}) => {
    
  return (
    <div className="flex flex-col px-5 gap-2 w-full">
        <p className="font-semibold">{step}</p>
        <div 
        className={"flex items-center p-3 pr-2 gap-5 rounded-lg cursor-pointer shadow-[0_0_12px_0_rgba(23,23,27,0.15)]"}
        onClick={onClick}
        >
          <div className="w-14 h-14 bg-[#D3D4D4] rounded-full flex items-center justify-center overflow-hidden">
              <img src={icon} />
          </div>
          <div className="w-48.75">
              <p className="font-semibold">{title}</p>
              <p className="font-normal text-[12px]">{description}</p>
          </div>
          <div className="flex justify-end items-center">
            <img className="w-6 h-6" src={Right} />
          </div>
        </div>
    </div>
  );
};

export default ServiceCard;