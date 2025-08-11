//모든 스타일 css는 그냥 기능 작동하는지 확인하기 위해 임의로 작성한 코드입니다!

import { useState, useRef, useEffect } from 'react';

const DropdownRadio = ({
  label,
  value,
  onChange,
  items = [],                
  placeholder = '** 선택',
  className = '', //추가 css 클래스
  searchable = false, // 검색 박스 삽입 여부
  searchPlaceholder = '검색'
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null); //컴포넌트 DOM 참조

  const[searchTerm, setSearchTerm]= useState('');
  const searchInputRef = useRef(null)

 
  useEffect(() => {
    const onClick = (e) => { 
      if (ref.current && !ref.current.contains(e.target)) 
      setOpen(false); 
      setSearchTerm('')
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

  //
  const filteredItems = searchable 
    ? items.filter(item => 
        item.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : items;
  
    //
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
        className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-white flex items-center justify-between"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={!selected ? "text-gray-400" : ""}>
          {selected || placeholder}
        </span>
        
        
        <span className={`ml-3 transform transition-transform duration-200 text-gray-500 ${open ? 'rotate-180' : ''}`}>▲</span>
      </button>

      
      {open && (
        <div
          role="listbox"
          tabIndex={-1}
          className="mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-md"
        >
          {/* 검색창 영역 */}
          {searchable && (
            <div className="p-4 bg-gray-50 border-b border-blue-300 border-dashed">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-4 pr-10 py-2 bg-gray-200 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-400 text-sm"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-500">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
            </div>
          )}
          
          {/* <ul className="py-2"> */}
            {/* 각 옵션 반복 생성 -> .map() */}
            {/* {items.map(({ key, text }) => ( */}

              {/* // 구분선 스타일 / 마지막 아이템 구분선 제거 -> black #000000
              <li key={key} className="border-b border-black last:border-b-0 mx-4"> 
                <label className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    className="accent-emerald-500"
                    checked={value === key}
                    onChange={() => { onChange?.(key); }}
                  />
                  <span>{text}</span>
                </label>
              </li>

            ))}
          </ul> */}
        

        {/* 옵션 리스트 */}
        <div className="max-h-64 overflow-y-auto">
            {filteredItems.length > 0 ? (
              filteredItems.map(({ key, text }) => (
                <div
                  key={key}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-200 last:border-b-0"
                  onClick={() => {
                    onChange?.(key);
                    setOpen(false);
                    setSearchTerm('');
                  }}
                >
                  <span className="text-gray-800">{text}</span>
                  <div className="flex items-center">
                    {value === key ? (
                      // 선택된 상태 - 초록색 체크 원
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-white">
                          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    ) : (
                      // 선택되지 않은 상태 - 빈 원
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
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
