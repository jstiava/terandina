// lib/gtag.js
export const GA_MEASUREMENT_ID = 'G-7PCSMLGRPM'; // replace with your ID

declare global {
    interface Window {
        gtag: (...args: any[]) => void;
    }
}

// Log a pageview
export const pageview = (url : string) => {
    window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
    });
};

// Log specific events
export const event = ({ action, category, label, value } : any) => {
    window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value,
    });
};
