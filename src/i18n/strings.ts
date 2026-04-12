import type { Language } from '../store/useAppStore';

// i18n — externalised UI strings (Feature 14)
// Full English strings; Hindi implemented as working translation; other
// languages show placeholder text to demonstrate the pattern per spec.

export type StringKey =
  // Common
  | 'common.skip'
  | 'common.next'
  | 'common.back'
  | 'common.confirm'
  | 'common.cancel'
  | 'common.continue'
  | 'common.getStarted'
  | 'common.loading'
  | 'common.save'
  | 'common.edit'
  | 'common.delete'
  | 'common.search'
  | 'common.viewAll'
  | 'common.retry'
  // Demo
  | 'demo.slide1.title'
  | 'demo.slide1.sub'
  | 'demo.slide2.title'
  | 'demo.slide2.sub'
  | 'demo.slide3.title'
  | 'demo.slide3.sub'
  | 'demo.slide4.title'
  | 'demo.slide4.sub'
  | 'demo.slide5.title'
  | 'demo.slide5.sub'
  // Auth
  | 'auth.welcome'
  | 'auth.subtitle'
  | 'auth.mobileOtp'
  | 'auth.googleSignin'
  | 'auth.mobileNumber'
  | 'auth.sendOtp'
  | 'auth.enterOtp'
  | 'auth.verifyOtp'
  | 'auth.resendIn'
  | 'auth.resendOtp'
  | 'auth.demoRole'
  | 'auth.language'
  | 'auth.signInGoogle'
  // Home
  | 'home.greeting.morning'
  | 'home.greeting.afternoon'
  | 'home.greeting.evening'
  | 'home.startNewSale'
  | 'home.salesToday'
  | 'home.earningsToday'
  | 'home.monthTarget'
  | 'home.recentSales'
  | 'home.myIncentives'
  | 'home.fileClaim'
  | 'home.support'
  // Nav
  | 'nav.home'
  | 'nav.newSale'
  | 'nav.mySales'
  | 'nav.incentives'
  | 'nav.more'
  | 'nav.dashboard'
  | 'nav.transactions'
  | 'nav.campaigns'
  | 'nav.claims'
  | 'nav.invoices'
  | 'nav.askMpos'
  | 'nav.training'
  | 'nav.whatsapp'
  | 'nav.settings'
  | 'nav.dealers'
  | 'nav.agents'
  | 'nav.wallet'
  | 'nav.bulkOnboarding'
  | 'nav.planConfig'
  | 'nav.dealerNetwork';

type Dict = Record<StringKey, string>;

const en: Dict = {
  'common.skip': 'Skip',
  'common.next': 'Next',
  'common.back': 'Back',
  'common.confirm': 'Confirm',
  'common.cancel': 'Cancel',
  'common.continue': 'Continue',
  'common.getStarted': 'Get Started',
  'common.loading': 'Loading',
  'common.save': 'Save',
  'common.edit': 'Edit',
  'common.delete': 'Delete',
  'common.search': 'Search',
  'common.viewAll': 'View all',
  'common.retry': 'Try again',

  'demo.slide1.title': 'Sell in 60 seconds',
  'demo.slide1.sub': 'Scan IMEI, pick a plan, issue policy — under a minute.',
  'demo.slide2.title': 'AI-powered KYC',
  'demo.slide2.sub': 'Onboard dealers and promoters in minutes, not days.',
  'demo.slide3.title': 'Real-time incentive dashboard',
  'demo.slide3.sub': 'Know exactly what you\u2019ve earned, every day.',
  'demo.slide4.title': 'Smart claims',
  'demo.slide4.sub': 'File a claim from the shop floor in 3 steps.',
  'demo.slide5.title': 'Built for Bharat',
  'demo.slide5.sub': 'Works in Hindi, Tamil, Telugu, Kannada and more.',

  'auth.welcome': 'Welcome back',
  'auth.subtitle': 'Sign in to your ACKO MPOS account',
  'auth.mobileOtp': 'Mobile OTP',
  'auth.googleSignin': 'Google Sign-In',
  'auth.mobileNumber': 'Mobile number',
  'auth.sendOtp': 'Send OTP',
  'auth.enterOtp': 'Enter the 6-digit OTP',
  'auth.verifyOtp': 'Verify & continue',
  'auth.resendIn': 'Resend in',
  'auth.resendOtp': 'Resend OTP',
  'auth.demoRole': 'Demo role',
  'auth.language': 'Language',
  'auth.signInGoogle': 'Sign in with Google',

  'home.greeting.morning': 'Good morning',
  'home.greeting.afternoon': 'Good afternoon',
  'home.greeting.evening': 'Good evening',
  'home.startNewSale': 'Start new sale',
  'home.salesToday': 'Sales today',
  'home.earningsToday': 'Earnings today',
  'home.monthTarget': 'Monthly target',
  'home.recentSales': 'Recent sales',
  'home.myIncentives': 'My incentives',
  'home.fileClaim': 'File a claim',
  'home.support': 'Support',

  'nav.home': 'Home',
  'nav.newSale': 'New sale',
  'nav.mySales': 'My sales',
  'nav.incentives': 'Incentives',
  'nav.more': 'More',
  'nav.dashboard': 'Dashboard',
  'nav.transactions': 'Transactions',
  'nav.campaigns': 'Campaigns',
  'nav.claims': 'Claims',
  'nav.invoices': 'Invoices',
  'nav.askMpos': 'Ask MPOS',
  'nav.training': 'Training',
  'nav.whatsapp': 'WhatsApp',
  'nav.settings': 'Settings',
  'nav.dealers': 'Dealers',
  'nav.agents': 'Agents',
  'nav.wallet': 'Wallet',
  'nav.bulkOnboarding': 'Bulk Onboarding',
  'nav.planConfig': 'Plan Config',
  'nav.dealerNetwork': 'Dealer Network',
};

const hi: Partial<Dict> = {
  'common.skip': '\u091B\u094B\u0921\u093C\u0947\u0902',
  'common.next': '\u0906\u0917\u0947',
  'common.back': '\u092A\u0940\u091B\u0947',
  'common.confirm': '\u092A\u0941\u0937\u094D\u091F\u093F',
  'common.cancel': '\u0930\u0926\u094D\u0926',
  'common.continue': '\u091C\u093E\u0930\u0940 \u0930\u0916\u0947\u0902',
  'common.getStarted': '\u0936\u0941\u0930\u0942 \u0915\u0930\u0947\u0902',
  'common.loading': '\u0932\u094B\u0921 \u0939\u094B \u0930\u0939\u093E \u0939\u0948',
  'common.save': '\u0938\u0939\u0947\u091C\u0947\u0902',
  'common.edit': '\u0938\u0902\u092A\u093E\u0926\u093F\u0924 \u0915\u0930\u0947\u0902',
  'common.delete': '\u0939\u091F\u093E\u090F\u0902',
  'common.search': '\u0916\u094B\u091C\u0947\u0902',
  'common.viewAll': '\u0938\u092D\u0940 \u0926\u0947\u0916\u0947\u0902',
  'common.retry': '\u092B\u093F\u0930 \u0938\u0947 \u092A\u094D\u0930\u092F\u093E\u0938 \u0915\u0930\u0947\u0902',

  'demo.slide1.title': '60 \u0938\u0947\u0915\u0902\u0921 \u092E\u0947\u0902 \u092C\u0947\u091A\u0947\u0902',
  'demo.slide1.sub': 'IMEI \u0938\u094D\u0915\u0948\u0928, \u092A\u094D\u0932\u093E\u0928 \u091A\u0941\u0928\u0947\u0902, \u092A\u0949\u0932\u093F\u0938\u0940 \u091C\u093E\u0930\u0940 \u0915\u0930\u0947\u0902\u0964',
  'demo.slide2.title': 'AI-\u0938\u0902\u091A\u093E\u0932\u093F\u0924 KYC',
  'demo.slide2.sub': '\u0921\u0940\u0932\u0930 \u0914\u0930 \u092A\u094D\u0930\u092E\u094B\u091F\u0930 \u0915\u093E \u0924\u0941\u0930\u0902\u0924 \u0911\u0928\u092C\u094B\u0930\u094D\u0921\u093F\u0902\u0917\u0964',
  'demo.slide3.title': '\u0930\u093F\u092F\u0932-\u091F\u093E\u0907\u092E \u0907\u0928\u094D\u0938\u0947\u0902\u091F\u093F\u0935 \u0921\u0948\u0936\u092C\u094B\u0930\u094D\u0921',
  'demo.slide3.sub': '\u0906\u092A\u0928\u0947 \u0915\u093F\u0924\u0928\u093E \u0915\u092E\u093E\u092F\u093E \u0939\u0948, \u0905\u092D\u0940 \u0926\u0947\u0916\u0947\u0902\u0964',
  'demo.slide4.title': '\u0938\u094D\u092E\u093E\u0930\u094D\u091F \u0915\u094D\u0932\u0947\u092E\u094D\u0938',
  'demo.slide4.sub': '\u0926\u0941\u0915\u093E\u0928 \u0938\u0947 3 \u0938\u094D\u091F\u0947\u092A \u092E\u0947\u0902 \u0915\u094D\u0932\u0947\u092E \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902\u0964',
  'demo.slide5.title': '\u092D\u093E\u0930\u0924 \u0915\u0947 \u0932\u093F\u090F \u092C\u0928\u093E \u0939\u0941\u0906',
  'demo.slide5.sub': '\u0939\u093F\u0928\u094D\u0926\u0940, \u0924\u092E\u093F\u0932, \u0924\u0947\u0932\u0941\u0917\u0942 \u092E\u0947\u0902 \u0909\u092A\u0932\u092C\u094D\u0927\u0964',

  'auth.welcome': '\u0938\u094D\u0935\u093E\u0917\u0924 \u0939\u0948',
  'auth.subtitle': '\u0905\u092A\u0928\u0947 ACKO MPOS \u0916\u093E\u0924\u0947 \u092E\u0947\u0902 \u0938\u093E\u0907\u0928 \u0907\u0928 \u0915\u0930\u0947\u0902',
  'auth.mobileOtp': '\u092E\u094B\u092C\u093E\u0907\u0932 OTP',
  'auth.googleSignin': 'Google \u0938\u093E\u0907\u0928-\u0907\u0928',
  'auth.mobileNumber': '\u092E\u094B\u092C\u093E\u0907\u0932 \u0928\u0902\u092C\u0930',
  'auth.sendOtp': 'OTP \u092D\u0947\u091C\u0947\u0902',
  'auth.enterOtp': '6-\u0905\u0902\u0915 OTP \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902',
  'auth.verifyOtp': '\u0938\u0924\u094D\u092F\u093E\u092A\u093F\u0924 \u0915\u0930\u0947\u0902 \u0914\u0930 \u0906\u0917\u0947 \u092C\u0922\u093C\u0947\u0902',
  'auth.resendIn': '\u092A\u0941\u0928\u0903 \u092D\u0947\u091C\u0947\u0902',
  'auth.resendOtp': 'OTP \u092A\u0941\u0928\u0903 \u092D\u0947\u091C\u0947\u0902',
  'auth.demoRole': '\u0921\u0947\u092E\u094B \u092D\u0942\u092E\u093F\u0915\u093E',
  'auth.language': '\u092D\u093E\u0937\u093E',
  'auth.signInGoogle': 'Google \u0915\u0947 \u0938\u093E\u0925 \u0938\u093E\u0907\u0928 \u0907\u0928',

  'home.greeting.morning': '\u0936\u0941\u092D \u092A\u094D\u0930\u092D\u093E\u0924',
  'home.greeting.afternoon': '\u0936\u0941\u092D \u0926\u094B\u092A\u0939\u0930',
  'home.greeting.evening': '\u0936\u0941\u092D \u0938\u0902\u0927\u094D\u092F\u093E',
  'home.startNewSale': '\u0928\u0908 \u092C\u093F\u0915\u094D\u0930\u0940 \u0936\u0941\u0930\u0942 \u0915\u0930\u0947\u0902',
  'home.salesToday': '\u0906\u091C \u0915\u0940 \u092C\u093F\u0915\u094D\u0930\u0940',
  'home.earningsToday': '\u0906\u091C \u0915\u0940 \u0915\u092E\u093E\u0908',
  'home.monthTarget': '\u092E\u093E\u0938\u093F\u0915 \u0932\u0915\u094D\u0937\u094D\u092F',
  'home.recentSales': '\u0939\u093E\u0932\u0940\u092F\u093E \u092C\u093F\u0915\u094D\u0930\u0940',
  'home.myIncentives': '\u092E\u0947\u0930\u0947 \u0907\u0928\u094D\u0938\u0947\u0902\u091F\u093F\u0935',
  'home.fileClaim': '\u0915\u094D\u0932\u0947\u092E \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902',
  'home.support': '\u0938\u0939\u093E\u092F\u0924\u093E',

  'nav.home': '\u0939\u094B\u092E',
  'nav.newSale': '\u0928\u0908 \u092C\u093F\u0915\u094D\u0930\u0940',
  'nav.mySales': '\u092E\u0947\u0930\u0940 \u092C\u093F\u0915\u094D\u0930\u0940',
  'nav.incentives': '\u0907\u0928\u094D\u0938\u0947\u0902\u091F\u093F\u0935',
  'nav.more': '\u0905\u0927\u093F\u0915',
  'nav.dashboard': '\u0921\u0948\u0936\u092C\u094B\u0930\u094D\u0921',
  'nav.transactions': '\u0932\u0947\u0928-\u0926\u0947\u0928',
  'nav.campaigns': '\u0915\u0948\u092E\u094D\u092A\u0947\u0928',
  'nav.claims': '\u0915\u094D\u0932\u0947\u092E\u094D\u0938',
  'nav.invoices': '\u0907\u0928\u0935\u0949\u092F\u093F\u0938',
  'nav.askMpos': 'MPOS \u092A\u0942\u091B\u0947\u0902',
  'nav.training': '\u091F\u094D\u0930\u0947\u0928\u093F\u0902\u0917',
  'nav.whatsapp': 'WhatsApp',
  'nav.settings': '\u0938\u0947\u091F\u093F\u0902\u0917\u094D\u0938',
  'nav.dealers': '\u0921\u0940\u0932\u0930',
  'nav.agents': '\u090F\u091C\u0947\u0902\u091F',
  'nav.wallet': '\u0935\u0949\u0932\u0947\u091F',
};

const dictionaries: Record<Language, Partial<Dict>> = {
  en,
  hi,
  ta: {},
  te: {},
  kn: {},
  mr: {},
};

export function t(key: StringKey, lang: Language = 'en'): string {
  const dict = dictionaries[lang];
  if (dict && key in dict && dict[key]) {
    return dict[key] as string;
  }
  return en[key] ?? key;
}

export const languageLabels: Record<Language, string> = {
  en: 'English',
  hi: 'हिंदी',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  kn: 'ಕನ್ನಡ',
  mr: 'मराठी',
};

// Indian-style currency formatter (₹1,23,456)
export function formatINR(amount: number): string {
  return '\u20B9' + amount.toLocaleString('en-IN');
}
