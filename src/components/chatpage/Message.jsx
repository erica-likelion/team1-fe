import Highlighter from 'react-highlight-words';
import { useState, forwardRef } from 'react';
import { useSearch } from '@contexts/SearchContext';
import { useUser } from '@contexts/userContext';

import Logo from "@assets/images/logo.svg";
import Exchange from "@assets/images/exchange.svg";
import World from "@assets/images/world.svg";

// Message 컴포넌트
const Message = forwardRef(({ message }, ref) => {
    const { isSearchMode, searchQuery } = useSearch();
    const [translate, useTranslate] = useState(true);
    const { user } = useUser();

    const handleTranslateClick = () => { useTranslate(prev => !prev); }

    const messageDivStyle = "max-w-[75%] text-[12px] rounded-sm font-medium p-4 shadow-[2px_2px_8px_0_rgba(23,23,27,0.15)]" 
    if (message.sender === user.type) {
        // 사용자 메시지 구조
        return (
            <div ref={ref} className="flex justify-end w-full">
                <div className="flex justify-end w-full items-start m-2 gap-2">
                    <img src={translate ? World : Exchange} className="self-end w-4 h-4 cursor-pointer" onClick={handleTranslateClick}/>
                    <div className={`${messageDivStyle} bg-[#C5F4E1] text-[#00A270]`}>
                        {user.type === "medi" ? 
                        <Highlighter
                            searchWords={isSearchMode && searchQuery ? [searchQuery] : []}
                            textToHighlight={translate ? message.koreanMessage : message}
                            highlightClassName="bg-yellow-200 text-black"
                        />:
                        <Highlighter
                            searchWords={isSearchMode && searchQuery ? [searchQuery] : []}
                            textToHighlight={translate ? message.message : message.koreanMessage}
                            highlightClassName="bg-yellow-200 text-black"
                        />}
                    </div>
                </div>
            </div>
        );
    } else {
        // 상대 메세지 구조
        return (
            <div ref={ref} className="flex justify-start w-full">
                <div className="flex items-start m-2 gap-2 w-full">
                    {/* 프로필 아바타 */}
                    <div className="flex justify-center items-center w-8 h-8 mt-0 mr-2 rounded-lg shadow-[2px_2px_8px_0_rgba(23,23,27,0.15)]">
                        <img src={Logo} className="w-6 h-6" />
                    </div>
                    {/* 메시지 내용 */}
                    <div className={`${messageDivStyle} bg-[#F6F6F6] text-[#000000]`}>
                        {user.type === "medi" ? 
                        <Highlighter
                            searchWords={isSearchMode && searchQuery ? [searchQuery] : []}
                            textToHighlight={translate ? message.koreanMessage : message.message}
                            highlightClassName="bg-yellow-200 text-black"
                        />:
                        <Highlighter
                            searchWords={isSearchMode && searchQuery ? [searchQuery] : []}
                            textToHighlight={translate ? message.message : message.koreanMessage}
                            highlightClassName="bg-yellow-200 text-black"
                        />}
                    </div>
                    <img src={translate ? Exchange : World} className="self-end w-4 h-4 cursor-pointer" onClick={handleTranslateClick}/>
                </div>
            </div>
        );
    }
});

export default Message;