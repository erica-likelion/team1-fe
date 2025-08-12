/* 사전 문진 정보 입력 페이지 (증상) */

import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router";
import TextButton from "../../components/commons/TextButton";
import TextField from "../../components/forms/TextField";
import TitleBlock from "../../components/commons/TitleBlock";
import WhiteChevronRight from "@assets/images/white_chevron_right.svg";

const SymptomsPage = () => {
    const [symptoms, setSymptoms] = useState('')
    const { t } = useTranslation();

    const navigate = useNavigate(); 
    
    const canMoveNextStep = 0 < symptoms.length;
    
    const handleNext = () => {
        console.log('symptoms:', symptoms);
        navigate('/treat-info-form-name')
    };

    const maxLength = 150;

    const handleSymptomsChange = (value) => {
        if (value.length <= maxLength) {
            setSymptoms(value);
        }
    };

    return (
        <div className="p-5">
            <TitleBlock
                title = "어떤 증상을 가지고 있나요?"
                subtitle = "나타난 증상을 모두 입력해 주세요."
            />
            <div className="mt-13 ">
                <TextField
                    value={symptoms}
                    onChange={handleSymptomsChange}
                    placeholder="내용을 입력하세요."
                    maxLength={150}
                    height="h-[206px]"
                    multiline={true} //여러줄 입력 가능->textarea를 적용
                />
            </div>

            {/* 0 / 150 구현 */}
            <div className="text-right text-sm text-gray-400 mt-2">
                {symptoms.length} / {maxLength}
            </div>
    
            <div className="">
                <TextButton
                    text="입력하기"
                    onClick={handleNext}
                    disabled={!canMoveNextStep}
                    icon={WhiteChevronRight}
                />
            </div>
        </div>
    );
};

export default SymptomsPage;