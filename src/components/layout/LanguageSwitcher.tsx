/**
 * Only English is implemented. Hindi is shown but disabled (and announced as unavailable)
 * until translated content exists, instead of pretending to switch language.
 */
export function LanguageSwitcher() {
  return (
    <div className="flex items-center gap-2 text-sm" role="group" aria-label="Language">
      <span aria-current="true" className="font-semibold text-white">EN</span>
      <span aria-hidden className="text-white/30">|</span>
      <span
        lang="hi"
        aria-disabled="true"
        title="Hindi version coming soon"
        className="cursor-not-allowed text-white/50"
      >
        हिंदी<span className="sr-only"> (coming soon)</span>
      </span>
    </div>
  );
}
