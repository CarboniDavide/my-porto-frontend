interface RecaptchaNoticeProps {
  className?: string;
}

export function RecaptchaNotice({ className }: RecaptchaNoticeProps) {
  return (
    <p className={`text-center text-[10px] leading-relaxed sm:text-[11px] ${className || ''}`}>
      This site is protected by reCAPTCHA and the Google{' '}
      <a 
        href="https://policies.google.com/privacy" 
        target="_blank" 
        rel="noreferrer" 
        className="underline"
      >
        Privacy Policy
      </a>{' '}
      and{' '}
      <a 
        href="https://policies.google.com/terms" 
        target="_blank" 
        rel="noreferrer" 
        className="underline"
      >
        Terms of Service
      </a>{' '}
      apply.
    </p>
  );
}