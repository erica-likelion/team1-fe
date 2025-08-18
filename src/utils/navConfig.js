// NavBar 설정 관리 파일 - 현재 페이지에 맞는 구성을 반환

// NavBar 타입 결정
const getNavBarType = (pathname) => {
    if (pathname === '/home' || pathname === '/') return 'home';
    if (pathname === '/mypage') return 'mypage';
    if (pathname === '/chat') return 'chat';
    if (pathname === '/language') return 'language';
    if (pathname === '/prescription') return 'prescription';
    if (pathname === '/prescription/upload') return 'prescription_upload';
    if (pathname === '/prescription/result') return 'prescription_result';
    if (pathname === '/mypage/history') return 'history';

    if (pathname.endsWith('/qr')) return 'qr';
    if (pathname.startsWith('/chat/')) return 'chatroom';
    if (pathname.startsWith('/treat-info-form')) return 'treat-info-form'; 

    return 'default';
};

// 타입에 맞는 NavBar 타이틀 (TopNavBar 중앙 텍스트)
const getNavBarTitle = (type, t) => {
    switch (type) {
        case 'mypage':
            return t('navigation.mypage');
        case 'language':
            return t('navigation.language');
        case 'prescription':
            return t('navigation.prescription.guide');
        case 'prescription_upload':
            return t('navigation.prescription.upload');
        case 'prescription_result':
            return t('navigation.prescription.description');
        case 'treat-info-form':
            return t('navigation.preCheck');
        case 'history':
            return t('navigation.history');
        case 'qr':
            return t('navigation.qrCode');
        case 'home':
        case 'chat':
        case 'chatroom':
        default:
            return "";
    }
};

// NavBar 타입별 핸들러 생성, LeftClick RightClick 순
const getNavBarHandlers = (type, navigate, toggleSearchMode = null) => {
    switch (type) {
        case 'home':
            return {
                onLeftClick: () => navigate('/home'),
                onRightClick: () => navigate('/language')
            };
        case 'mypage':
            return {
                onLeftClick: () => {
                    // 추후 수정: 알림 기능
                    console.log('알림 클릭');
                },
                onRightClick: () => navigate('/language')
            };
        case 'chat':
            return {
                onLeftClick: () => navigate('/home'),
                onRightClick: () => {
                    if (toggleSearchMode) {
                        toggleSearchMode();
                    } else {
                        console.log('검색 클릭 - toggleSearchMode 함수를 찾을 수 없음');
                    }
                }
            };
        case 'chatroom':
            return {
                onLeftClick: () => navigate(-1), 
                onRightClick: () => {
                    if (toggleSearchMode) {
                        toggleSearchMode();
                    } else {
                        console.log('검색 클릭 - toggleSearchMode 함수를 찾을 수 없음');
                    }
                }
            };
        case 'qr':
            return {
                onLeftClick: () => navigate(-1), // 채팅방으로 뒤로가기
                onRightClick: null // 오른쪽 버튼 없음
            };
        case 'language':
        case 'prescription':
        case 'prescription_upload':
        case 'prescription_description':
        case 'history':
        case 'default':
        default:
            return {
                onLeftClick: () => navigate(-1), // 뒤로가기
                onRightClick: () => navigate('/home') // 홈으로
            };
    }
};

// NavBar 설정 통합 함수
export const getNavBarConfig = (pathname, navigate, t, toggleSearchMode = null) => {
    const type = getNavBarType(pathname);
    const title = getNavBarTitle(type, t);
    const handlers = getNavBarHandlers(type, navigate, toggleSearchMode);

    return {
        type,
        title,
        ...handlers
    };
};