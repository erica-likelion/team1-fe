import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-qr-code';

import TextButton from "@components/commons/TextButton";

import Right from "@assets/images/white_chevron_right.svg";

const ChatQRcodePage = () => {
    const { id } = useParams(); // URL에서 채팅방 ID 추출
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const { roomCode } = location.state || {};

    const mediURL = `${window.location.origin}/chat/${id}?userType=medi`;

    // 공유하기 버튼 클릭 핸들러
    const handleShareClick = () => {
        navigator.clipboard.writeText(mediURL);
        alert(t('chat.qr.copy'));
    };


    return (
        <div className="flex flex-col h-full px-5">
            
            {/* 헤더 정보 */}
            <div className="flex flex-col item-center mx-5 bg-[#FAFAFA] fixed top-15.5 left-1/2 transform -translate-x-1/2 max-w-[375px] w-full z-50">
                <p className="w-[335px] p-2.5 pt-4.5 font-semibold">
                    {t('chat.qr.title')}
                </p>
                <div className="h-[1px] w-[335px] bg-[#E0E0E0]"/>
            </div>

            {/* QR 코드 영역 */}
            <div className="flex flex-col items-center justify-center pt-19">
                <div className="w-full aspect-square border-1 border-[#D3D4D4] rounded-sm flex items-center justify-center mb-6">
                    <QRCode 
                        value={mediURL}
                        className='p-5 w-full h-full'
                    />
                </div>
                <p className="text-center text-[#909394] whitespace-pre-line">
                    {t('chat.qr.scanGuide')}
                </p>
            </div>
            <TextButton 
                text={t('chat.qr.share')} 
                icon={Right}
                onClick={handleShareClick}
            />
        </div>
    );
};

export default ChatQRcodePage;