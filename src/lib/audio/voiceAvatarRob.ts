/**
 * ROB - Autonomous AI Fire Inspector Voice & Speech Engine
 * Multilingual & Multi-Accent Synthesis with Chromium Audio Fixes:
 *  - Prevents V8 garbage collection bug
 *  - Handles onvoiceschanged asynchronous loading
 *  - Unpauses frozen speechSynthesis queue with resume()
 *  - Web Audio API Tactical Comms Chime for guaranteed audible feedback
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

// Tactical Audio Sound Chime Generator via Web Audio API
export function playTacticalCommsChime(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    
    // Tone 1: High alert beep (880 Hz - A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.09);

    // Tone 2: Tactical radio chirp (1320 Hz - E6)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1320, now + 0.09);
    gain2.gain.setValueAtTime(0.18, now + 0.09);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.09);
    osc2.stop(now + 0.23);
  } catch (err) {
    console.warn('Tactical audio chime not supported:', err);
  }
}

// Global active utterance reference to protect from Chromium V8 garbage collection
declare global {
  interface Window {
    __pyroguard_active_utterance?: SpeechSynthesisUtterance | null;
  }
}

export class RobSpeechController {
  private static cachedVoices: SpeechSynthesisVoice[] = [];
  private static isSpeaking = false;

  private static initVoices(): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    this.cachedVoices = window.speechSynthesis.getVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.cachedVoices = window.speechSynthesis.getVoices();
      };
    }
  }

  public static speak(
    text: string, 
    accent: RobAccent, 
    onStart?: () => void, 
    onEnd?: () => void
  ): boolean {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return false;
    }

    try {
      // 1. Play tactical radio chirp immediately
      playTacticalCommsChime();

      const synth = window.speechSynthesis;

      // 2. Clear any frozen/stuck speech queue and resume synth
      synth.cancel();
      if (synth.paused) {
        synth.resume();
      }

      // 3. Populate voices if needed
      if (this.cachedVoices.length === 0) {
        this.cachedVoices = synth.getVoices();
      }

      // 4. Create Utterance with high priority
      const utterance = new SpeechSynthesisUtterance(text);
      window.__pyroguard_active_utterance = utterance; // Prevent garbage collection!

      // Find best available voice
      let chosenVoice: SpeechSynthesisVoice | undefined;
      const voices = this.cachedVoices.length > 0 ? this.cachedVoices : synth.getVoices();

      if (accent === 'NZ_ENGLISH') {
        chosenVoice = voices.find(v => v.lang.toLowerCase().includes('en-nz') || v.name.toLowerCase().includes('new zealand') || v.lang.toLowerCase().includes('en-au'));
        utterance.lang = 'en-NZ';
      } else if (accent === 'ZA_ENGLISH') {
        chosenVoice = voices.find(v => v.lang.toLowerCase().includes('en-za') || v.name.toLowerCase().includes('south africa') || v.lang.toLowerCase().includes('en-gb'));
        utterance.lang = 'en-ZA';
      } else if (accent === 'AFRIKAANS') {
        chosenVoice = voices.find(v => v.lang.toLowerCase().includes('af') || v.lang.toLowerCase().includes('nl'));
        utterance.lang = 'af-ZA';
      } else if (accent === 'ISIZULU' || accent === 'ISIXHOSA') {
        chosenVoice = voices.find(v => v.lang.toLowerCase().includes('zu') || v.lang.toLowerCase().includes('xh') || v.lang.toLowerCase().includes('en-za'));
        utterance.lang = 'en-ZA';
      }

      // If specific regional voice is not locally installed on device, fall back to any high quality English voice
      if (!chosenVoice) {
        chosenVoice = voices.find(v => (v.name.includes('David') || v.name.includes('George') || v.name.includes('Male') || v.name.includes('Guy') || v.lang.startsWith('en')) && !v.name.includes('Zira'));
        if (!chosenVoice && voices.length > 0) {
          chosenVoice = voices[0];
        }
      }

      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }

      // Voice settings: Deep masculine pitch, clear volume, brisk tempo
      utterance.pitch = 0.9;
      utterance.rate = 1.0;
      utterance.volume = 1.0; // 100% volume

      utterance.onstart = () => {
        this.isSpeaking = true;
        onStart?.();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        window.__pyroguard_active_utterance = null;
        onEnd?.();
      };

      utterance.onerror = (e) => {
        console.warn('Rob voice synthesizer event:', e);
        this.isSpeaking = false;
        window.__pyroguard_active_utterance = null;
        onEnd?.();
      };

      // 5. Chromium bug workaround: execute speak after short timeout to let cancel() settle
      setTimeout(() => {
        synth.resume();
        synth.speak(utterance);
      }, 50);

      return true;
    } catch (err) {
      console.error('Speech synthesis error:', err);
      this.isSpeaking = false;
      onEnd?.();
      return false;
    }
  }

  public static stop(): void {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      window.__pyroguard_active_utterance = null;
    }
  }

  public static getSpeakingStatus(): boolean {
    return this.isSpeaking;
  }
}
