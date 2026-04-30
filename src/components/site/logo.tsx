import type { SVGProps } from "react"

export function LosLocalesLogo({
  withWordmark = true,
  className,
  ...props
}: SVGProps<SVGSVGElement> & { withWordmark?: boolean }) {
  return (
    <svg
      viewBox={withWordmark ? "0 0 260 72" : "0 0 72 72"}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="ll-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0038A8" />
          <stop offset="100%" stopColor="#1E5FD6" />
        </linearGradient>
        <linearGradient id="ll-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2E8B57" />
          <stop offset="100%" stopColor="#0F5A39" />
        </linearGradient>
        <linearGradient id="ll-sand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5E6C8" />
          <stop offset="100%" stopColor="#D4A017" />
        </linearGradient>
      </defs>

      <g transform="translate(4 4)">
        <path
          d="M32 0 L60 6 V32 C60 48 48 60 32 64 C16 60 4 48 4 32 V6 Z"
          fill="url(#ll-sky)"
          stroke="#D4A017"
          strokeWidth="2"
        />
        <path d="M6 22 H58 V28 H6 Z" fill="#FFFFFF" opacity="0.95" />
        <path d="M6 28 H58 V38 H6 Z" fill="#CE1126" />
        <path d="M6 38 H58 V44 H6 Z" fill="#FFFFFF" opacity="0.95" />
        <circle cx="32" cy="15" r="6" fill="#D4A017" />
        <circle cx="32" cy="15" r="3.2" fill="#F5E6C8" />
        <g transform="translate(20 44)">
          <rect x="6.6" y="0" width="1.6" height="12" fill="#3D2A18" rx="0.5" />
          <path d="M7.4 1 C3 -1 -1 1 -2 4 C1 3 4.5 2.5 7.4 4 Z" fill="url(#ll-sea)" />
          <path d="M7.4 1 C11.8 -1 15.8 1 16.8 4 C13.8 3 10.3 2.5 7.4 4 Z" fill="url(#ll-sea)" />
          <path d="M7.4 0.4 C6.2 -3.5 3.4 -5.2 0.6 -4.8 C2 -2.4 4.2 -0.8 7.4 0.8 Z" fill="url(#ll-sea)" />
          <path d="M7.4 0.4 C8.6 -3.5 11.4 -5.2 14.2 -4.8 C12.8 -2.4 10.6 -0.8 7.4 0.8 Z" fill="url(#ll-sea)" />
        </g>
        <path
          d="M6 52 Q16 48 26 52 T46 52 T62 52 V58 H6 Z"
          fill="url(#ll-sand)"
          opacity="0.9"
        />
      </g>

      {withWordmark && (
        <g transform="translate(82 22)">
          <text
            x="0"
            y="16"
            fontFamily="ui-sans-serif, system-ui, -apple-system"
            fontSize="20"
            fontWeight="800"
            letterSpacing="-0.5"
            fill="currentColor"
          >
            Los Locales
          </text>
          <text
            x="0"
            y="34"
            fontFamily="ui-sans-serif, system-ui, -apple-system"
            fontSize="9"
            fontWeight="600"
            letterSpacing="3"
            fill="currentColor"
            opacity="0.6"
          >
            NOSARA · COSTA RICA
          </text>
        </g>
      )}
    </svg>
  )
}
