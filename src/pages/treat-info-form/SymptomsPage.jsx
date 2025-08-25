/* 사전 문진 정보 입력 페이지 (증상) */

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useTreatInfo } from "@contexts/TreatInfoContext";
import TextButton from "../../components/commons/TextButton";
import TextField from "../../components/forms/TextField";
import TitleBlock from "../../components/commons/TitleBlock";
import WhiteChevronRight from "@assets/images/white_chevron_right.svg";

const SymptomsPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { formData, updateField, isStepValid } = useTreatInfo();
    
    const canMoveNextStep = isStepValid('symptoms');
    
    const handleNext = () => {
        //console.log('symptoms:', formData.symptoms);
        navigate('/treat-info/scanning')
    };

    const maxLength = 150;

    // 151까지 입력이 가능해지는 문제 해결 (150자 초과시 한글자도 입력이 안되게 수정)
    const handleSymptomsChange = (value) => {
        if (value.length <= maxLength) {
            updateField('symptoms', value);
        }
    };

    return (
        <div className="p-5">
            <TitleBlock
                title = {t('precheck.symptoms.title')}
                subtitle = {t('precheck.symptoms.description')}
            />
            <div className="mt-13 mb-14">
                <TextField
                    value={formData.symptoms}
                    onChange={handleSymptomsChange}
                    placeholder={t('precheck.symptoms.placeholder')}
                    maxLength={150}
                    height="h-[206px]"
                    multiline={true} //여러줄 입력 가능->textarea를 적용
                />
            </div>

            {/* 0 / 150 구현 */}
            <div className="text-right text-sm text-gray-400 mt-2">
                {formData.symptoms.length} / {maxLength}
            </div>
    
            
            <TextButton
                    text={t('precheck.buttons.submit')}
                    progress="5/5"
                    onClick={handleNext}
                    disabled={!canMoveNextStep}
                    icon={WhiteChevronRight}
            />
            
        </div>
    );
};

export default SymptomsPage;