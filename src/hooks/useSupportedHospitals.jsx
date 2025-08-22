import { useTranslation } from 'react-i18next';

export const useSupportedHospitals = () => {
    const { t } = useTranslation();
    
    return [
        {
            title: t('hospitals.1.title'),
            description: t('hospitals.1.description')
        },
        {
            title: t('hospitals.2.title'),
            description: t('hospitals.2.description')
        },
        {
            title: t('hospitals.3.title'),
            description: t('hospitals.3.description')
        },
        {
            title: t('hospitals.4.title'),
            description: t('hospitals.4.description')
        },
        {
            title: t('hospitals.5.title'),
            description: t('hospitals.5.description')
        }
    ];
};

export default useSupportedHospitals;