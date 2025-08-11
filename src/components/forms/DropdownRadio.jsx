//모든 스타일 css는 그냥 기능 작동하는지 확인하기 위해 임의로 작성한 코드입니다!

import { useState, useRef, useEffect } from 'react';

const DropdownRadio = ({
  label,
  value,
  onChange,
  items = [],                
  placeholder = '** 선택',
  className = '', //추가 css 클래스
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null); //컴포넌트 DOM 참조

 
  useEffect(() => {
    const onClick = (e) => { 
      if (ref.current && !ref.current.contains(e.target)) setOpen(false); 
    };
    document.addEventListener('mousedown', onClick);
    
    // 언마운트 시 이벤트 리스너 (이벤트 리스너가 계속 쌓이지 않도록 클린업) -> 메모리 낭비 줄임
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const selected = items.find(i => i.key === value)?.text ?? '';

  return (
    <div className={`w-full ${className}`} ref={ref}>

      {/* 언어 설정 페이지 때문에 조건부 렌더링을 달아놓긴 했는데, 고민해봐야할듯함 (radio를 따로 만들지) */}
      {label && <div className="mb-2 text-sm text-gray-600">{label}</div>}

      
      <button
        type="button" //드롭다운 박스 버튼 -> submit 안되게 button으로 설정함
        onClick={() => setOpen(o => !o)}
        className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-white flex items-center justify-between"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={!selected ? "text-gray-400" : ""}>
          {selected || placeholder}
        </span>
        
        {/* 조건부 렌더링 추가하기! (드롭다운했을때 위, 드롭다운 실행 안할때, 아래) */}
        <span className="ml-3">▾</span>
      </button>

      
      {open && (
        <div
          role="listbox"
          tabIndex={-1}
          className="mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-md"
        >
          <ul className="py-2">
            {/* 각 옵션 반복 생성 -> .map() */}
            {items.map(({ key, text }) => (

              // 구분선 스타일 / 마지막 아이템 구분선 제거 -> black #000000
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
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownRadio;
