import QRCode from 'qrcode';

export interface QRCodeOptions {
  width?: number;
  margin?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  color?: {
    dark?: string;
    light?: string;
  };
}

export class QRCodeGenerator {
  /**
   * Generate QR code for an event
   * @param eventUrl - The URL of the event
   * @param options - QR code generation options
   * @returns Promise<string> - Base64 encoded QR code image
   */
  static async generateEventQR(
    eventUrl: string,
    options: QRCodeOptions = {}
  ): Promise<string> {
    const defaultOptions = {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      ...options,
    };

    try {
      const qrCodeDataURL = await QRCode.toDataURL(eventUrl, {
        width: defaultOptions.width,
        margin: defaultOptions.margin,
        color: defaultOptions.color,
        errorCorrectionLevel: defaultOptions.errorCorrectionLevel,
        type: 'image/png',
      });

      return qrCodeDataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Generate QR code for event registration
   * @param eventUrl - The URL of the event
   * @param eventTitle - The title of the event
   * @returns Promise<string> - Base64 encoded QR code image
   */
  static async generateRegistrationQR(
    eventUrl: string,
    eventTitle: string
  ): Promise<string> {
    const registrationText = `Event: ${eventTitle}\nURL: ${eventUrl}\n\nScan to register or get more info!`;

    return this.generateEventQR(registrationText, {
      width: 300,
      margin: 3,
    });
  }
}
