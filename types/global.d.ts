export {};

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

// Allow CSS imports in TypeScript
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}