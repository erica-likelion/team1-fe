import { useTranslation } from "react-i18next";

const HospitalInfo = ({ hospitalName, distance, phone, clCd, dgsbjtCds = [] }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-white p-4 w-[250px] !rounded-xl !shadow-[0_4px_12px_rgba(0, 0, 0, 0.15)]">
            {/* 병원 이름 */}
            <p className="mb-2 text-lg font-bold text-gray-800">
                {hospitalName}
            </p>

            <div>
            {/* 거리 */}
            {distance && (
                <div className="mb-1 text-xs text-gray-600 flex gap-1">
                    <p>{t('hospitals.distance')}:</p>
                    <p className="text-[#00A270]">{distance}</p>
                </div>
            )}

            {/* 전화번호 */}
            {phone && (
                <div className="mb-2 text-xs text-gray-600 flex gap-1">
                    <p>{t('hospitals.call')}:</p>
                    <p className="text-[#00A270]">{phone}</p>
                </div>
            )}
            </div>

            {/* 병원 분류 */}
            {clCd && (
                <div className="my-2">
                <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-bold">
                    {t(`hospitals.mediType.${clCd}`)}
                </span>
                </div>
            )}

            {/* 진료과목 */}
            {dgsbjtCds.length > 0 && (
                <div className="mt-2">
                <div className="text-[11px] text-gray-500 mb-1">
                    {t('hospitals.department')}:
                </div>
                <div className="flex flex-wrap gap-1">
                    {dgsbjtCds.map((code, idx) => (
                    <span
                        key={idx}
                        className="bg-[#C5F4E1] font-semibold px-2 py-0.5 rounded text-[10px]"
                    >
                        {t(`hospitals.departmentCodes.${code}`)}
                    </span>
                    ))}
                </div>
                </div>
            )}
        </div>
    );
}

export default HospitalInfo;
