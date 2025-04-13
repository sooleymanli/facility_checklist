import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Modal, Input, Button, Form } from 'antd';
import SignatureCanvas from 'react-signature-canvas';

// Debounced resize handler to avoid excessive updates
const useWindowResizeDebounced = (callback: () => void, delay = 200) => {
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(callback, delay);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [callback, delay]);
};

const SaveModal: React.FC<{
    visible: boolean;
    onClose: () => void;
    onConfirm: (inspector: string, signatureBase64: string) => void;
}> = ({ visible, onClose, onConfirm }) => {
    const [inspector, setInspector] = useState('');
    const [signatureData, setSignatureData] = useState<string | undefined>('');
    const [isSmallScreen, setIsSmallScreen] = useState(() => window.innerWidth < 1024);
    const sigCanvasRef = useRef<SignatureCanvas>(null);

    // Use debounced window resize handler
    const checkScreen = useCallback(() => {
        setIsSmallScreen(window.innerWidth < 1024);
    }, []);
    
    useWindowResizeDebounced(checkScreen);

    // Initialize once on mount
    useEffect(() => {
        checkScreen();
    }, [checkScreen]);

    const handleSignatureEnd = useCallback(() => {
        const canvas = sigCanvasRef.current;
        if (canvas && !canvas.isEmpty()) {
            const base64 = sigCanvasRef.current?.getCanvas().toDataURL('image/png');
            setSignatureData(base64);
        }
    }, []);

    const handleClearSignature = useCallback(() => {
        sigCanvasRef.current?.clear();
        setSignatureData('');
    }, []);

    const handleConfirm = useCallback(() => {
        if (inspector && signatureData) {
            onConfirm(inspector, signatureData); // signatureData is base64
            onClose();
            setInspector('');
            setSignatureData('');
            sigCanvasRef.current?.clear();
        }
    }, [inspector, signatureData, onConfirm, onClose]);

    const getSignatureHeight = useCallback(() => {
        const width = window.innerWidth;
        if (width < 568) return 300; // Mobile
        if (width < 1024) return 400; // Tablet
        return 200; // Desktop
    }, []);

    // Memoize styles to avoid recalculation on every render
    const modalStyle = useMemo(() => (
        isSmallScreen ? { top: 0, margin: 0, maxWidth: '100%', paddingBottom: 0 } : {}
    ), [isSmallScreen]);

    const modalBodyStyle = useMemo(() => (
        isSmallScreen ? { 
            height: 'calc(100vh - 55px)', 
            padding: '16px', 
            display: 'flex', 
            flexDirection: 'column' as const 
        } : {}
    ), [isSmallScreen]);

    const formStyle = useMemo(() => ({ 
        marginTop: isSmallScreen ? 8 : 36, 
        flex: isSmallScreen ? 1 : 'unset', 
        flexDirection: isSmallScreen ? 'column' as const : undefined 
    }), [isSmallScreen]);

    const formItemStyle = useMemo(() => ({ 
        marginBottom: isSmallScreen ? 16 : 24 
    }), [isSmallScreen]);

    const signatureFormItemStyle = useMemo(() => ({ 
        marginBottom: isSmallScreen ? 16 : 24, 
        flex: isSmallScreen ? 1 : 'unset',
        flexDirection: isSmallScreen ? 'column' as const : undefined
    }), [isSmallScreen]);

    const signatureContainerStyle = useMemo(() => ({ 
        border: '1px solid #d9d9d9', 
        borderRadius: 4, 
        marginBottom: 0,
        display: isSmallScreen ? 'flex' : 'block',
        width: '100%'
    }), [isSmallScreen]);

    const canvasProps = useMemo(() => ({
        width: isSmallScreen ? window.innerWidth - 40 : 500,
        height: getSignatureHeight(),
        className: 'sigCanvas',
        style: { 
            width: '100%', 
            height: isSmallScreen ? '100%' : getSignatureHeight(), 
            display: 'block',
            flex: isSmallScreen ? 1 : 'unset'
        }
    }), [isSmallScreen, getSignatureHeight]);

    const buttonContainerStyle = useMemo(() => ({
        display: 'flex', 
        justifyContent: 'space-between', 
        gap: 8, 
        marginTop: 'auto'
    }), []);

    return (
        <Modal
            title="Yadda saxla"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={isSmallScreen ? "100%" : 520}
            style={modalStyle}
            bodyStyle={modalBodyStyle}
            closable={true}
        >
            <Form layout='vertical' style={formStyle}>
                <Form.Item label="Yoxlayan şəxsin adı və soyadı" vertical style={formItemStyle}>
                    <Input
                        value={inspector}
                        onChange={(e) => setInspector(e.target.value)}
                        size="large"
                    />
                </Form.Item>

                <Form.Item 
                    label="İmza" 
                    vertical 
                    style={signatureFormItemStyle}
                >
                    <div style={signatureContainerStyle}>
                        <SignatureCanvas
                            ref={sigCanvasRef}
                            penColor="black"
                            canvasProps={canvasProps}
                            onEnd={handleSignatureEnd}
                        />
                    </div>
                </Form.Item>

                <div style={buttonContainerStyle}>
                    <Button onClick={handleClearSignature} size="large">
                        Təmizlə
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleConfirm}
                        size="large"
                        block
                        disabled={!inspector || !signatureData}
                    >
                        Təsdiqlə
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default React.memo(SaveModal);
