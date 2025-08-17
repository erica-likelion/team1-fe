/* ChatBar - 채팅 입력 바 컴포넌트 */

import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import QrCode from "@assets/images/qrcode.svg";
import Plus from "@assets/images/gray_plus.svg";
import Mic from "@assets/images/mic.svg";
import Arrow from "@assets/images/top_arrow.svg";

const ChatBar = ({ 
    onSendMessage, // 메세지 전송 처리 함수
    onPlusClick, // 파일 추가 버튼 클릭 함수
    onMicClick, // 마이크 버튼 클릭 함수
    placeholder, 
    disabled = false,
    className = "" 
}) => {
    const { t } = useTranslation();
    const [message, setMessage] = useState('');
    const textareaRef = useRef(null);
    const textareaMinHeight = '18px';

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
                    onClick={() => console.log('QR코드 기능')}
                    disabled={disabled}
                    className="cursor-pointer"
                >
                    <img src={QrCode} className="w-6 h-6" />
                </button>

                <div className="w-[239px] flex justify-between items-center gap-3 border border-[#BDBDBD] rounded-sm p-2 focus-within:ring-2 focus-within:ring-[#3DE0AB] focus-within:border-transparent">
                    <button 
                        onClick={onPlusClick}
                        className="cursor-pointer"
                    >
                        <img src={Plus} className="w-6 h-6" />
                    </button>

                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder || t('chat.enterMessage')}
                        disabled={disabled}
                        className="resize-none no-scrollbar border-none outline-none disabled:cursor-not-allowed text-[12px] font-medium "
                        rows="1"
                    />

                    <button 
                        onClick={onMicClick}
                        disabled={disabled}
                        className="cursor-pointer"
                    >
                        <img src={Mic} className="w-6 h-6" />
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