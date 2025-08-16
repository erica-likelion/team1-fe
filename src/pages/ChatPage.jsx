/* 통역 채팅 페이지 */

import { useTranslation } from "react-i18next";

import Plus from "@assets/images/plus.svg";

const ChatPage = () => {
    const { t } = useTranslation();

    const createNewChat = () => {
        
    }

    return (
        <div className="p-5 h-auto">
            <div className="border-b-1 border-[#E0E0E0] p-2.5 bg-[#FAFAFA] relative z-30">
                <p className="text-2xl font-medium">
                    {t('chat.title')}
                </p>
            </div>
            <div className="flex flex-col w-full my-[220px] justify-center items-center gap-10">
                <p className="font-semibold text-[#BDBDBD]">{t('chat.noneChatList.title')}</p>
                <p className="font-semibold text-center whitespace-pre-line">{t('chat.noneChatList.description')}</p>
            </div>
            <div className="flex justify-center items-center bg-[#3DE0AB] w-10 h-10 rounded-sm cursor-pointer fixed bottom-33.5 left-1/2 transform -translate-x-1/2 z-50"
                onClick={createNewChat}>
                <img src={Plus} />
            </div>
        </div>
    );
};

export default ChatPage;