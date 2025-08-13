/* 마이페이지 */

import { getUserData } from "@utils/userUtils";
import ServiceCard from "@components/homepage/ServiceCard";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MyPage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const user = getUserData();
    const {name: userName, gender: userGender} = user;
    const language = i18n.language;

    const UserName = () => {
        return (
            <>
                {language === "en" ? 
                <>
                    <p>
                        {userGender === "M" ? t('mypage.suffixMale'): t('mypage.suffixFemale')}
                    </p>
                    <span className="font-bold">{userName}</span>
                </>: 
                <>
                    <span className="font-bold">{userName}</span>
                    <p>
                        {userGender === "M" ? t('mypage.suffixMale'): t('mypage.suffixFemale')}
                    </p>
                </>}
            </>
        )
    }

    const handleUserInfo = () => {
        navigate('/home'); // 임시
    }

    const serviceCardInfos = [
        {
            id: "1",
            title: t('mypage.buttons.button1.title'),
            description: t('mypage.buttons.button1.description'),
            onClick: () => { navigate('/home') } // 임시
        },
        {
            id: "2",
            title: t('mypage.buttons.button2.title'),
            description: t('mypage.buttons.button2.description'),
            onClick: () => { navigate('/home') } // 임시
        },
        {
            id: "3",
            title: t('mypage.buttons.button3.title'),
            description: t('mypage.buttons.button3.description'),
            onClick: () => { navigate('/home') } // 임시
        },
        {
            id: "4",
            title: t('mypage.buttons.button4.title'),
            description: t('mypage.buttons.button4.description'),
            onClick: () => { navigate('/home') } // 임시
        },
    ];

    return (
        <div className="px-5">
            <div className="flex justify-between items-center px-5 h-25 my-3">
                <div className="flex text-[28px]">
                    <UserName />
                </div>
                <div className="cursor-pointer" onClick={handleUserInfo}>
                    <p className="text-[12px] text-[#BDBDBD] underline underline-offset-2">{t('mypage.viewMyInfo')}</p>
                </div>
            </div>

            <div className="mx-[-20px] w-[375px] h-2 bg-[#E9E9EA] mb-10"></div>

            <div className="space-y-3">
                {serviceCardInfos.map((info, idx) => (
                    <ServiceCard key={info.id} title={info.title} description={info.description} onClick={info.onClick} className={idx%2 === 1 ? "mb-10" : ""}/>
                ))}
            </div>
        </div>
    );
};

export default MyPage;