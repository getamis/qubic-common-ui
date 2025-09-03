import { ComponentType } from 'react';
import { TColor, ComponentVariant } from '@qubic-js/react-native-cask-ui-theme';

type BaseProps = {
  variant?: ComponentVariant<'LoadingSpinner'>;
  color?: TColor;
  size?: number | 'small' | 'large';
};

export type LoadingSpinnerRendererProps = {
  hidden: boolean;
  text?: string;
} & BaseProps;

export type LoadingSpinnerProps = {
  Renderer?: ComponentType<LoadingSpinnerRendererProps>;
} & BaseProps;
