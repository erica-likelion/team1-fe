import { createContext, useState, useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// 1. Context 생성 - 검색 상태를 공유할 "그릇" 만들기
const userContext = createContext();

export const UserProvider= ({children}) =>{
    const [user, setUser] = useState(null);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const userType = searchParams.get('userType');
        const opponentLang = searchParams.get('opponentLang');

        if (userType === 'medi') {
            setUser({
                id: 818,
                type: "medi",
                name: "doctor",
                gender: "M",
                isTemporary: true,
                opponentLanguage: opponentLang 
            });
        } else {
            setUser({
                id: 181,
                type: "user",
                name: "멋사",
                gender: "M",
                opponentLanguage: "korean",
            });
        }
    }, [searchParams]);

    return (
        <userContext.Provider value={{user, setUser}}>
            {children}
        </userContext.Provider>
    );
}

export const useUser = () => {
    return useContext(userContext);
}