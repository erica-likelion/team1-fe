import { useTranslation } from "react-i18next";

const HospitalInfo = ({ hospitalName, distance, phone, clCd, dgsbjtCds = [], onSelect }) => {
    const { t } = useTranslation();
    return (
        <div className="p-4 w-[250px]">
            {/* 병원 이름 */}
            <h4 className="mb-2 text-lg font-bold text-gray-800">
                {hospitalName}
            </h4>

            <div>
            {/* 거리 */}
            {distance && (
                <p className="mb-1 text-xs text-gray-600">
                {t('hospitals.distance')}: {distance}
                </p>
            )}

            {/* 전화번호 */}
            {phone && (
                <p className="mb-2 text-xs text-gray-600">
                    {phone}
                </p>
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
                    진료과목:
                </div>
                <div className="flex flex-wrap gap-1">
                    {dgsbjtCds.map((code, idx) => (
                    <span
                        key={idx}
                        className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px]"
                    >
                        {t(`hospitals.departmentCodes.${code}`)}
                    </span>
                    ))}
                </div>
                </div>
            )}

            {/* 선택 버튼 */}
            {onSelect && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                    <button
                        onClick={onSelect}
                        className="hospital-select-button w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
                    >
                        {t('hospitals.selectHospital')}
                    </button>
                </div>
            )}
        </div>
    );
}

export default HospitalInfo;
