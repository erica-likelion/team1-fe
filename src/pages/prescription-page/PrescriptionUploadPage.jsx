import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCallback, useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";

import TextButton from "@components/commons/TextButton"

import Document from "@assets/images/document.svg";
import Camera from "@assets/images/camera.svg";
import Gallery from "@assets/images/gallery.svg";
import Right from "@assets/images/white_chevron_right.svg";
import Close from "@assets/images/gray_close.svg";

const PrescriptionUploadPage = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isCamera, setIsCamera] = useState(false);
    const [stream, setStream] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const videoRef = useRef(null);

    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    useEffect(() => {
        // 컴포넌트 언마운트시 카메라 정리
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [stream, previewUrl]);

    const createPreviewUrl = (file) => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return url;
    };

    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        if (rejectedFiles.length > 0) {
            alert(t('prescription.upload.file_type_error'));
            return;
        }
        
        if (acceptedFiles.length > 0) {
            setUploadedFiles(acceptedFiles);
            createPreviewUrl(acceptedFiles[0]);
            console.log('파일이 업로드되었습니다:', acceptedFiles);
        }
    }, [previewUrl]);

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png']
        },
        multiple: false,
        noClick: false,
        noKeyboard: true
    });

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    facingMode: 'environment' // 후면 카메라 선호
                }
            });
            setStream(mediaStream);
            setIsCamera(true);
        } catch (error) {
            console.error('카메라 접근 실패:', error);
            // 카메라 접근 실패시 파일 선택으로 폴백
            handleFallbackFileInput();
        }
    };

    const handleFallbackFileInput = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                setUploadedFiles([file]);
                createPreviewUrl(file);
                console.log('파일로 선택된 이미지:', file);
            }
        };
        input.click();
    };

    const capturePhoto = () => {
        if (!videoRef.current) return;
        
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        // 원본 비디오 크기 그대로 캡처 (비율 유지)
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        
        canvas.toBlob((blob) => {
            const file = new File([blob], `prescription-${Date.now()}.jpg`, {
                type: 'image/jpeg',
            });
            setUploadedFiles([file]);
            createPreviewUrl(file);
            stopCamera();
            console.log('카메라로 촬영된 파일:', file);
        }, 'image/jpeg', 0.9);
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCamera(false);
    };

    const handleCameraCapture = () => {
        startCamera();
    };

    const handleGallerySelect = () => {
        // 갤러리 선택을 위해 dropzone의 파일 선택 다이얼로그 열기
        open();
    };

    const handleScan = () => {
        if (uploadedFiles.length === 0) {
            alert(t('prescription.upload.no_file_selected'));
            return;
        }
        
        // 스캔 페이지로 이동하며 데이터 전달
        navigate('/prescription/scanning', { 
            state: { 
                uploadedFile: uploadedFiles[0],
                language: i18n.language 
            } 
        });
    };

    if (isCamera) {
        return (
            <div className="flex flex-col px-5">
                <div className="flex justify-center items-center">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="max-w-[335px] max-h-full h-auto object-contain"
                    />
                </div>
                
                <div className="mt-8 space-y-3">
                    <TextButton 
                        text={t('prescription.buttons.capture')} 
                        icon={Camera}
                        className="relative bg-[#3DE0AB] !text-[#00A270]"
                        onClick={capturePhoto}
                    />
                    <TextButton 
                        text={t('prescription.buttons.cancel')} 
                        icon={Close}
                        className="relative bg-gray-300 !text-[#909394]"
                        onClick={stopCamera}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col px-5 pt-3.25 gap-6">
            <div 
                {...getRootProps()} 
                className={`flex flex-col justify-center items-center gap-3 p-3 w-full h-auto max-h-[500px] min-h-[225px] border-2 border-dashed rounded-[4px] transition-colors ${
                    isDragActive 
                        ? 'bg-[#3DE0AB20] border-[#3DE0AB]' 
                        : uploadedFiles.length > 0
                        ? 'bg-[#3DE0AB10] border-[#3DE0AB]'
                        : 'bg-[#3DE0AB08] border-[#3DE0AB]'
                }`}
            >
                <input {...getInputProps()} />
                {uploadedFiles.length > 0 ? (
                    <>
                        <img 
                            src={previewUrl} 
                            alt={t('prescription.upload.uploaded_image_alt')} 
                            className="max-w-full max-h-[400px] object-contain rounded-md"
                        />
                        <p className="text-xs font-medium text-[#00C88D]">
                            {t('prescription.upload.file_uploaded')}: {uploadedFiles[0].name}
                        </p>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setUploadedFiles([]);
                                if (previewUrl) {
                                    URL.revokeObjectURL(previewUrl);
                                    setPreviewUrl(null);
                                }
                            }}
                            className="text-xs text-red-500 hover:text-red-700 underline"
                        >
                            {t('prescription.upload.select_other_image')}
                        </button>
                    </>
                ) : isDragActive ? (
                    <>
                        <img src={Document} alt="document" />
                        <p className="text-xs font-normal text-[#00C88D]">
                            {t('prescription.upload.drag_and_drop')}
                        </p>
                        <p className="text-xs font-normal text-[#B3BABD]">
                            {t('prescription.upload.file_format_description')}
                        </p>
                    </>
                ) : (
                    <>
                        <img src={Document} alt="document" />
                        <p className="text-xs font-normal">
                            {t('prescription.upload.description')}
                        </p>
                        <p className="text-xs font-normal text-[#B3BABD]">
                            {t('prescription.upload.file_format_description')}
                        </p>
                    </>
                )}
            </div>

            <div className="flex items-center h-11">
                <div className="flex-1 h-px bg-[#A6A9AA]"></div>
                <span className="px-[14px] text-sm text-[#A6A9AA]">{t('prescription.upload.or')}</span>
                <div className="flex-1 h-px bg-[#A6A9AA]"></div>
            </div>

            <div className="space-y-3 mt-3.25 mb-15.25">
                <TextButton 
                    text={t('prescription.buttons.camera')} 
                    icon={Camera} 
                    className="relative bg-[#9DEECF] !text-[#00A270]"
                    onClick={handleCameraCapture}
                />
                <TextButton 
                    text={t('prescription.buttons.gallery')} 
                    icon={Gallery} 
                    className="relative bg-[#9DEECF] !text-[#00A270]"
                    onClick={handleGallerySelect}
                />
            </div>

            <TextButton 
                text={t('prescription.buttons.scan')} 
                icon={Right}
                onClick={handleScan}
                disabled={uploadedFiles.length === 0}
            />
        </div>
    );
};

export default PrescriptionUploadPage;