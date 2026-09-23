import { Settings, ISettings } from '../../database';
import { AppError } from '../../common/middlewares/error.middleware';
import { HTTP_STATUS } from '../../common/constants';

export class SettingsService {
  public static async getSettings(): Promise<any> {
    let settings = await Settings.findOne();

    if (!settings) {
      // Create default settings if none exist
      settings = await this.createDefaultSettings();
    }

    this.ensureDefaults(settings);
    return settings;
  }

  public static async updateSettings(data: any): Promise<ISettings> {
    let settings = await Settings.findOne();

    if (!settings) {
      // Create new settings if none exist
      settings = await this.createDefaultSettings();
    }

    this.ensureDefaults(settings, data);

    // Support flat field mappings from admin dashboard form
    if (data.storeName !== undefined) settings.businessName = data.storeName;
    if (data.businessName !== undefined) settings.businessName = data.businessName;
    if (data.storeDescription !== undefined) settings.businessDescription = data.storeDescription;
    if (data.businessDescription !== undefined) settings.businessDescription = data.businessDescription;

    if (!settings.contactInfo) settings.contactInfo = { email: '' } as any;
    if (typeof data.email === 'string') {
      settings.contactInfo.email = data.email;
    } else if (typeof data.email === 'object' && data.email !== null) {
      if (!settings.email) settings.email = {} as any;
      Object.assign(settings.email, data.email);
    }
    if (data.phone !== undefined) settings.contactInfo.phone = data.phone;
    if (data.contactInfo) Object.assign(settings.contactInfo, data.contactInfo);

    if (data.fromEmail) {
      if (!settings.email) settings.email = {} as any;
      settings.email.fromEmail = data.fromEmail;
    }
    if (data.fromName) {
      if (!settings.email) settings.email = {} as any;
      settings.email.fromName = data.fromName;
    }

    if (data.currency !== undefined) settings.currency = data.currency;
    if (data.currencySymbol !== undefined) settings.currencySymbol = data.currencySymbol;

    if (!settings.tax) settings.tax = { enabled: true, rate: 0, inclusive: false, displayPricesWithTax: false };
    if (data.taxRate !== undefined) {
      settings.tax.rate = Number(data.taxRate);
      settings.tax.enabled = true;
    }
    if (data.tax) {
      Object.assign(settings.tax, data.tax);
    }

    if (!settings.shipping) settings.shipping = { enabled: true, defaultRate: 0, freeShippingThreshold: 0, zones: [] };
    if (data.shippingFee !== undefined) {
      settings.shipping.defaultRate = Number(data.shippingFee);
      settings.shipping.enabled = true;
    }
    if (data.freeShippingThreshold !== undefined) {
      settings.shipping.freeShippingThreshold = Number(data.freeShippingThreshold);
    }
    if (data.shipping) {
      Object.assign(settings.shipping, data.shipping);
    }

    if (!settings.payments) {
      settings.payments = {
        stripe: { enabled: false },
        paypal: { enabled: false, sandbox: true },
        cashOnDelivery: { enabled: true },
      } as any;
    }

    if (data.enableCod !== undefined || data.cashOnDeliveryEnabled !== undefined) {
      const isCodEnabled = data.enableCod !== undefined ? Boolean(data.enableCod) : Boolean(data.cashOnDeliveryEnabled);
      if (!settings.payments.cashOnDelivery) {
        settings.payments.cashOnDelivery = { enabled: isCodEnabled };
      } else {
        settings.payments.cashOnDelivery.enabled = isCodEnabled;
      }
    }

    if (data.payments) {
      if (data.payments.cashOnDelivery) {
        if (!settings.payments.cashOnDelivery) {
          settings.payments.cashOnDelivery = { enabled: true };
        }
        Object.assign(settings.payments.cashOnDelivery, data.payments.cashOnDelivery);
      }
      if (data.payments.stripe) Object.assign(settings.payments.stripe, data.payments.stripe);
      if (data.payments.paypal) Object.assign(settings.payments.paypal, data.payments.paypal);
    }

    // Apply any other top-level fields
    for (const key of Object.keys(data)) {
      if (!['storeName', 'storeDescription', 'email', 'phone', 'taxRate', 'shippingFee', 'freeShippingThreshold', 'tax', 'shipping', 'contactInfo', 'currency', 'currencySymbol', 'enableCod', 'cashOnDeliveryEnabled', 'payments'].includes(key)) {
        (settings as any)[key] = data[key];
      }
    }

    this.ensureDefaults(settings, data);
    await settings.save();
    return settings;
  }

  public static async updateBusinessInfo(data: {
    businessName?: string;
    businessDescription?: string;
    logo?: string;
    favicon?: string;
    contactInfo?: any;
    socialMedia?: any;
  }): Promise<ISettings> {
    const settings = await this.getSettings();

    if (data.businessName) settings.businessName = data.businessName;
    if (data.businessDescription) settings.businessDescription = data.businessDescription;
    if (data.logo) settings.logo = data.logo;
    if (data.favicon) settings.favicon = data.favicon;
    if (data.contactInfo) Object.assign(settings.contactInfo, data.contactInfo);
    if (data.socialMedia) Object.assign(settings.socialMedia, data.socialMedia);

    await settings.save();
    return settings;
  }

  public static async updateCurrency(data: {
    currency?: string;
    currencySymbol?: string;
  }): Promise<ISettings> {
    const settings = await this.getSettings();

    if (data.currency) settings.currency = data.currency;
    if (data.currencySymbol) settings.currencySymbol = data.currencySymbol;

    await settings.save();
    return settings;
  }

  public static async updateTheme(themeData: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    fontFamily?: string;
  }): Promise<ISettings> {
    const settings = await this.getSettings();

    Object.assign(settings.theme, themeData);
    await settings.save();
    return settings;
  }

  public static async updateFeatures(featuresData: {
    enableReviews?: boolean;
    enableWishlist?: boolean;
    enableCompareProducts?: boolean;
    enableGuestCheckout?: boolean;
    enableCoupons?: boolean;
    enableInventoryTracking?: boolean;
    enableMultipleAddresses?: boolean;
    enableNewsletterSignup?: boolean;
  }): Promise<ISettings> {
    const settings = await this.getSettings();

    Object.assign(settings.features, featuresData);
    await settings.save();
    return settings;
  }

  public static async updateTaxSettings(taxData: {
    enabled?: boolean;
    rate?: number;
    inclusive?: boolean;
    displayPricesWithTax?: boolean;
  }): Promise<ISettings> {
    const settings = await this.getSettings();

    Object.assign(settings.tax, taxData);
    await settings.save();
    return settings;
  }

  public static async updateShippingSettings(shippingData: {
    enabled?: boolean;
    freeShippingThreshold?: number;
    defaultRate?: number;
    zones?: any[];
  }): Promise<ISettings> {
    const settings = await this.getSettings();

    Object.assign(settings.shipping, shippingData);
    await settings.save();
    return settings;
  }

  public static async updatePaymentSettings(paymentData: {
    stripe?: any;
    paypal?: any;
    cashOnDelivery?: any;
  }): Promise<ISettings> {
    const settings = await this.getSettings();

    if (paymentData.stripe) Object.assign(settings.payments.stripe, paymentData.stripe);
    if (paymentData.paypal) Object.assign(settings.payments.paypal, paymentData.paypal);
    if (paymentData.cashOnDelivery) Object.assign(settings.payments.cashOnDelivery, paymentData.cashOnDelivery);

    await settings.save();
    return settings;
  }

  public static async updateEmailSettings(emailData: {
    smtp?: any;
    fromEmail?: string;
    fromName?: string;
    templates?: any;
  }): Promise<ISettings> {
    const settings = await this.getSettings();
    this.ensureDefaults(settings);

    if (emailData.smtp) Object.assign(settings.email.smtp, emailData.smtp);
    if (emailData.fromEmail) settings.email.fromEmail = emailData.fromEmail;
    if (emailData.fromName) settings.email.fromName = emailData.fromName;
    if (emailData.templates) Object.assign(settings.email.templates, emailData.templates);

    await settings.save();
    return settings;
  }

  public static async updateSeoSettings(seoData: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  }): Promise<ISettings> {
    const settings = await this.getSettings();
    this.ensureDefaults(settings);

    Object.assign(settings.seo, seoData);
    await settings.save();
    return settings;
  }

  public static async updateLegalSettings(legalData: {
    termsOfService?: string;
    privacyPolicy?: string;
    returnPolicy?: string;
    shippingPolicy?: string;
  }): Promise<ISettings> {
    const settings = await this.getSettings();
    this.ensureDefaults(settings);

    Object.assign(settings.legal, legalData);
    await settings.save();
    return settings;
  }

  public static async updateMaintenanceMode(maintenanceData: {
    enabled?: boolean;
    message?: string;
    allowedIPs?: string[];
  }): Promise<ISettings> {
    const settings = await this.getSettings();
    this.ensureDefaults(settings);

    Object.assign(settings.maintenance, maintenanceData);
    await settings.save();
    return settings;
  }

  public static ensureDefaults(settings: any, data?: any): void {
    if (!settings.contactInfo) {
      settings.contactInfo = { email: '' };
    }
    if (!settings.contactInfo.email && data?.email && typeof data.email === 'string') {
      settings.contactInfo.email = data.email;
    }

    if (!settings.email) {
      settings.email = {};
    }

    if (!settings.email.smtp) {
      settings.email.smtp = {
        host: '',
        port: 587,
        secure: false,
        username: '',
        password: '',
      };
    }

    if (!settings.email.templates) {
      settings.email.templates = {
        orderConfirmation: true,
        orderShipped: true,
        orderDelivered: true,
        passwordReset: true,
        welcomeEmail: true,
      };
    }

    if (!settings.email.fromEmail) {
      settings.email.fromEmail =
        data?.fromEmail ||
        (typeof data?.email === 'string' ? data.email : '') ||
        settings.contactInfo?.email ||
        'support@kangpack.in';
    }

    if (!settings.email.fromName) {
      settings.email.fromName =
        data?.fromName ||
        data?.storeName ||
        data?.businessName ||
        settings.businessName ||
        'Kangpack';
    }
  }

  private static async createDefaultSettings(): Promise<any> {
    const defaultSettings = new Settings({
      businessName: 'Kangpack',
      currency: 'INR',
      currencySymbol: '₹',
      timezone: 'Asia/Kolkata',
      language: 'en',
      contactInfo: {
        email: 'support@kangpack.in',
        phone: '+911234567891',
      },
      email: {
        fromEmail: 'support@kangpack.in',
        fromName: 'Kangpack',
      },
    });

    await defaultSettings.save();
    return defaultSettings;
  }
}