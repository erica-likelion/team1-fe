/**
 * ChatRoomPage - 개별 채팅방 페이지
 * 
 * [ 페이지 역할 ]
 * - 특정 채팅방에서의 메시지 송수신
 * - 실시간 채팅 UI 및 메시지 히스토리 표시
 * - 검색 기능 (채팅 메시지 내 검색)
 * 
 * [ 라우팅 ]
 * - URL: /chat/{id}
 * - Layout: SimpleLayout (TopNavBar만 표시)
 * - NavBar Type: 'chatroom'
 * 
 * [ 주요 기능 ]
 * - 메시지 입력 및 전송
 * - 메시지 히스토리 스크롤
 * - 검색 모드에서 메시지 내 텍스트 검색
 * - 뒤로가기 시 채팅방 목록(/chat)으로 이동
 */

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSearch } from '@contexts/SearchContext';
import { getChatMessages } from '@apis/chatApi';
import { getPrecheckById, getPrescriptionById } from '@apis/prescriptionApi';
import ChatBar from '@components/chatpage/ChatBar';
import Message from '@components/chatpage/Message';
import TextButton from '@components/commons/TextButton';
import HistoryModal from '@components/chatpage/HistoryModal';
import { useUser } from '@contexts/userContext';

import { Stomp } from "@stomp/stompjs";
 
import Loading from "@assets/images/loading.svg";
import { changeLanguage } from 'i18next';

const ChatRoomPage = () => {
    const { roomId: id, roomCode } = useParams(); // URL에서 채팅방 ID 추출
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { user: currentUser } = useUser();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { isSearchMode, searchQuery, setQuery, highlightedIndex, setHighlightIndex } = useSearch();
    const userType = searchParams.get('userType');
    // 채팅방 상태
    const [messages, setMessages] = useState([]);
    const [roomInfo, setRoomInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasUserSentMessage, setHasUserSentMessage] = useState(false);
    const [activeHistoryModal, setActiveHistoryModal] = useState(null); // 'precheck', 'prescription', null
    
    // 스크롤 관리를 위한 ref
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const messageRefs = useRef({});

    // STOMP 클라이언트를 위한 ref, 웹소켓 연결을 유지하기 위해 사용
    const stompClient = useRef(null);

    const { type } = location.state || {};

    // 컴포넌트 마운트 시 채팅방 데이터 로드
    useEffect(() => {
        connect();
        fetchMessages();
        changeKoreanForMedi();
        
        return () => disconnect();
    }, [id]);

    const changeKoreanForMedi = () => {
        if (userType === "medi") i18n.changeLanguage("ko");
    }

    const connect = () => {
        const socket = new WebSocket(`ws://${import.meta.env.VITE_WS_BASE_URL}/ws`);
        stompClient.current = Stomp.over(() => socket);
        stompClient.current.connect({}, () => {
            console.log("WebSocket 연결 성공");
            stompClient.current.subscribe(`/sub/chat/rooms/${id}`, 
                (message) => {
                    console.log("메시지 수신:", message.body);
                    const newMessage = JSON.parse(message.body);
                    setMessages((prev) => [...prev, newMessage]);
            });
        }, (error) => {
            console.error("WebSocket 연결 실패:", error);
        });
        console.log("방 번호", id);
    }

    const disconnect = () => {
        if (stompClient.current) {
            stompClient.current.disconnect();
        }
    }

    const fetchMessages = async () => {
        try {
            setIsLoading(true);
            const fetchedMessages = await getChatMessages(id);
            setMessages(fetchedMessages);
            setHasUserSentMessage(fetchedMessages.length > 1);
            
            // 가장 첫 번째 메시지의 createdAt을 roomInfo에 저장
            const firstMessageDate = fetchedMessages.length > 0 ? new Date(fetchedMessages[0].createdAt) : new Date();
            setRoomInfo({
                type: type, 
                date: firstMessageDate.toISOString().split('T')[0],
                time: firstMessageDate.toISOString().split('T')[1].substring(0, 5)
            });
        } catch (err) {
            console.log(err);
            setMessages([]);
            setHasUserSentMessage(false);
            const currentDate = new Date();
            setRoomInfo({
                type: "newChat", 
                date: currentDate.toISOString().split('T')[0],
                time: currentDate.toISOString().split('T')[1].substring(0, 5)
            });
        } finally {
            setIsLoading(false);
        }
    }
    // 새 메시지 추가 시 자동 스크롤
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 키보드 이벤트 처리 (검색 결과 순회)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isSearchMode && searchQuery) {
                if (e.key === 'ArrowDown' || e.key === 'Enter') {
                    e.preventDefault();
                    goToNextResult();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    goToPrevResult();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSearchMode, searchQuery, highlightedIndex]);

    // 검색어 변경 시 첫 번째 결과로 이동
    useEffect(() => {
        if (isSearchMode && searchQuery) {
            const searchResults = getSearchResults();
            if (searchResults.length > 0) {
                setHighlightIndex(0);
                scrollToSearchResult(searchResults[0]);
            }
        }
    }, [searchQuery]);

    const timeFormatting = (timeString) => {
        if (!timeString) return '';
        
        const [hours, minutes] = timeString.split(':').map(Number);
        
        if (hours === 0) {
            return `${t('common.time.am')} 12:${minutes.toString().padStart(2, '0')}`;
        } else if (hours < 12) {
            return `${t('common.time.am')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        } else if (hours === 12) {
            return `${t('common.time.pm')} 12:${minutes.toString().padStart(2, '0')}`;
        } else {
            return `${t('common.time.pm')} ${(hours - 12).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }
    }

    // 새 메세지를 보내는 함수
    const handleSendMessage = (message) => {
        if (stompClient.current && message) {
            const messageObj = {
                sender: currentUser.type,
                message: message,
                language: currentUser.opponentLanguage,
                roomId: id
            };
            console.log("메시지 전송:", messageObj);
            stompClient.current.send('/pub/chat/message', {}, JSON.stringify(messageObj));
        }
        setHasUserSentMessage(true);
        console.log("현재 메시지 목록:", messages);
    };

    // QR 버튼 클릭 핸들러
    const handleQrCodeClick = () => {
        navigate(`/chat/${id}/${roomCode}/qr`);
    };


    // 메시지 영역 자동 스크롤
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // 검색 결과 찾기
    const getSearchResults = () => {
        if (!searchQuery) return [];
        return messages.filter(message => 
            (message.message || message.content || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (message.koreanMessage || message.koreanContent || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    // 다음 검색 결과로 이동
    const goToNextResult = () => {
        const searchResults = getSearchResults();
        if (searchResults.length === 0) return;
        
        const nextIndex = (highlightedIndex + 1) % searchResults.length;
        setHighlightIndex(nextIndex);
        scrollToSearchResult(searchResults[nextIndex]);
    };

    // 이전 검색 결과로 이동
    const goToPrevResult = () => {
        const searchResults = getSearchResults();
        if (searchResults.length === 0) return;
        
        const prevIndex = highlightedIndex === 0 ? searchResults.length - 1 : highlightedIndex - 1;
        setHighlightIndex(prevIndex);
        scrollToSearchResult(searchResults[prevIndex]);
    };

    // 검색 결과로 스크롤
    const scrollToSearchResult = (message) => {
        const messageElement = messageRefs.current[message.id];
        if (messageElement) {
            messageElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    };

    const selectPrecheck = async (id) => {
        try {
            const precheckData = await getPrecheckById(id);
            handleSendMessage(precheckData.content);
        } catch (err) {
            console.log("precheck 데이터 가져오기 실패", err);
        }
    }

    const selectPrescription = async (id) => {
        try {
            const prescriptionData = await getPrescriptionById(id);
            handleSendMessage(prescriptionData.content);
        } catch (err) {
            console.log("prescription 데이터 가져오기 실패", err);
        }
    }

    const initBtnList = [
        {
            text: t('chat.buttons.interpretation'),
            onClick: handleQrCodeClick
        },
        {
            text: t('chat.buttons.loadPrecheck'),
            onClick: () => setActiveHistoryModal('precheck')
        },
        {
            text: t('chat.buttons.loadPrescription'),
            onClick: () => setActiveHistoryModal('prescription')
        }
    ]

    if (isLoading) {
        return (
            <div>
                <img src={Loading} className="animate-spin fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
                <p className="max-w-[375px] text-[#A6A9AA] font-semibold fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-18">
                    {t('prescription.scanning.wait')}
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col px-5">
            
            <div className="flex flex-col item-center mx-5 bg-[#FAFAFA] fixed top-15.5 left-1/2 transform -translate-x-1/2 max-w-[375px] w-full z-50">
                {isSearchMode ? (
                    <input
                        type="text"
                        placeholder={t('chat.searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => setQuery(e.target.value)}
                        className="p-2.5 pt-4.5 w-full font-semibold border-none outline-none placeholder-[#BDBDBD]"
                        autoFocus
                    />
                ) : (
                    <p className="p-2.5 pt-4.5 font-semibold">
                        {roomInfo && `${t("chat.type.chat")} | ${roomInfo.date}`}
                    </p>
                )}
                <div className="h-[1px] w-[335px] bg-[#E0E0E0]"/>
            </div>

            <div className="self-center mt-17 text-[12px] text-[#BDBDBD]">
                {roomInfo && timeFormatting(roomInfo.time)}
            </div>

            {/* 메시지 영역 */}
            <div 
                ref={messagesContainerRef}
                className="overflow-y-auto space-y-4 mt-4 mb-15"
            >
                {messages && messages.map((message, index) => (
                    <div key={`${message.id}-${index}`}>
                        <Message 
                            message={message}
                            ref={(el) => messageRefs.current[message.id] = el}
                        />
                        {/* 첫 번째 메시지 아래에 버튼들 렌더링 */}
                        {index === 0 && message.sender == "medi" && !hasUserSentMessage && (
                            <div className="pl-13.75 py-2 mb-4 flex flex-col items-start gap-2">
                                {initBtnList.map((btn, btnIndex) => (
                                    <TextButton 
                                        key={btnIndex}
                                        text={btn.text}
                                        onClick={btn.onClick}
                                        className="bg-[#C5F4E1] border-1 border-[#00C88D] !text-[#00A270] hover:!text-[#FAFAFA] !w-auto !px-3 !py-1 text-[14px] relative bottom-auto left-auto transform-none translate-x-0 z-auto"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {/* 자동 스크롤을 위한 빈 요소 */}
                <div ref={messagesEndRef} />
            </div>
            
            {activeHistoryModal && 
                <HistoryModal
                    onClose={() => setActiveHistoryModal(null)}
                    title={t(`chat.buttons.load${activeHistoryModal === 'precheck' ? 'Precheck' : 'Prescription'}`)}
                    historyType={activeHistoryModal}
                    onSelectHistory={(historyId) => {
                        if (activeHistoryModal === 'precheck') selectPrecheck(historyId);
                        else selectPrescription(historyId);

                        setActiveHistoryModal(null);
                    }}
                />
            }

            {/* 메시지 입력 컴포넌트 */}
            <ChatBar 
                onSendMessage={handleSendMessage}
                onQrCodeClick={handleQrCodeClick}
                disabled={isLoading} 
            />
        </div>
    );
};

export default ChatRoomPage;