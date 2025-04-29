import { Platform } from 'react-native';
import Superwall, { SubscriptionStatus } from '@superwall/react-native-superwall';
import { createSuperwallConfig } from '@/config/superwall';
import Constants from 'expo-constants';

class SuperwallService {
  private static instance: SuperwallService;
  private initialized = false;

  private constructor() {}

  static getInstance(): SuperwallService {
    if (!SuperwallService.instance) {
      SuperwallService.instance = new SuperwallService();
    }
    return SuperwallService.instance;
  }

  initialize() {
    if (this.initialized) return;

    const iosKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPERWALL_API_KEY_IOS;
    const androidKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPERWALL_API_KEY_ANDROID;

    const apiKey = Platform.select({
      ios: iosKey,
      android: androidKey,
      default: undefined,
    });

    if (!apiKey || apiKey.includes('YOUR_')) {
      console.warn(
        '[Superwall] No valid API key found for platform:', 
        Platform.OS, 
        '- Please add it to app.json extra field'
      );
      return;
    }

    try {
      const options = createSuperwallConfig();
      Superwall.configure(apiKey, options);
      this.initialized = true;
      console.log('[Superwall] Initialized successfully');
    } catch (error) {
      console.error('[Superwall] Initialization failed:', error);
    }
  }

  async presentPaywall(triggerId: string): Promise<void> {
    if (!this.initialized) {
      console.warn('[Superwall] Not initialized, cannot present paywall.');
      return;
    }
    try {
      console.log('[Superwall] Presenting paywall for trigger:', triggerId);
      await Superwall.shared.register(triggerId);
    } catch (error) {
      console.error('[Superwall] Failed to present paywall:', error);
      throw error;
    }
  }

  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    if (!this.initialized) {
      console.warn('[Superwall] Not initialized, cannot get status.');
      return SubscriptionStatus.UNKNOWN;
    }
    try {
      const status = await Superwall.shared.getSubscriptionStatus();
      console.log('[Superwall] Subscription status:', status);
      return status;
    } catch (error) {
      console.error('[Superwall] Failed to get subscription status:', error);
      return SubscriptionStatus.UNKNOWN;
    }
  }
}

export const superwallService = SuperwallService.getInstance(); 