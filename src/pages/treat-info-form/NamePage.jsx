/* 사전 문진 정보 입력 페이지 (이름) */

import { useState } from "react";
//import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import TitleBlock from "../../components/commons/TitleBlock";
import TextField from "../../components/forms/TextField";
import TextButton from "../../components/commons/TextButton";
import WhiteChevronRight from "@assets/images/white_chevron_right.svg";

const NamePage = () => {
    // const { t } = useTranslation();
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');

    const navigate = useNavigate();

    // 버튼 활성화 여부 결정
    const canMoveNextStep = lastName.trim().length > 0 && firstName.trim().length > 0;
    
    const handleNext = () => {
        console.log('성:', lastName, '이름:', firstName);
        navigate('/treat-info-form-age')
    };

    return (
        <div className="p-5">
            
            <TitleBlock
                title = "당신의 이름은 무엇인가요?"
                subtitle = "이름을 입력해주세요."
            />
            <div className="mt-13 ">
                <TextField
                    value={lastName}
                    onChange={setLastName}
                    placeholder="성"
                    maxLength={20}
                />
                <TextField
                    className = "mt-2"
                    value={firstName}
                    onChange={setFirstName}
                    placeholder="이름"
                    maxLength={100}
                />
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

export default NamePage;