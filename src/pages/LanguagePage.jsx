/* 언어 설정 페이지 */

import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "@constants/Languages";

import Checkbox from "@assets/images/checkbox_field.svg";
import ActiveCheckbox from "@assets/images/active_checkbox_field.svg";

const LanguagePage = () => {
    const { i18n } = useTranslation();

    const handleLanguageChange = (languageCode) => {
        i18n.changeLanguage(languageCode);
    };

    return (
        <div className="flex flex-col items-center pt-3 px-5 gap-1.5">
            <div className="px-5 w-[100%]">
                {SUPPORTED_LANGUAGES.map((language) => (
                    <div
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className="px-4.5 py-4.5 border-b-2 border-[#A6A9AA] cursor-pointer"
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-medium">{language.name}</span>
                            {i18n.language === language.code ? (
                                <img className="w-6 h-6" src={ActiveCheckbox} />
                            ) : (<img className="w-6 h-6" src={Checkbox} />)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LanguagePage;