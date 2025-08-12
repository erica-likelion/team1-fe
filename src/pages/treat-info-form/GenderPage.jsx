/* 사전 문진 정보 입력 페이지 (성별) */

import { useTranslation } from "react-i18next";

const GenderPage = () => {
    const { t } = useTranslation();

    return (
        <div className="p-5">
            <div className="text-center">
                <h1 className="text-xl font-bold mb-4">
                    {t('navigation.preCheck')}
                </h1>
                <p>
                    성별 입력 페이지 입니다.
                </p>
            </div>
        </div>
    );
};

export default GenderPage;