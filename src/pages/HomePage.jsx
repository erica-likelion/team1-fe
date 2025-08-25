/* 메인 홈페이지 */
import ServiceCard from "@components/commons/ServiceCard.jsx"
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import Call from "@assets/images/call.svg";
import Doctor from "@assets/images/doctor.svg";
import Medicine from "@assets/images/medicine.svg";

const HomePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const serviceCards = [
        {
            icon: Call,
            step: t('homepage.serviceCard.preVisit.step'),
            title: t('homepage.serviceCard.preVisit.title'),
            description: t('homepage.serviceCard.preVisit.description'),
            onClick: () => navigate('/treat-info-form/name')
        },
        {
            icon: Doctor,
            step: t('homepage.serviceCard.inVisit.step'),
            title: t('homepage.serviceCard.inVisit.title'),
            description: t('homepage.serviceCard.inVisit.description'),
            onClick: () => navigate('/treat-info-form/name')
        },
        {
            icon: Medicine,
            step: t('homepage.serviceCard.postVisit.step'),
            title: t('homepage.serviceCard.postVisit.title'),
            description: t('homepage.serviceCard.postVisit.description'),
            onClick: () => navigate('/prescription')
        }
    ];

    return (
        <div className="flex flex-col items-center">
            <div className="px-5 py-2.5 mb-2 self-start">
                <p className="font-semibold">
                    {t('homepage.headerPart1')}<br />
                    <span className="text-[#3DE0AB]">{t('homepage.headerPart2')}</span>
                    {t('homepage.headerPart3')}
                </p>
            </div>
            <div className="w-[331px] my-1 border-[1px] border-[#E9E9EA]"></div>
            <div>
                <p className="py-10 font-semibold text-[20px] leading-[142%] tracking-[-0.4px]">{t('homepage.main')}</p>
            </div>
            <div className="flex flex-col items-center gap-4 w-full mb-9">
                {serviceCards.map((card, index) => (
                    <div key={index} className="flex flex-col gap-2 w-[335px]">
                        <p className="font-semibold">{card.step}</p>
                        <ServiceCard
                            icon={card.icon}
                            title={card.title}
                            description={card.description}
                            onClick={card.onClick}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HomePage;