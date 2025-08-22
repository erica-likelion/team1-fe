//모든 스타일 css는 그냥 기능 작동하는지 확인하기 위해 임의로 작성한 코드입니다!

import { useState, useRef, useEffect } from 'react';
import Checkbox from "@assets/images/checkbox_field.svg";
import ActiveCheckbox from "@assets/images/active_checkbox_field.svg";
import TopArrow from "@assets/images/top_arrow_gray.svg"
import GraySearch from "@assets/images/gray_search.svg"

const DropdownRadio = ({
  label,
  value,
  onChange,
  items = [],                
  placeholder = '** 선택',
  className = '', //추가 css 클래스
  searchable = false, // 검색 박스 삽입 여부
  searchPlaceholder = '검색',
  maxHeight="h-70"
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null); //컴포넌트 DOM 참조

  const[searchTerm, setSearchTerm]= useState('');
  const searchInputRef = useRef(null)

 
  useEffect(() => {
    const onClick = (e) => { 
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false); 
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', onClick);
    
    // 언마운트 시 이벤트 리스너 (이벤트 리스너가 계속 쌓이지 않도록 클린업) -> 메모리 낭비 줄임
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  //
  useEffect(() => {
    if (open && searchable && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [open, searchable]);



  const selected = items.find(i => i.key === value)?.text ?? '';

  
  const filteredItems = searchable 
    ? items.filter(item => 
        item.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : items;
  
    
  const handleDropdownToggle = () => {
    setOpen(o => !o);
    if (!open) {
      setSearchTerm('');
    }
  };
  
  return (
    <div className={`w-full ${className}`} ref={ref}>
      
      <button
        type="button" //드롭다운 박스 버튼 -> submit 안되게 button으로 설정함
        onClick={handleDropdownToggle}
        className="w-full h-14 px-4 rounded-md border border-gray-200 flex items-center justify-between"
        aria-haspopup="listbox"
        aria-expanded={open}
        
      >
        <span className={!selected ? "text-gray-400" : ""}>
          {selected || placeholder}
        </span>
        
        {/* 상 화살표 삽입 필요 */}
        <span className={`ml-3 transform transition-transform duration-200 text-gray-500 ${open ? 'rotate-180' : ''}`}>
          <img className="w-4" src={TopArrow}/>
        </span>
      </button>

      
      {open && (
        <div
          role="listbox"
          tabIndex={-1}
          className=" w-full rounded-md border border-gray-200"
        >
          {/* 검색창 영역 */}
          {searchable && (
            <div className="p-4 border-md border-gray-200 border-dashed">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-6 pr-10 py-2 bg-gray-200 rounded-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-mint text-sm"
                  onClick={(e) => e.stopPropagation()}
                />
                
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <img className="w-4 h-4 mr-3" src={GraySearch}/>
                  
                </div>
              </div>
            </div>
          )}
          

        {/* 옵션 리스트 */}
        <div className={`p-5 ${maxHeight} overflow-y-auto no-scrollbar`}>
            {filteredItems.length > 0 ? (
              filteredItems.map(({ key, text }) => (
                <div
                  key={key}
                  className="flex items-center justify-between px-2 py-5 hover:bg-gray-50 cursor-pointer border-b border-gray-400 last:border-b-0"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onChange?.(key);
                    setOpen(false);
                    setSearchTerm('');
                  }}
                >
                  <span className="text-gray-800">{text}</span>
                  <div className="flex items-center">
                    {value === key ? (
                      
                      // 선택된 상태 - 초록색 체크 원
                      <div>
                        <img className="w-6 h-6" src={ActiveCheckbox}/>
                      </div>
                    ) : (
                      
                      // 선택되지 않은 상태 - 빈 원
                      <div>
                        <img className="w-6 h-6" src={Checkbox}/>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
             
             
             <div className="px-4 py-8 text-center text-gray-500">
                검색 결과가 없습니다
              </div>
            )}
        </div>
        </div>
      
        
      )}
    </div>
  );
};

export default DropdownRadio;
