/* 통역 채팅 페이지 */

import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getChatRooms } from "@apis/chatApi";
import { useSearch } from "@contexts/SearchContext";

import ServiceCard from "@components/commons/ServiceCard";
import Logo from "@assets/images/logo.svg";
import Plus from "@assets/images/plus.svg";


const ChatPage = () => {
    const { t } = useTranslation();
    const [chatRooms, setChatRooms] = useState([]);
    const { isSearchMode, searchQuery, setQuery, toggleSearch } = useSearch();

    useEffect(() => {
        loadChatRooms();
    }, []);

    const loadChatRooms = async () => {
        try {
            const rooms = await getChatRooms();
            setChatRooms(rooms);
        } catch (error) {
            console.error('채팅방 목록 로드 실패:', error);
        } 
    };

    // 검색어에 따른 채팅방 필터링
    const filteredChatRooms = useMemo(() => {
        if (!searchQuery.trim()) return chatRooms;
        
        return chatRooms.filter(room => 
            room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            room.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [chatRooms, searchQuery]);

    const createNewChat = () => {
        // 새 채팅 생성 로직
        console.log('새 채팅 생성');
    };

    return (
        <div className="p-5 h-auto">
            <div className="border-b-1 border-[#E0E0E0] p-2.5 bg-[#FAFAFA] relative z-30">
                {isSearchMode ? (
                    <input
                        type="text"
                        placeholder="채팅방 검색..."
                        value={searchQuery}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full text-2xl font-medium bg-transparent border-none outline-none placeholder-[#BDBDBD]"
                        autoFocus
                    />
                ) : (
                    <p className="text-2xl font-medium">
                        {t('chat.title')}
                    </p>
                )}
            </div>

            {filteredChatRooms.length === 0 ? (
                <div className="flex flex-col w-full my-[220px] justify-center items-center gap-10">
                    <p className="font-semibold text-[#BDBDBD]">
                        {isSearchMode && searchQuery ? '검색 결과가 없습니다.' : t('chat.noneChatList.title')}
                    </p>
                    {!isSearchMode && (
                        <p className="font-semibold text-center whitespace-pre-line">{t('chat.noneChatList.description')}</p>
                    )}
                </div>
            ) : (
                <div className="mt-4 space-y-3">
                    {filteredChatRooms.map((room) => (
                        <>
                            <ServiceCard 
                                icon={Logo}
                                title={room.title}
                                description={room.description}
                                description2={room.createdAt}
                                onClick={() => {}}
                                className="shadow-none"
                            />
                            <div className="h-[2px] border-b-1 border-[#E9E9EA]" />
                        </>
                    ))}
                </div>
            )}

            <div className="flex justify-center items-center bg-[#3DE0AB] w-10 h-10 rounded-sm cursor-pointer fixed bottom-33.5 left-1/2 transform -translate-x-1/2 z-50"
                onClick={createNewChat}>
                <img src={Plus} />
            </div>
        </div>
    );
};

export default ChatPage;