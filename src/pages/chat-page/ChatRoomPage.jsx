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
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSearch } from '@contexts/SearchContext';
import { getChatMessages } from '@apis/chatApi';
import ChatBar from '@components/chatpage/ChatBar';
import Message from '@components/chatpage/Message';
import { useUser } from '@contexts/userContext';

import { Stomp } from "@stomp/stompjs";
 
const ChatRoomPage = () => {
    const { id } = useParams(); // URL에서 채팅방 ID 추출
    const location = useLocation();
    const { user: currentUser } = useUser();
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

    // STOMP 클라이언트를 위한 ref, 웹소켓 연결을 유지하기 위해 사용
    const stompClient = useRef(null);

    const { roomCode } = location.state || {};

    // 컴포넌트 마운트 시 채팅방 데이터 로드
    useEffect(() => {
        connect();
        fetchMessages();

        // 임시 추후 변경 가능 
        setChatRoomInfo({type: "consulation", date: "2025-08-18"});
        return () => disconnect();
    }, [id]);

    const connect = () => {
        const socket = new WebSocket("ws://localhost:8080/ws");
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
            const messages = await getChatMessages(id);
            setMessages(messages);
        } catch (err) {
            console.log(err);
            setMessages([]);
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

    // 새 메세지를 보내는 함수
    const handleSendMessage = (message) => {
        if (stompClient.current && message) {
            const now = new Date();
            //const kstTime = now.getTime() + (9 * 60 * 60 * 1000); // 9시간 추가
            //const kstDate = (new Date(kstTime)).toISOString().split("T")[0];
            const messageObj = {
                sender: currentUser.type,
                message: message,
                createdAt: now.toISOString(), 
                roomId: id
            };
            console.log("메시지 전송:", messageObj);
            stompClient.current.send('/pub/chat/message', {}, JSON.stringify(messageObj));
        }
        console.log("현재 메시지 목록:", messages);
    };

    // QR 버튼 클릭 핸들러
    const handleQrCodeClick = () => {
        navigate(`/chat/${id}/qr`, {
            state: {
                roomCode: roomCode
            }
        });
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
                {messages.map((message, index) => (
                    <Message 
                        key={`${message.id}-${index}`}
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
                onQrCodeClick={handleQrCodeClick}
                onPlusClick={handlePlusClick}
                onMicClick={handleMicClick}
                disabled={isLoading} 
            />
        </div>
    );
};

export default ChatRoomPage;