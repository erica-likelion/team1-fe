/* 통역 채팅 페이지 */

import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getChatRooms } from "@apis/chatApi";
import { useSearch } from "@contexts/SearchContext";

import ServiceCard from "@components/commons/ServiceCard";
import Logo from "@assets/images/logo.svg";
import Plus from "@assets/images/plus.svg";


const ChatPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [chatRooms, setChatRooms] = useState([]);
    const { isSearchMode, searchQuery, setQuery } = useSearch();

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

    // 채팅방 클릭 시 해당 채팅방으로 이동
    const handleChatRoomClick = (roomId, roomCode) => {
        navigate(`/chat/${roomId}`, {
            state: {
                roomCode: roomCode
            }
        });
    };

    const createNewChat = () => {
        // 새 채팅 생성 로직 (임시: 새로운 ID로 채팅방 생성)
        const newRoomId = `room-${Date.now()}`;
        navigate(`/chat/${newRoomId}`);
    };

    return (
        <div className="p-5 h-auto">
            <div className="flex flex-col item-center mx-5 bg-[#FAFAFA] fixed top-15.5 left-1/2 transform -translate-x-1/2 max-w-[375px] w-full z-50">
                {isSearchMode ? (
                    <input
                        type="text"
                        placeholder={t('chat.searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => setQuery(e.target.value)}
                        className="p-2.5 pt-4.5 w-full text-2xl font-medium border-none outline-none placeholder-[#BDBDBD]"
                        autoFocus
                    />
                ) : (
                    <p className="p-2.5 pt-4.5 text-2xl w-full font-medium">
                        {t('chat.title')}
                    </p>
                )}
                <div className="h-[1px] w-[335px] bg-[#E0E0E0]"/>
            </div>

            {filteredChatRooms.length === 0 ? (
                <div className="flex flex-col w-full my-[220px] justify-center items-center gap-10 pt-19">
                    <p className="font-semibold text-[#BDBDBD]">
                        {isSearchMode && searchQuery ? t('chat.noSearch') : t('chat.noneChatList.title')}
                    </p>
                    {!isSearchMode && (
                        <p className="font-semibold text-center whitespace-pre-line">{t('chat.noneChatList.description')}</p>
                    )}
                </div>
            ) : (
                <div className="mt-16 space-y-3">
                    {filteredChatRooms.map((room) => (
                        <div key={room.id} className="m-0">
                            <ServiceCard 
                                icon={Logo}
                                title={room.title}
                                description={room.description}
                                description2={room.createdAt}
                                onClick={() => handleChatRoomClick(room.id, room.roomCode)}
                                className="shadow-none"
                            />
                            <div className="my-0.5 border-b-1 border-[#E9E9EA]" />
                        </div>
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