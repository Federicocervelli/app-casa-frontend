// themed.d.ts
import '@rneui/themed';

declare module '@rneui/themed' {
  export interface Colors {
    bgPrimary: string;
    bgSecondary: string;
    onBgPrimary: string;
    onBgSecondary: string;
    accent: string;
    btnColor: string;
    errorColor: string;
    infoColor: string;
    inactiveColor: string;
  }
}