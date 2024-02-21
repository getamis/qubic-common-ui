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

export type Overrides<TProps> = {
  [componentName: string]: {
    [variantName: string]: TOverrideConfig<TProps>;
  };
};

type MergeBy<T, K> = Omit<T, keyof K> & K;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CustomPalette {}

type PaletteOptions = MergeBy<
  {
    palette: TPalette<string>;
  },
  CustomPalette
>;

export interface Theme {
  name: string;
  palette: PaletteOptions['palette'];
  overrides: Overrides<unknown>;
  extra?: {
    [key: string]: unknown;
  };
}
