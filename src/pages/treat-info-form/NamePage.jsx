/* 사전 문진 정보 입력 페이지 (이름) */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import TitleBlock from "../../components/commons/TitleBlock";
import TextField from "../../components/forms/TextField";
import TextButton from "../../components/commons/TextButton";

const NamePage = () => {
    // const { t } = useTranslation();
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');

    const navigate = useNavigate();


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
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 ">
                <TextButton
                    text="입력하기"
                    onClick={handleNext}
                    disabled={!canMoveNextStep}
                />
            </div>
        </div>
    );
};

export default NamePage;