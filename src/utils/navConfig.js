// NavBar 설정 관리 파일 - 현재 페이지에 맞는 구성을 반환

// NavBar 타입 결정
const getNavBarType = (pathname) => {
    if (pathname === '/home' || pathname === '/') return 'home';
    if (pathname === '/mypage') return 'mypage';
    if (pathname === '/chat') return 'chat';
    if (pathname === '/language') return 'language';
    if (pathname === '/prescription') return 'prescription';
    return 'default';
};

// 타입에 맞는 NavBar 타이틀 (TopNavBar 중앙 텍스트)
const getNavBarTitle = (type, t) => {
    switch (type) {
        case 'mypage':
            return t('navigation.mypage');
        case 'chat':
            return t('navigation.chat');
        case 'language':
            return t('navigation.language');
        case 'prescription':
            return t('navigation.prescription.guide');
        default:
            return "";
    }
};

// NavBar 타입별 핸들러 생성, LeftClick RightClick 순
const getNavBarHandlers = (type, navigate) => {
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
                onLeftClick: () => {
                    // 추후 수정: 검색 기능
                    console.log('검색 클릭');
                },
                onRightClick: () => navigate('/language')
            };
        case 'language':
        case 'prescription':
        case 'default':
        default:
            return {
                onLeftClick: () => navigate(-1), // 뒤로가기
                onRightClick: () => navigate('/home') // 홈으로
            };
    }
};

// NavBar 설정 통합 함수
export const getNavBarConfig = (pathname, navigate, t) => {
    const type = getNavBarType(pathname);
    const title = getNavBarTitle(type, t);
    const handlers = getNavBarHandlers(type, navigate);

    return {
        type,
        title,
        ...handlers
    };
};