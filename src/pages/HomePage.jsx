/* 메인 홈페이지 */
import ServiceCard from "@components/homepage/ServiceCard.jsx"
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// ICON은 추후 디자인 업데이트 후 맞게 변경할 예정
import PhoneIcon from "@assets/images/logo.svg";
import ChatIcon from "@assets/images/logo.svg";
import MedicineIcon from "@assets/images/logo.svg";

const HomePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const serviceCards = [
        {
            icon: PhoneIcon,
            step: t('homepage.serviceCard.preVisit.step'),
            title: t('homepage.serviceCard.preVisit.title'),
            description: t('homepage.serviceCard.preVisit.description'),
            onClick: () => console.log('진료 전 클릭')
        },
        {
            icon: ChatIcon,
            step: t('homepage.serviceCard.inVisit.step'),
            title: t('homepage.serviceCard.inVisit.title'),
            description: t('homepage.serviceCard.inVisit.description'),
            onClick: () => console.log('진료 중 클릭')
        },
        {
            icon: MedicineIcon,
            step: t('homepage.serviceCard.postVisit.step'),
            title: t('homepage.serviceCard.postVisit.title'),
            description: t('homepage.serviceCard.postVisit.description'),
            onClick: () => navigate('/prescription')
        }
    ];

    return (
        <div className="flex flex-col items-center">
            <div className="px-5 py-2.5 self-start">
                <p className="font-semibold">
                    {t('homepage.headerPart1')}<br />
                    <span className="text-[#3DE0AB]">{t('homepage.headerPart2')}</span>
                    {t('homepage.headerPart3')}
                </p>
            </div>
            <div className="w-[331px] border-[1px] border-[#E9E9EA]"></div>
            <div>
                <p className="py-10 font-semibold text-[20px]">{t('homepage.main')}</p>
            </div>
            <div className="flex flex-col gap-5">
                {serviceCards.map((card, index) => (
                    <ServiceCard
                        key={index}
                        icon={card.icon}
                        step={card.step}
                        title={card.title}
                        description={card.description}
                        onClick={card.onClick}
                    />
                ))}
            </div>
        </div>
    )
}

export default HomePage;