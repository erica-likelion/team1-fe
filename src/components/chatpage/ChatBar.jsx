/* ChatBar - 채팅 입력 바 컴포넌트 */

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import QrCode from "@assets/images/qrcode.svg";
import Mic from "@assets/images/mic.svg";
import ActiveMic from "@assets/images/green_mic.svg";
import Arrow from "@assets/images/top_arrow.svg";

const ChatBar = ({ 
    onSendMessage, // 메세지 전송 처리 함수
    onQrCodeClick,
    placeholder, 
    disabled = false,
    className = "" 
}) => {
    const { t, i18n } = useTranslation();
    const [message, setMessage] = useState('');
    const [language, setLanguage] = useState('ko');
    const textareaRef = useRef(null);
    const textareaMinHeight = '18px';
    
    // 음성 인식 상태
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        setLanguage(i18n.language);
    }, []);

    // 음성 인식 결과를 message에 반영
    useEffect(() => {
        if (transcript) {
            setMessage(transcript);
        }
    }, [transcript]);

    // 마이크 버튼 클릭 핸들러
    const handleMicClick = () => {
        if (!browserSupportsSpeechRecognition) {
            alert(t('common.tryAgain')); // 브라우저 지원 안 함
            return;
        }

        if (listening) {
            SpeechRecognition.stopListening();
        } else {
            resetTranscript();
            SpeechRecognition.startListening({ 
                continuous: true,
                language: language === 'ko' ? 'ko-KR' : 
                        language === 'zh-CN' ? 'zh-CN' : 'en-US'
            });
        }
    };

    // 메시지 전송 처리
    const handleSendMessage = () => {
        const trimmedMessage = message.trim();
        if (trimmedMessage === '' || disabled) return;

        onSendMessage(trimmedMessage);
        setMessage('');
        
        // textarea 높이 초기화
        if (textareaRef.current) {
            textareaRef.current.style.height = textareaMinHeight;
        }
    };

    // 키보드 이벤트 처리
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // textarea 자동 높이 조정
    const handleInputChange = (e) => {
        const value = e.target.value;
        setMessage(value);

        // 높이 자동 조정
        if (textareaRef.current) {
            textareaRef.current.style.height = textareaMinHeight;
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    };

    // 앞뒤 공백 제외 메세지가 있으면 활성화
    const isSendButtonEnabled = message.trim() !== '' && !disabled;

    return (
        <div className={`bg-[#FAFAFA] px-6 pt-4 pb-9 shadow-[0_-1px_2px_0_rgba(0,0,0,0.10)] rounded-l-sm rounded-r-sm fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-[375px] w-full z-50 ${className}`}>
            <div className="flex justify-between items-center">
                <button 
                    onClick={onQrCodeClick}
                    disabled={disabled}
                    className="cursor-pointer"
                >
                    <img src={QrCode} className="w-6 h-6" />
                </button>

                <div className="w-[239px] flex justify-between items-center gap-3 border border-[#BDBDBD] rounded-sm p-2 focus-within:ring-2 focus-within:ring-[#3DE0AB] focus-within:border-transparent">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder || t('chat.enterMessage')}
                        disabled={disabled}
                        className="flex-1 resize-none no-scrollbar border-none outline-none disabled:cursor-not-allowed text-[12px] font-medium "
                        rows="1"
                    />

                    <button 
                        onClick={handleMicClick}
                        disabled={disabled}
                        className={`cursor-pointer ${listening ? 'animate-pulse bg-[#C5F4E1] rounded-full p-1' : ''}`}
                    >
                        <img src={listening ? ActiveMic : Mic} className="w-6 h-6" />
                    </button>
                </div>

                <button
                    onClick={handleSendMessage}
                    disabled={!isSendButtonEnabled}
                    className={`
                        w-10 h-10 rounded-sm transition-colors flex items-center justify-center
                        ${isSendButtonEnabled
                            ? 'bg-[#3DE0AB] hover:bg-[#00A270] cursor-pointer'
                            : 'bg-[#E0E0E0]'
                        }
                    `}
                >
                    <img src={Arrow} className="w-6 h-6"/>
                </button>
            </div>
        </div>
    );
};

export default ChatBar;