import { StyleProp, ViewStyle, TextStyle, ImageStyle } from 'react-native';

export type TColor = string;

export type TStyle = StyleProp<ViewStyle> | StyleProp<TextStyle> | StyleProp<ImageStyle>;

export type TPalette<KeyOfPalette extends string | symbol = string> = Record<KeyOfPalette, TColor>;

export type TOverride<TProps> = {
  props: TProps & {
    [propName: string]: unknown;
  };
  styles: {
    [styleName: string]: TStyle;
  };
};

export type TOverrideConfig<TProps> = {
  props?: TProps & {
    [propName: string]: unknown;
  };
  styles?: {
    [styleName: string]: TStyle;
  };
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ComponentVariants {
  // Default empty, allows users to extend via declare module
}

export type Overrides<TProps = unknown> = {
  [componentName: string]: {
    [variantName: string]: TOverrideConfig<TProps>;
  };
};

export type ComponentVariant<T extends string> = T extends keyof ComponentVariants ? ComponentVariants[T] : string;

export type ExtractVariantKeys<T> = {
  [K in keyof T]: Exclude<keyof T[K], 'default'>;
};

export type ThemeName = 'light' | 'dark';

export interface Theme<P = TPalette> {
  name: ThemeName;
  palette: P;
  overrides: Overrides;
  extra?: {
    [key: string]: unknown;
  };
}
