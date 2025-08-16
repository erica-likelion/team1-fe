import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TextButton from "@components/commons/TextButton"

const TreantInfoResultPage = () => {

    const {t} = useTranslation();
    const navigate = useNavigate();

    return (
        <div>
            
            <div>
                {/* Text */}
                {/* 결과 박스
                번역 버튼 */}

            </div>
            <TextButton
                // text = ""
                // icon = {}
                // className =""
                // onClick= {}
            />
            <TextButton
                // text = ""
                // icon = {}
                // className =""
                // onClick= {}
            />
        </div>
    )

}

export default TreantInfoResultPage;