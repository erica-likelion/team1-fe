import TextButton from "@components/commons/TextButton";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useUser } from "@contexts/UserContext";

import Right from "@assets/images/white_chevron_right.svg"

const PrescriptionPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useUser();

    const steps = ['step1', 'step2', 'step3', 'step4', 'step5'];

    const handleNext = () => {
        navigate('/prescription/upload');
    };

    return (
        <div className="pt-9.5 px-5">
            <div className="flex flex-col gap-21.5">
                <p className="text-xl font-semibold whitespace-pre-line">
                    {t('prescription.titleParts.part1')}
                    <span className="text-[#00C88D]">{user ? user.name : t('user.defaultName')}</span>
                    {t('prescription.titleParts.part2')}
                </p>
                
                <ol className="space-y-4 font-semibold list-none mb-20">
                    {steps.map((step, index) => (
                        <li key={step}>
                            <div className="flex">
                                <span className="mr-2 flex-shrink-0">{index + 1}.</span>
                                <span className="whitespace-pre-line">{t(`prescription.steps.${step}`)}</span>
                            </div>
                            {index === steps.length - 1 && (
                                <div className="ml-6 text-xs font-normal">
                                    {t('prescription.steps.details')}
                                </div>
                            )}
                        </li>
                    ))}
                </ol>
            </div>
            
            <TextButton text={t('prescription.buttons.start')} icon={Right} onClick={handleNext} />
        </div>
    )
}


export default PrescriptionPage;