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
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSearch } from '@contexts/SearchContext';
import { getChatMessages, sendChatMessage } from '@apis/chatApi';
import ChatBar from '@components/chatpage/ChatBar';
import Message from '@components/chatpage/Message';

const ChatRoomPage = () => {
    const { id } = useParams(); // URL에서 채팅방 ID 추출
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { isSearchMode, searchQuery, setQuery, highlightedIndex, setHighlightIndex } = useSearch();
    
    // 채팅방 상태
    const [messages, setMessages] = useState([]);
    const [chatRoomInfo, setChatRoomInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // 스크롤 관리를 위한 ref
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const messageRefs = useRef({});

    // 컴포넌트 마운트 시 채팅방 데이터 로드
    useEffect(() => {
        loadChatRoomData();
    }, [id]);

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

    // 채팅방 데이터 로드 함수
    const loadChatRoomData = async () => {
        try {
            setIsLoading(true);
            
            // API에서 채팅 메시지 가져오기 (이미 화면 표시용 형태로 반환)
            const messages = await getChatMessages(id);
            
            // 임시 채팅방 정보 (추후 getChatRoom API로 대체 가능)
            const chatRoomInfo = {
                id: id,
                type: "consultation", // "consultation" | "prescription"
                title: `채팅방 ${id}`,
                date: "2025-08-26",
                participants: ['사용자', '의료진']
            };

            setChatRoomInfo(chatRoomInfo);
            setMessages(messages);
        } catch (error) {
            console.error('채팅방 데이터 로드 실패:', error);
            // 에러 발생 시 빈 배열로 설정
            setMessages([]);
        } finally {
            setIsLoading(false);
        }
    };

    // 메시지 전송 핸들러
    const handleSendMessage = async (messageContent) => {
        try {
            // 1. 사용자 메시지를 즉시 화면에 추가 (낙관적 업데이트)
            const userMessage = {
                id: `msg-${Date.now()}`,
                sender: 'user',
                content: messageContent,
                koreanContent: messageContent,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, userMessage]);

            // 2. API로 메시지 전송
            await sendChatMessage({
                roomId: parseInt(id),
                sender: "user",
                language: "korean", // 임시로 한국어 고정
                message: messageContent
            });

            // 3. 임시: AI 응답 시뮬레이션 (추후 실시간 소켓으로 대체)
            setTimeout(() => {
                const aiResponse = {
                    id: `ai-${Date.now()}`,
                    sender: '의료진',
                    content: '답변을 분석 중입니다. 잠시만 기다려주세요.',
                    koreanContent: '답변을 분석 중입니다. 잠시만 기다려주세요.',
                    timestamp: new Date().toISOString(),
                    type: 'received'
                };
                setMessages(prev => [...prev, aiResponse]);
            }, 1000);

        } catch (error) {
            console.error('메시지 전송 실패:', error);
            // TODO: 에러 처리 (실패한 메시지 표시, 재전송 기능 등)
        }
    };

    // Plus 버튼 클릭 핸들러
    const handlePlusClick = () => {
        console.log('파일/이미지 첨부 기능');
        // 추후 파일 업로드 모달이나 기능 구현
    };

    // 마이크 버튼 클릭 핸들러
    const handleMicClick = () => {
        console.log('음성 입력 기능');
        // 추후 음성 인식 기능 구현
    };

    // 메시지 영역 자동 스크롤
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // 검색 결과 찾기
    const getSearchResults = () => {
        if (!searchQuery) return [];
        return messages.filter(message => 
            message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            message.koreanContent.toLowerCase().includes(searchQuery.toLowerCase())
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



    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-gray-500">{t('common.loading')}</div>
            </div>
        );
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
                        {chatRoomInfo && `${t(`chat.type.${chatRoomInfo.type}`)} | ${chatRoomInfo.date}`}
                    </p>
                )}
                <div className="h-[1px] w-[335px] bg-[#E0E0E0]"/>
            </div>

            {/* 메시지 영역 */}
            <div 
                ref={messagesContainerRef}
                className="overflow-y-auto space-y-4 pt-16 mt-12.5 mb-15"
            >
                {messages.map((message) => (
                    <Message 
                        key={message.id}
                        message={message}
                        ref={(el) => messageRefs.current[message.id] = el}
                    />
                ))}
                
                {/* 자동 스크롤을 위한 빈 요소 */}
                <div ref={messagesEndRef} />
            </div>

            {/* 메시지 입력 컴포넌트 */}
            <ChatBar 
                onSendMessage={handleSendMessage}
                onPlusClick={handlePlusClick}
                onMicClick={handleMicClick}
                disabled={isLoading}
            />
        </div>
    );
};

export default ChatRoomPage;