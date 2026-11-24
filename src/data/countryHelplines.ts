export interface CountryHelpline {
  id: string;
  country: string;
  code: string; // ISO 2-letter
  region: 'North America' | 'Europe' | 'Asia-Pacific' | 'Latin America' | 'Africa & Middle East' | 'Global';
  flag: string;
  primaryNumber: string;
  primaryName: string;
  textOption?: string;
  emergencyNumber: string;
  chatUrl?: string;
  website?: string;
  languages: string[];
  is24x7: boolean;
  freeCall: boolean;
  description: string;
}

export const COUNTRY_HELPLINES: CountryHelpline[] = [
  {
    id: 'us',
    country: 'United States',
    code: 'US',
    region: 'North America',
    flag: '🇺🇸',
    primaryNumber: '988',
    primaryName: '988 Suicide & Crisis Lifeline',
    textOption: 'Text HOME to 741741 (Crisis Text Line)',
    emergencyNumber: '911',
    chatUrl: 'https://988lifeline.org/chat/',
    website: 'https://988lifeline.org',
    languages: ['English', 'Spanish', '240+ via translation'],
    is24x7: true,
    freeCall: true,
    description: 'Free, confidential support for anyone in distress, prevention and crisis resources for you or your loved ones.',
  },
  {
    id: 'ca',
    country: 'Canada',
    code: 'CA',
    region: 'North America',
    flag: '🇨🇦',
    primaryNumber: '988',
    primaryName: '988 Suicide Crisis Helpline',
    textOption: 'Text 988',
    emergencyNumber: '911',
    chatUrl: 'https://988.ca',
    website: 'https://988.ca',
    languages: ['English', 'French'],
    is24x7: true,
    freeCall: true,
    description: 'National 24/7 suicide prevention service available in both English and French across all Canadian provinces.',
  },
  {
    id: 'uk',
    country: 'United Kingdom',
    code: 'GB',
    region: 'Europe',
    flag: '🇬🇧',
    primaryNumber: '111',
    primaryName: 'NHS Mental Health Services (Option 2)',
    textOption: 'Text SHOUT to 85258',
    emergencyNumber: '999',
    chatUrl: 'https://www.giveusashout.org',
    website: 'https://www.samaritans.org',
    languages: ['English', 'Welsh'],
    is24x7: true,
    freeCall: true,
    description: 'Samaritans (call 116 123) and NHS 111 Mental Health Line. Free crisis text line with Shout 85258.',
  },
  {
    id: 'au',
    country: 'Australia',
    code: 'AU',
    region: 'Asia-Pacific',
    flag: '🇦🇺',
    primaryNumber: '13 11 14',
    primaryName: 'Lifeline Australia',
    textOption: 'Text 0477 13 11 14',
    emergencyNumber: '000',
    chatUrl: 'https://www.lifeline.org.au/crisis-chat/',
    website: 'https://www.lifeline.org.au',
    languages: ['English'],
    is24x7: true,
    freeCall: true,
    description: '24-hour crisis support and suicide prevention services. Beyond Blue is also available at 1300 22 4636.',
  },
  {
    id: 'in',
    country: 'India',
    code: 'IN',
    region: 'Asia-Pacific',
    flag: '🇮🇳',
    primaryNumber: '14416',
    primaryName: 'Tele-MANAS (National Mental Health Helpline)',
    textOption: 'KIRAN Helpline: 1800-599-0019',
    emergencyNumber: '112',
    chatUrl: 'https://telemanas.mohfw.gov.in',
    website: 'https://telemanas.mohfw.gov.in',
    languages: ['Hindi', 'English', '20+ Regional Indian Languages'],
    is24x7: true,
    freeCall: true,
    description: 'Government of India comprehensive 24/7 tele-mental health service. Vandrevala Foundation is also available at 9999 666 555.',
  },
  {
    id: 'nz',
    country: 'New Zealand',
    code: 'NZ',
    region: 'Asia-Pacific',
    flag: '🇳🇿',
    primaryNumber: '1737',
    primaryName: '1737 Need to Talk?',
    textOption: 'Free text 1737',
    emergencyNumber: '111',
    chatUrl: 'https://1737.org.nz',
    website: 'https://1737.org.nz',
    languages: ['English', 'Māori'],
    is24x7: true,
    freeCall: true,
    description: 'Free call or text 1737 anytime, 24 hours a day to talk with a trained counsellor.',
  },
  {
    id: 'ie',
    country: 'Ireland',
    code: 'IE',
    region: 'Europe',
    flag: '🇮🇪',
    primaryNumber: '116 123',
    primaryName: 'Samaritans Ireland',
    textOption: 'Text 50808 (Crisis Text Line)',
    emergencyNumber: '112 / 999',
    chatUrl: 'https://text50808.ie',
    website: 'https://www.samaritans.org/ireland/samaritans-ireland/',
    languages: ['English', 'Irish'],
    is24x7: true,
    freeCall: true,
    description: 'Free 24/7 emotional support for anyone experiencing distress or struggling to cope.',
  },
  {
    id: 'de',
    country: 'Germany',
    code: 'DE',
    region: 'Europe',
    flag: '🇩🇪',
    primaryNumber: '0800 111 0 111',
    primaryName: 'TelefonSeelsorge',
    textOption: 'Chat & Mail at telefonseelsorge.de',
    emergencyNumber: '112',
    chatUrl: 'https://online.telefonseelsorge.de',
    website: 'https://www.telefonseelsorge.de',
    languages: ['German', 'English'],
    is24x7: true,
    freeCall: true,
    description: 'Free, confidential counseling available 24/7 by phone, chat, and email throughout Germany.',
  },
  {
    id: 'fr',
    country: 'France',
    code: 'FR',
    region: 'Europe',
    flag: '🇫🇷',
    primaryNumber: '3114',
    primaryName: 'Numéro National de Prévention du Suicide (3114)',
    textOption: 'SOS Amitié: 09 72 39 40 50',
    emergencyNumber: '15 / 112',
    chatUrl: 'https://3114.fr',
    website: 'https://3114.fr',
    languages: ['French'],
    is24x7: true,
    freeCall: true,
    description: 'Free and confidential national 24/7 helpline dedicated to suicide prevention and emotional crisis.',
  },
  {
    id: 'jp',
    country: 'Japan',
    code: 'JP',
    region: 'Asia-Pacific',
    flag: '🇯🇵',
    primaryNumber: '0570-783-556',
    primaryName: 'Inochi no Denwa (Tokyo Lifeline)',
    textOption: 'TELL Lifeline (English): 03-5774-0992',
    emergencyNumber: '119',
    chatUrl: 'https://telljp.com/lifeline/',
    website: 'https://www.inochinodenwa.org',
    languages: ['Japanese', 'English'],
    is24x7: true,
    freeCall: false,
    description: 'TELL provides confidential support in English, while Inochi no Denwa provides nationwide Japanese crisis assistance.',
  },
  {
    id: 'sg',
    country: 'Singapore',
    code: 'SG',
    region: 'Asia-Pacific',
    flag: '🇸🇬',
    primaryNumber: '1767',
    primaryName: 'Samaritans of Singapore (SOS)',
    textOption: 'WhatsApp CareText: 9151 1767',
    emergencyNumber: '995',
    chatUrl: 'https://www.sos.org.sg',
    website: 'https://www.sos.org.sg',
    languages: ['English', 'Mandarin', 'Malay', 'Tamil'],
    is24x7: true,
    freeCall: true,
    description: '24-hour dedicated suicide prevention and crisis intervention hotline in Singapore.',
  },
  {
    id: 'za',
    country: 'South Africa',
    code: 'ZA',
    region: 'Africa & Middle East',
    flag: '🇿🇦',
    primaryNumber: '0800 567 567',
    primaryName: 'SADAG (Suicide Crisis Line)',
    textOption: 'SMS 31393',
    emergencyNumber: '10111',
    chatUrl: 'https://www.sadag.org',
    website: 'https://www.sadag.org',
    languages: ['English', 'isiZulu', 'Afrikaans', 'isiXhosa'],
    is24x7: true,
    freeCall: true,
    description: 'South African Depression and Anxiety Group (SADAG) provides 24-hour crisis services and psychiatric support.',
  },
  {
    id: 'br',
    country: 'Brazil',
    code: 'BR',
    region: 'Latin America',
    flag: '🇧🇷',
    primaryNumber: '188',
    primaryName: 'Centro de Valorização da Vida (CVV)',
    textOption: 'Chat available on cvv.org.br',
    emergencyNumber: '190',
    chatUrl: 'https://www.cvv.org.br/chat/',
    website: 'https://www.cvv.org.br',
    languages: ['Portuguese'],
    is24x7: true,
    freeCall: true,
    description: 'Free, 24/7 emotional support and suicide prevention service for all residents in Brazil.',
  },
  {
    id: 'mx',
    country: 'Mexico',
    code: 'MX',
    region: 'Latin America',
    flag: '🇲🇽',
    primaryNumber: '800 911 2000',
    primaryName: 'Línea de la Vida',
    textOption: 'SAPTEL: 55 5259 8121',
    emergencyNumber: '911',
    chatUrl: 'https://www.gob.mx/salud',
    website: 'https://www.gob.mx/salud',
    languages: ['Spanish'],
    is24x7: true,
    freeCall: true,
    description: 'Free 24/7 national psychological crisis line operated by Mexico Ministry of Health.',
  },
  {
    id: 'global',
    country: 'International / Befrienders Worldwide',
    code: 'GLOBAL',
    region: 'Global',
    flag: '🌐',
    primaryNumber: 'Visit Website',
    primaryName: 'Befrienders Worldwide & IASP Directory',
    textOption: 'Find your local center at befrienders.org',
    emergencyNumber: '112 / Local Police',
    chatUrl: 'https://www.befrienders.org',
    website: 'https://www.befrienders.org',
    languages: ['Multilingual (Worldwide)'],
    is24x7: true,
    freeCall: true,
    description: 'Global directory connecting individuals in emotional distress to over 400 crisis centers across 32 countries.',
  },
];

/**
 * Intelligent helper to detect user's country code based on timezone, locale, or fallback
 */
export function detectUserCountry(): CountryHelpline {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const locale = (navigator.language || '').toUpperCase();

    // Timezone mappings
    if (timeZone.includes('Calcutta') || timeZone.includes('Kolkata') || timeZone.startsWith('Asia/Kolkata') || locale.endsWith('-IN')) {
      return COUNTRY_HELPLINES.find((c) => c.id === 'in') || COUNTRY_HELPLINES[0];
    }
    if (timeZone.startsWith('America/New_York') || timeZone.startsWith('America/Chicago') || timeZone.startsWith('America/Denver') || timeZone.startsWith('America/Los_Angeles') || timeZone.startsWith('America/Phoenix') || locale === 'EN-US') {
      return COUNTRY_HELPLINES.find((c) => c.id === 'us') || COUNTRY_HELPLINES[0];
    }
    if (timeZone.startsWith('America/Toronto') || timeZone.startsWith('America/Vancouver') || timeZone.startsWith('America/Montreal') || timeZone.startsWith('America/Edmonton') || locale.endsWith('-CA')) {
      return COUNTRY_HELPLINES.find((c) => c.id === 'ca') || COUNTRY_HELPLINES[0];
    }
    if (timeZone.startsWith('Europe/London') || locale === 'EN-GB') {
      return COUNTRY_HELPLINES.find((c) => c.id === 'uk') || COUNTRY_HELPLINES[0];
    }
    if (timeZone.startsWith('Australia/') || locale.endsWith('-AU')) {
      return COUNTRY_HELPLINES.find((c) => c.id === 'au') || COUNTRY_HELPLINES[0];
    }
    if (timeZone.startsWith('Pacific/Auckland') || locale.endsWith('-NZ')) {
      return COUNTRY_HELPLINES.find((c) => c.id === 'nz') || COUNTRY_HELPLINES[0];
    }
    if (timeZone.startsWith('Europe/Dublin') || locale.endsWith('-IE')) {
      return COUNTRY_HELPLINES.find((c) => c.id === 'ie') || COUNTRY_HELPLINES[0];
    }
    if (timeZone.startsWith('Europe/Berlin') || locale.endsWith('-DE')) {
      return COUNTRY_HELPLINES.find((c) => c.id === 'de') || COUNTRY_HELPLINES[0];
    }
    if (timeZone.startsWith('Europe/Paris') || locale.endsWith('-FR')) {
      return COUNTRY_HELPLINES.find((c) => c.id === 'fr') || COUNTRY_HELPLINES[0];
    }
    if (timeZone.startsWith('Asia/Tokyo') || locale.endsWith('-JP')) {
      return COUNTRY_HELPLINES.find((c) => c.id === 'jp') || COUNTRY_HELPLINES[0];
    }
    if (timeZone.startsWith('Asia/Singapore') || locale.endsWith('-SG')) {
      return COUNTRY_HELPLINES.find((c) => c.id === 'sg') || COUNTRY_HELPLINES[0];
    }
    if (timeZone.startsWith('Africa/Johannesburg') || locale.endsWith('-ZA')) {
      return COUNTRY_HELPLINES.find((c) => c.id === 'za') || COUNTRY_HELPLINES[0];
    }
    if (timeZone.startsWith('America/Sao_Paulo') || locale.endsWith('-BR')) {
      return COUNTRY_HELPLINES.find((c) => c.id === 'br') || COUNTRY_HELPLINES[0];
    }
    if (timeZone.startsWith('America/Mexico_City') || locale.endsWith('-MX')) {
      return COUNTRY_HELPLINES.find((c) => c.id === 'mx') || COUNTRY_HELPLINES[0];
    }
  } catch (err) {
    console.warn('Location detection fallback:', err);
  }

  // Default to US or Global
  return COUNTRY_HELPLINES[0];
}
