export {};

declare global {
  interface Document {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    monetization: any;
  }
}
