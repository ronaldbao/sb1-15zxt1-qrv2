"use client";

import { useState, useRef, useEffect } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface QRCodeGeneratorProps {
  onSave: (qrCodeData: string) => void;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ onSave }) => {
  const [url, setUrl] = useState('https://example.com');
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(300);
  const [margin, setMargin] = useState(10);
  const [dotStyle, setDotStyle] = useState('square');
  const [dotColor, setDotColor] = useState('#000000');
  const [cornerSquareStyle, setCornerSquareStyle] = useState('square');
  const [cornerDotStyle, setCornerDotStyle] = useState('square');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoSize, setLogoSize] = useState(0.2);
  const [logoRemoveBg, setLogoRemoveBg] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    updateQRCode();
  }, [url, width, height, margin, dotStyle, dotColor, cornerSquareStyle, cornerDotStyle, backgroundColor, foregroundColor, logoUrl, logoSize, logoRemoveBg]);

  const updateQRCode = () => {
    const options = {
      width,
      height,
      type: 'svg' as const,
      data: url,
      margin,
      qrOptions: { typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'Q' },
      dotsOptions: { type: dotStyle as any, color: foregroundColor },
      cornersSquareOptions: { type: cornerSquareStyle as any, color: foregroundColor },
      cornersDotOptions: { type: cornerDotStyle as any, color: foregroundColor },
      backgroundOptions: { color: backgroundColor },
      imageOptions: { 
        hideBackgroundDots: true,
        imageSize: logoSize,
        crossOrigin: 'anonymous',
        margin: 0
      },
      image: logoUrl
    };

    const newQRCode = new QRCodeStyling(options);
    setQrCode(newQRCode);

    if (ref.current) {
      ref.current.innerHTML = '';
      newQRCode.append(ref.current);
    }
  };

  const handleDownload = () => {
    if (qrCode) {
      qrCode.download({ name: 'qr-code', extension: 'png' });
    }
  };

  const handleSave = () => {
    onSave(url);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Width</Label>
          <Slider min={100} max={500} step={10} value={[width]} onValueChange={([value]) => setWidth(value)} />
        </div>
        <div>
          <Label>Height</Label>
          <Slider min={100} max={500} step={10} value={[height]} onValueChange={([value]) => setHeight(value)} />
        </div>
        <div>
          <Label>Margin</Label>
          <Slider min={0} max={50} value={[margin]} onValueChange={([value]) => setMargin(value)} />
        </div>
        <div>
          <Label>Dot Style</Label>
          <Select value={dotStyle} onValueChange={setDotStyle}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="square">Square</SelectItem>
              <SelectItem value="dots">Dots</SelectItem>
              <SelectItem value="rounded">Rounded</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Foreground Color</Label>
          <Input type="color" value={foregroundColor} onChange={(e) => setForegroundColor(e.target.value)} />
        </div>
        <div>
          <Label>Background Color</Label>
          <Input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} />
        </div>
        <div>
          <Label>Corner Square Style</Label>
          <Select value={cornerSquareStyle} onValueChange={setCornerSquareStyle}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="square">Square</SelectItem>
              <SelectItem value="dot">Dot</SelectItem>
              <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Corner Dot Style</Label>
          <Select value={cornerDotStyle} onValueChange={setCornerDotStyle}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="square">Square</SelectItem>
              <SelectItem value="dot">Dot</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Logo</Label>
          <Input type="file" accept="image/*" onChange={handleLogoUpload} ref={fileInputRef} />
        </div>
        <div>
          <Label>Logo Size</Label>
          <Slider min={0.1} max={0.5} step={0.05} value={[logoSize]} onValueChange={([value]) => setLogoSize(value)} />
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="remove-bg" checked={logoRemoveBg} onCheckedChange={setLogoRemoveBg} />
          <Label htmlFor="remove-bg">Remove Logo Background</Label>
        </div>
      </div>
      <div ref={ref} className="flex justify-center"></div>
      <div className="flex justify-center space-x-4">
        <Button onClick={handleDownload}>Download QR Code</Button>
        <Button onClick={handleSave}>Save to Database</Button>
      </div>
    </div>
  );
};

export default QRCodeGenerator;