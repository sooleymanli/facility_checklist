import React, { useState, useRef } from 'react';
import { Modal, Input, Button, Form } from 'antd';
import SignatureCanvas from 'react-signature-canvas';

const SaveModal: React.FC<{
    visible: boolean;
    onClose: () => void;
    onConfirm: (inspector: string, signatureBase64: string) => void;
}> = ({ visible, onClose, onConfirm }) => {
    const [inspector, setInspector] = useState('');
    const [signatureData, setSignatureData] = useState<string | undefined>('');
    const sigCanvasRef = useRef<SignatureCanvas>(null);

    const handleSignatureEnd = () => {
        const canvas = sigCanvasRef.current;
        if (canvas && !canvas.isEmpty()) {
            const base64 = sigCanvasRef.current?.getCanvas().toDataURL('image/png');

            setSignatureData(base64);
        }
    };

    const handleClearSignature = () => {
        sigCanvasRef.current?.clear();
        setSignatureData('');
    };

    const handleConfirm = () => {
        if (inspector && signatureData) {
            onConfirm(inspector, signatureData); // signatureData is base64
            onClose();
            setInspector('');
            setSignatureData('');
            sigCanvasRef.current?.clear();
        }
    };

    return (
        <Modal
            title="Yadda saxla"
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form layout='vertical' style={{ marginTop: 36 }}>
                <Form.Item label="Yoxlayan şəxsin adı və soyadı" vertical>

                    <Input
                        value={inspector}
                        onChange={(e) => setInspector(e.target.value)}
                        size="large"
                    />
                </Form.Item>

            </Form>

            <Form.Item label="İmza" vertical>


                <div style={{ border: '1px solid #d9d9d9', borderRadius: 4, marginBottom: 0 }}>

                    <SignatureCanvas
                        ref={sigCanvasRef}
                        penColor="black"
                        placeholder="İmzanızı buraya çəkin"
                        canvasProps={{
                            width: 500,
                            height: 200,
                            className: 'sigCanvas',
                            style: { width: '100%', height: 200, display: 'block' }
                        }}
                        onEnd={handleSignatureEnd}
                    />
                </div>


            </Form.Item>



            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
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
        </Modal>
    );
};

export default SaveModal;
