import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Colors } from '@/constants/Colors'; // Assuming dark mode is default/only mode

// Placeholder content - Export for use in modals
export const PLACEHOLDER_PRIVACY = `
Privacy Policy for Vzn

Last Updated: [Date - 05/01/25]

Welcome to Vzn! We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application (the "App"). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the App.

We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Last Updated" date of this Privacy Policy. You are encouraged to periodically review this Privacy Policy to stay informed of updates.

1. COLLECTION OF YOUR INFORMATION

We may collect information about you in a variety of ways. The information we may collect via the App includes:

*   Personal Data: Personally identifiable information, such as your email address, that you voluntarily give to us when you register with the App.
*   Usage Data: Information automatically collected when you use the App, such as:
    *   Focus session details (e.g., selected duration, start/end times, mode used - Easy/Hard).
    *   Gamification data (e.g., XP earned, current level, current streak, longest streak, timestamp of last qualifying session).
    *   Settings preferences (e.g., state of notifications, sounds, vibrations toggles - stored locally on your device via AsyncStorage).
    *   Interaction data with specific features or prompts.
*   Derivative Data: Information our servers automatically collect when you access the App, handled primarily by our backend provider (Supabase), which may include your IP address, device name and type, operating system, access times, and usage patterns necessary for providing the service.
*   Third-Party Data: We utilize third-party services that may collect information:
    *   Supabase: Our backend provider handles authentication, database storage, and edge functions. Their handling of data is governed by their own privacy policy.
    *   Superwall: If you interact with paywall features, Superwall processes information related to those interactions, governed by their privacy policy.
    *   Expo: The framework used to build the app may collect anonymized technical data, governed by their privacy policy.

2. USE OF YOUR INFORMATION

Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the App to:

*   Create and manage your account.
*   Authenticate your access to the App.
*   Track your focus session progress and calculate XP, levels, and streaks.
*   Operate and maintain the core functionality of the focus timer.
*   Present subscription options or manage access via Superwall (if applicable).
*   Monitor and analyze usage and trends to improve your experience with the App.
*   Troubleshoot problems and respond to your support requests.
*   Notify you of updates to the App (if notification permissions are granted and enabled).
*   Compile anonymous statistical data and analysis for internal use or with third parties.
*   Protect the security and integrity of the App.

3. DISCLOSURE OF YOUR INFORMATION

We do not sell your personal information. We may share information we have collected about you in certain situations:

*   By Law or to Protect Rights: If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
*   Third-Party Service Providers: We may share your information with third parties that perform services for us or on our behalf, including data storage (Supabase), authentication (Supabase), paywall management (Superwall), and potentially analytics or customer service. These providers have access to your information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
*   Aggregated/Anonymized Data: We may share aggregated or anonymized information that does not directly identify you.

4. TRACKING TECHNOLOGIES

We use AsyncStorage on your device to store your local settings preferences (Notifications, Sounds, Vibrations). We do not use cookies or web beacons within the mobile app itself, but our third-party service providers (like Supabase or Superwall) might use tracking technologies as described in their own policies.

5. DATA STORAGE AND SECURITY

Your account information, usage data, and gamification data are stored on servers provided by Supabase. We (and Supabase) use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.

6. YOUR RIGHTS AND CHOICES

*   Account Information: You may at any time review or change the information in your account or terminate your account by contacting us using the contact information provided below. Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, some information may be retained in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our Terms of Service, and/or comply with legal requirements.
*   Emails and Communications: If you no longer wish to receive correspondence, emails, or other communications from us, you may opt-out by contacting us using the contact information provided below.
*   Settings: You can control sound and vibration settings directly within the App's settings menu. Notification preferences may depend on your device's system settings and permissions granted to the App.

7. CHILDREN'S PRIVACY

Our App is not intended for children under the age of 13 [Adjust age based on target audience and legal requirements, e.g., 16 in some jurisdictions]. We do not knowingly collect personally identifiable information from children under 13 [Adjust age]. If we become aware that we have collected personal information from a child under the relevant age without verification of parental consent, we will take steps to remove that information from our servers.

8. CHANGES TO THIS PRIVACY POLICY

We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last Updated" date and the updated version will be effective as soon as it is accessible. We encourage you to review this privacy policy frequently to be informed of how we are protecting your information.

9. CONTACT US

If you have questions or comments about this Privacy Policy, please contact us at:

hi@vzn.one
`;

export const PLACEHOLDER_TERMS = `
Terms of Service for Vzn

Last Updated: [Date - 05/01/25]

Welcome to Vzn! These Terms of Service ("Terms") govern your use of the Vzn mobile application (the "App") provided by Kenneth Irby (Vzn). Please read these Terms carefully before using the App.

By downloading, accessing, or using the App, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the App.

1. Use of the App

*   License: We grant you a limited, non-exclusive, non-transferable, revocable license to use the App for your personal, non-commercial purposes on devices that you own or control, subject to these Terms.
*   Account: You need to register for an account (using email) to use the App's features, including tracking focus sessions, XP, levels, and streaks. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
*   Intended Use: Vzn is designed as a tool to help users build focus habits through timed sessions and gamification mechanics. You agree to use the App only for its intended purposes.

2. User Conduct

You agree not to use the App to:

*   Violate any applicable laws or regulations.
*   Attempt to manipulate the focus timer, XP, levels, or streak systems through unauthorized means.
*   Interfere with or disrupt the integrity or performance of the App or the data contained therein.
*   Attempt to gain unauthorized access to the App or its related systems or networks.
*   Use the App for any commercial purpose without our express written consent.

3. Intellectual Property

The App and its original content (excluding content provided by users, if any), features, and functionality are and will remain the exclusive property of [Kenneth Irby / Vzn] and its licensors. The App is protected by copyright, trademark, and other laws of [Your Jurisdiction] and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.

4. Third-Party Services

The App utilizes third-party services, including but not limited to Supabase (backend and authentication) and Superwall (paywall features, if applicable). Your use of these third-party services is subject to their respective terms and privacy policies. We are not responsible for the practices of these third-party services.

5. Disclaimers

THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE APP WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR THAT DEFECTS WILL BE CORRECTED. YOUR USE OF THE APP IS SOLELY AT YOUR OWN RISK. WE MAKE NO GUARANTEES REGARDING THE EFFECTIVENESS OF THE APP IN IMPROVING FOCUS OR PRODUCTIVITY, AS RESULTS DEPEND ON INDIVIDUAL USE AND EFFORT.

6. Limitation of Liability

TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL [Kenneth Irby / Vzn], NOR ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES, BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (I) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE APP; (II) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE APP; (III) ANY CONTENT OBTAINED FROM THE APP; AND (IV) UNAUTHORIZED ACCESS, USE OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE) OR ANY OTHER LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE, AND EVEN IF A REMEDY SET FORTH HEREIN IS FOUND TO HAVE FAILED OF ITS ESSENTIAL PURPOSE.

7. Termination

We may terminate or suspend your account and bar access to the App immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.

If you wish to terminate your account, you may simply discontinue using the App or contact us using the information below.

All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.

8. Governing Law

These Terms shall be governed and construed in accordance with the laws of [Your State/Country, e.g., California, USA], without regard to its conflict of law provisions.

9. Changes to Terms

We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide notice prior to any new terms taking effect, likely by updating the "Last Updated" date. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our App after any revisions become effective, you agree to be bound by the revised terms.

10. Contact Us

If you have any questions about these Terms, please contact us at:

hi@vzn.one
`;

export default function ComplianceScreen() {
  const params = useLocalSearchParams();
  console.log('[ComplianceScreen] Received params:', params);

  // Determine which content to display based on the title parameter
  // const screenName = params.screen as string; 
  const screenTitle = params.title as string;

  let content = '';
  // Check based on title parameter
  if (screenTitle === 'Privacy Policy') {
      console.log('[ComplianceScreen] Matched Privacy Policy title, assigning content.');
      content = PLACEHOLDER_PRIVACY;
  } else if (screenTitle === 'Terms of Service') {
      console.log('[ComplianceScreen] Matched Terms of Service title, assigning content.');
      content = PLACEHOLDER_TERMS;
  } else {
      console.log(`[ComplianceScreen] Title "${screenTitle}" did not match expected values.`);
  }

  console.log('[ComplianceScreen] Content length before render:', content.length);

  return (
    <ThemedView style={styles.container}>
      {/* Stack.Screen options in _layout will set the title */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText style={{ color: Colors.dark.text }}>
          {content || 'Loading content...'}
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background, // Explicitly dark background
  },
  scrollContent: {
    padding: 20,
  },
}); 