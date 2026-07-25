import { type IconProps } from '~/assets'

export function WeChatIcon(props: IconProps = {}) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.5 4.5C6.186 4.5 3.5 6.91 3.5 9.88c0 1.72.95 3.25 2.42 4.26l-.48 2.02a.4.4 0 0 0 .58.45l2.2-1.22c.56.14 1.15.22 1.78.22.24 0 .47-.01.7-.04A4.9 4.9 0 0 1 10.2 14.3c0-2.86 2.66-5.18 5.95-5.18.12 0 .24 0 .36.01C15.9 6.55 13.05 4.5 9.5 4.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M16.15 9.85c-2.86 0-5.18 2.05-5.18 4.58 0 2.53 2.32 4.58 5.18 4.58.5 0 .98-.06 1.43-.17l1.72.95a.32.32 0 0 0 .46-.36l-.37-1.57c1.15-.8 1.9-2.01 1.9-3.43 0-2.53-2.32-4.58-5.14-4.58Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <circle cx="7.75" cy="9.6" r="0.85" fill="currentColor" />
      <circle cx="11.25" cy="9.6" r="0.85" fill="currentColor" />
      <circle cx="14.65" cy="14.35" r="0.75" fill="currentColor" />
      <circle cx="17.65" cy="14.35" r="0.75" fill="currentColor" />
    </svg>
  )
}
