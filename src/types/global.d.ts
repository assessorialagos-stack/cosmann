export {};

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    /** Toques no quiz feitos antes do React assumir a página (ver FilaDeToques no Hero) */
    __filaQuiz?: HTMLElement[];
    __quizPronto?: boolean;
    /** Pixel da Meta (quando instalado) */
    fbq?: (...args: unknown[]) => void;
  }
}
