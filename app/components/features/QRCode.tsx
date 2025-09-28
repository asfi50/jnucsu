'use client';

import Image from 'next/image';
import { generateQRCode } from '@/lib/utils';

interface QRCodeProps {
  url: string;
  title?: string;
  size?: number;
}

export default function QRCode({ url, title, size = 200 }: QRCodeProps) {
  const qrCodeUrl = generateQRCode(url);

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <Image
          src={qrCodeUrl}
          alt={`QR Code for ${title || 'page'}`}
          width={size}
          height={size}
          className="w-full h-auto"
        />
      </div>
      {title && (
        <p className="text-sm text-gray-600 text-center max-w-[200px]">
          Scan to visit {title}
        </p>
      )}
    </div>
  );
}