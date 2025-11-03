
import { cn } from "@/lib/utils"

export const SecureNoteLogo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("lucide lucide-shield-check", className)}
    {...props}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 11.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
    <path d="M12 14v-2.5" />
  </svg>
)

export const Users = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={cn("lucide lucide-users", className)}
        {...props}
    >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
)

export const Columns = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("lucide lucide-columns", className)}
        {...props}
    >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <line x1="12" x2="12" y1="3" y2="21" />
    </svg>
)

export const PanelRightClose = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
     <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("lucide lucide-panel-right-close", className)}
        {...props}
    >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M15 3v18" />
        <path d="m8 9 3 3-3 3" />
    </svg>
)

export const WhatsappLogo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={cn("", className)}
        {...props}
    >
        <path d="M16.6 14c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.7-.8.9-.1.1-.3.1-.5 0-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.2.3-.3.1-.1.2-.2.1-.4-.1-.1-.6-1.5-.8-2.1-.2-.5-.4-.5-.5-.5h-.5c-.2 0-.5.2-.6.4-.2.2-.7.7-.7,1.6s.7,1.9.8,2c.1.1,1.5,2.3,3.6,3.2.5.2.8.3,1.1.4.5.1.9.1,1.2.1.4-.1.1-.6.7-1.2.1-.2.1-.5,0-.6m5.3-7.5c-1.3-1.3-3-2-4.9-2-3.9,0-7,3.1-7,7,0,1.3.3,2.5.9,3.6l-1,3.6,3.7-1c1.1.5,2.3.8,3.5.8,3.9,0,7-3.1,7-7,.1-1.9-.6-3.6-1.9-4.9m-4.9,10.5c-1.1,0-2.2-.3-3.1-.8l-.2-.1-2.3.6.6-2.2-.1-.2c-.6-1-1-2.1-1-3.3,0-3.3,2.7-6,6-6s6,2.7,6,6-2.6,6-5.9,6Z" />
    </svg>
)
    
