/* 마이페이지 */
/* 연결 확인용 테스트 페이지 - 추후 디자인에 맞게 변경 예정 */

import { useTranslation } from "react-i18next";

const MyPage = () => {
    const { t } = useTranslation();

    return (
        <div className="p-5">
            <div className="text-center">
                <h1 className="text-xl font-bold mb-4">
                    {t('navigation.mypage')}
                </h1>
                <p>
                    마이페이지입니다.
                </p>
            </div>
        </div>
    );
};

export default MyPage;