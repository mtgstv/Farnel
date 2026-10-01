import icon from "../../assets/icon.svg";

export function SiteLogo({ className = "h-9 w-9", iconClassName = "h-[55%] w-[55%]" }) {
  return (
    <span className={`${className} inline-flex items-center justify-center`}>
      <img src={icon} alt="" className={`${iconClassName} object-contain`} />
    </span>
  );
}

export function HandshakeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M3.5 12.5 8 8l3 2.6 2-1.8 3.5 3.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 13.2 6 16.5c.8.8 2 .8 2.7 0l.4-.4M21.5 13.2 18 16.5c-.8.8-2 .8-2.7 0l-2.6-2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BasketIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M4.5 10h15l-1.6 8.3a2 2 0 0 1-2 1.7H8.1a2 2 0 0 1-2-1.7L4.5 10Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M8 10 9.5 4M16 10 14.5 4M3 10h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function ShieldIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 3.5 5 6v5.5c0 4.6 3 7.9 7 9 4-1.1 7-4.4 7-9V6l-7-2.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ReceiptIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M6 3.5h12v17l-2.2-1.4L13.6 20l-1.6-1.4L10.4 20l-2.2-1.4L6 20.5v-17Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M9 8h6M9 11.5h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function TruckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M3 6.5h10v9H3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M13 10h4l3 3v2.5h-7V10Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="7" cy="17" r="1.6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16.5" cy="17" r="1.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function PinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.3" r="2.4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function QuoteMark(props) {
  return (
    <svg viewBox="0 0 32 24" fill="none" {...props}>
      <path
        d="M13.3 0C6.1 2.6 1 9 1 15.7 1 20.6 4.4 24 8.7 24c3.8 0 6.8-3 6.8-6.8 0-3.6-2.6-6.4-6-6.7C10.4 6.6 13 3.4 17.3 1.6L13.3 0Z"
        fill="currentColor"
      />
      <path
        d="M28.6 0c-7.2 2.6-12.3 9-12.3 15.7 0 4.9 3.4 8.3 7.7 8.3 3.8 0 6.8-3 6.8-6.8 0-3.6-2.6-6.4-6-6.7 1.9-3.9 4.5-7.1 8.8-8.9L28.6 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ArrowIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CameraOffIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M9.5 5h5l1.5 2h3A1.5 1.5 0 0 1 20.5 8.5v8.4M17.6 19H5A1.5 1.5 0 0 1 3.5 17.5v-9A1.5 1.5 0 0 1 5 7h2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10.2 10.2a3 3 0 0 0 4.2 4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function CheckBadge(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <circle cx="10" cy="10" r="9" fill="currentColor" />
      <path d="M6 10.3l2.4 2.4L14 7.2" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}

export function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M14.5 8.5h2V5.3h-2.3c-2.3 0-3.7 1.5-3.7 3.9v2H8.5v3h2v6.8h3v-6.8h2.3l.4-3h-2.7v-1.5c0-.8.3-1.2 1-1.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 10.5v6M8 7.8v.1M12 16.5v-3.6c0-1.2.8-2 2-2s1.8.8 1.8 2v3.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

// ---------- Ícones do formulário de doação ----------

export function CameraIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M9.5 5h5l1.5 2h3A1.5 1.5 0 0 1 20.5 8.5v9a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 5 7h3l1.5-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12.5" r="3.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function CalendarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function SunIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ThermometerIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M10 4.5a2 2 0 1 1 4 0v9.3a4 4 0 1 1-4 0V4.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M12 10v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function SnowflakeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 2.5v19M3.8 7.25l16.4 9.5M3.8 16.75l16.4-9.5M9.5 4l2.5 2.2L14.5 4M9.5 20l2.5-2.2 2.5 2.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function UserIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="8" r="3.8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.5 20c.9-3.7 3.9-6 7.5-6s6.6 2.3 7.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function AlertIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.5v5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16.3" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
