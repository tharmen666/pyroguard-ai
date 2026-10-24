/**
 * ROB - Autonomous AI Fire Inspector Voice & Speech Engine
 * Multilingual & Multi-Accent Synthesis:
 *  - South African English (Warm, confident, masculine)
 *  - New Zealand English (Kiwi colloquial, FENZ certified style)
 *  - isiZulu (Sawubona, safety inspector tone)
 *  - isiXhosa (Molo, statutory compliance tone)
 *  - Afrikaans (Goeiedag, technical inspection tone)
 */

export type RobAccent = 'ZA_ENGLISH' | 'NZ_ENGLISH' | 'ISIZULU' | 'ISIXHOSA' | 'AFRIKAANS';

export interface VoiceLinePreset {
  id: string;
  category: 'welcome' | 'spatial_pass' | 'spatial_shortfall' | 'condemned_alert' | 'sign_off';
  text: Record<RobAccent, string>;
}

export const ROB_VOICE_SCRIPTS: VoiceLinePreset[] = [
  {
    id: 'welcome',
    category: 'welcome',
    text: {
      ZA_ENGLISH: "Howzit! Rob here, your autonomous fire compliance copilot. Let's inspect this facility under SANS 10400-T and SANS 1475. Ready when you are, Ron!",
      NZ_ENGLISH: "Kia ora mate! Rob here. Ready to run your NZS 4503 equipment audit and FENZ brigade checks. Let's make sure she's sweet as!",
      ISIZULU: "Sawubona mhlobo wam! Ngingu-Rob. Asihlole ukuphepha komlilo ngokomthetho we-SANS 1475. Asiqale umsebenzi!",
      ISIXHOSA: "Molo mhlobo wam! Ndingu-Rob, umncedisi wakho wokukhangela imililo phantsi kwe-SANS 10400-T. Masingene emsebenzini!",
      AFRIKAANS: "Goeiedag vriende! Rob hier. Kom ons kyk na die brandveiligheid en maak seker alles is honderd persent volgens SANS 10400-T.",
    },
  },
  {
    id: 'spatial_pass',
    category: 'spatial_pass',
    text: {
      ZA_ENGLISH: "Lekker work! Spatial coverage meets SANS 10400-T specifications. All travel envelopes and hose reel radiuses are clear.",
      NZ_ENGLISH: "Spot on mate! Spatial coverage is fully compliant with NZS 4503. The building warrant of fitness parameters are all green.",
      ISIZULU: "Kuhle kakhulu! Isikhala sonke sivikelekile ngokomthetho we-SANS 10400-T. Akukho kusilela.",
      ISIXHOSA: "Kuhle kakhulu! Yonke indawo ikhuselwe ngokupheleleyo phantsi kwe-SANS. Akukho ntsilelo.",
      AFRIKAANS: "Uitstekend! Die ruimtelike dekking voldoen volkome aan SANS 10400-T. Geen tekorte gevind nie.",
    },
  },
  {
    id: 'spatial_shortfall',
    category: 'spatial_shortfall',
    text: {
      ZA_ENGLISH: "Attention! Spatial shortfall detected under SANS 10400-T. Additional cylinders and hose reel coverage required to maintain insurance validity.",
      NZ_ENGLISH: "Heads up! We've got an equipment shortfall under NZS 4503. You'll need more units to satisfy FENZ travel limits.",
      ISIZULU: "Qaphela! Kusilela izicishamlilo ngokomthetho we-SANS 10400-T. Kufuneka zengezwe ngokushesha ukuvikela umshuwalense.",
      ISIXHOSA: "Lumka! Kukho intswelo yezixhobo zokucima umlilo phantsi komthetho. Kufuneka kongezwe izicishamlilo.",
      AFRIKAANS: "Aandag asseblief! Daar is 'n ruimtelike tekort volgens SANS 10400-T. Bykomende brandblussers moet geïnstalleer word.",
    },
  },
  {
    id: 'condemned_alert',
    category: 'condemned_alert',
    text: {
      ZA_ENGLISH: "Statutory condemnation alert! This cylinder shows severe structural defect or age breach. Condemned under SANS 1475 Clause 6. Added to replacement quote.",
      NZ_ENGLISH: "Condemned cylinder alert! NZS 4503 safety threshold breached. Unit cannot be recertified and must be replaced immediately.",
      ISIZULU: "Isixwayiso! Lesi sicishamlilo silimele kakhulu ngokwe-SANS 1475. Kumele silahlwe bese kufakwa esisha.",
      ISIXHOSA: "Isilumkiso esikhulu! Lo mqulu unomonakalo omkhulu ngokomthetho we-SANS 1475. Kufuneka utshatyalaliswe kwaye kufakwe omtsha.",
      AFRIKAANS: "Kritieke waarskuwing! Hierdie silinder is gekondemneer kragtens SANS 1475 Klousule 6. Dit moet onmiddellik vervang word.",
    },
  },
  {
    id: 'sign_off',
    category: 'sign_off',
    text: {
      ZA_ENGLISH: "Audit complete. Cryptographic SHA-256 seal embedded. Dossier is insurer-defensible and signed off for Ron's SAQCC review.",
      NZ_ENGLISH: "Audit finalized sweet as! Tamper-evident cryptographic seal stamped. Ready for BWoF and FENZ records.",
      ISIZULU: "Ukuhlolwa kuphothuliwe. Isitembu se-SHA-256 sifakiwe. Ifayela lilungele ukusayinwa.",
      ISIXHOSA: "Uhlolo lugqityiwe. Ityala livalwe nge-SHA-256. Ifayile ilungile kwi-inshurensi.",
      AFRIKAANS: "Oudit voltooi. Kriptografiese SHA-256 seël is aangebring. Die verslag is gereed vir finale ondertekening.",
    },
  },
];

export class RobSpeechController {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static isSpeaking = false;

  public static speak(text: string, accent: RobAccent, onStart?: () => void, onEnd?: () => void): boolean {
    if (!this.synth || typeof window === 'undefined') {
      return false;
    }

    try {
      this.synth.cancel(); // Stop any pending utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Determine voice match
      const voices = this.synth.getVoices();
      let targetVoice: SpeechSynthesisVoice | undefined;

      if (accent === 'NZ_ENGLISH') {
        targetVoice = voices.find(v => v.lang.includes('en-NZ') || v.name.includes('New Zealand') || v.lang.includes('en-AU'));
      } else if (accent === 'ZA_ENGLISH') {
        targetVoice = voices.find(v => v.lang.includes('en-ZA') || v.name.includes('South Africa') || v.lang.includes('en-GB'));
      } else if (accent === 'AFRIKAANS') {
        targetVoice = voices.find(v => v.lang.includes('af') || v.lang.includes('nl'));
      } else if (accent === 'ISIZULU' || accent === 'ISIXHOSA') {
        targetVoice = voices.find(v => v.lang.includes('zu') || v.lang.includes('xh') || v.lang.includes('en-ZA'));
      }

      if (targetVoice) {
        utterance.voice = targetVoice;
      }

      // Configure masculine, steady pitch and energetic rate
      utterance.pitch = 0.92; // Slightly deeper, masculine tone
      utterance.rate = 1.02; // Natural, engaging tempo

      utterance.onstart = () => {
        this.isSpeaking = true;
        onStart?.();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        onEnd?.();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        onEnd?.();
      };

      this.synth.speak(utterance);
      return true;
    } catch {
      this.isSpeaking = false;
      onEnd?.();
      return false;
    }
  }

  public static stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  public static getSpeakingStatus(): boolean {
    return this.isSpeaking;
  }
}
