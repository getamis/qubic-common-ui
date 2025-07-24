import React, { ReactNode, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { useOverride, useTheme } from '@qubic-js/react-native-cask-ui-theme';
import { $Diff } from 'utility-types';

import type { TouchableOpacityProps, ViewStyle, TextStyle, ImageStyle } from 'react-native';

const DEFAULT_VARIANT = 'default';
const DEFAULT_SIZE = 'medium';
const OUTLINE_BORDER_WIDTH = 2;
const SMALL_BUTTON_PADDING_VERTICAL = 8;
const SMALL_BUTTON_PADDING_HORIZONTAL = 12;
const MEDIUM_BUTTON_PADDING_VERTICAL = 12;
const MEDIUM_BUTTON_PADDING_HORIZONTAL = 16;

export type TButtonPalette = Record<string, string>;

export type TButtonVariant = 'default' | 'outline' | 'plainText' | 'rounded';

export type TButtonSize = 'small' | 'medium';

export interface TButtonSxProp {
  root?: ViewStyle;
  button?: ViewStyle;
  disabled?: ViewStyle;
  icon?: ImageStyle;
  iconDisabled?: ImageStyle;
  text?: TextStyle;
  textDisabled?: TextStyle;
}

const variantOfSize = (variant: TButtonVariant) => ({
  small: {
    iconButton: {
      width: 24,
      height: 24,
    },
    button: {
      minHeight: 32,
      paddingVertical:
        variant === 'outline' ? SMALL_BUTTON_PADDING_VERTICAL - OUTLINE_BORDER_WIDTH : SMALL_BUTTON_PADDING_VERTICAL,
      paddingHorizontal:
        variant === 'outline'
          ? SMALL_BUTTON_PADDING_HORIZONTAL - OUTLINE_BORDER_WIDTH
          : SMALL_BUTTON_PADDING_HORIZONTAL,
    },
    text: {
      fontSize: 14,
      lineHeight: 16,
    },
  },
  medium: {
    iconButton: {
      width: 32,
      height: 32,
    },
    button: {
      paddingVertical:
        variant === 'outline' ? MEDIUM_BUTTON_PADDING_VERTICAL - OUTLINE_BORDER_WIDTH : MEDIUM_BUTTON_PADDING_VERTICAL,
      paddingHorizontal:
        variant === 'outline'
          ? MEDIUM_BUTTON_PADDING_HORIZONTAL - OUTLINE_BORDER_WIDTH
          : MEDIUM_BUTTON_PADDING_HORIZONTAL,
    },
    text: {
      fontSize: 16,
      lineHeight: 24,
    },
  },
});

const variantOfStyles = (palette: TButtonPalette) => ({
  default: {
    button: {
      backgroundColor: palette.primaryColor,
      borderRadius: 8,
    },
    text: {
      color: palette.whiteColor,
    },
  },
  outline: {
    button: {
      backgroundColor: palette.whiteColor,
      borderColor: palette.lightGrayColor,
      borderRadius: 8,
      borderWidth: OUTLINE_BORDER_WIDTH,
    },
    text: {
      color: palette.darkColor,
    },
  },
  rounded: {
    button: {
      backgroundColor: palette.primaryColor,
      borderRadius: 24,
    },
    text: {
      color: palette.whiteColor,
    },
  },
  plainText: {
    button: {},
    text: {
      color: palette.darkColor,
    },
  },
});

const defaultStyles = StyleSheet.create({
  root: {
    flexDirection: 'column',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  icon: {},
  iconDisabled: {},
  text: {
    fontWeight: '500',
  },
  textDisabled: {},
});

export interface ButtonProps extends $Diff<TouchableOpacityProps, { style?: unknown; children?: unknown }> {
  /**
   * The variant to use.
   */
  variant?: TButtonVariant;
  /**
   * The icon beside the button title. Usually be placed on the left side.
   */
  icon?: ReactNode;
  /**
   * The text content of the button.
   */
  title?: string;
  /**
   * If `true`, the button is disabled.
   */
  disabled?: boolean;
  /**
   * The size of the button.
   */
  size?: TButtonSize;
  /**
   * Override the style of the root element.
   */
  sx?: TButtonSxProp;
}

const Button: React.FC<ButtonProps> = React.memo<ButtonProps>(props => {
  const { variant = DEFAULT_VARIANT, size = DEFAULT_SIZE, icon, title, disabled, sx, ...otherProps } = props;
  const { styles: globalOverrideStyle } = useOverride<ButtonProps>('Button', { variant });
  const { palette } = useTheme();

  const variantWithPalette: TButtonSxProp = useMemo(() => variantOfStyles(palette)?.[variant], [palette]);

  const styleVariant = useMemo(() => StyleSheet.create(variantWithPalette), [variant, palette]);
  const sizeVariant = useMemo(() => StyleSheet.create(variantOfSize(variant)?.[size]), [size]);
  const isIconOnly = useMemo(() => !title && !!icon, [title, icon]);

  const elementRootStyle = StyleSheet.flatten([
    defaultStyles.root,
    styleVariant.root,
    globalOverrideStyle.root,
    sx?.root || {},
  ]);

  const elementButtonDisabledStyle = StyleSheet.flatten([
    defaultStyles.buttonDisabled,
    styleVariant.disabled,
    globalOverrideStyle.disable,
    sx?.disabled,
  ]);

  const elementButtonStyle = StyleSheet.flatten([
    defaultStyles.button,
    styleVariant.button,
    isIconOnly ? sizeVariant.iconButton : sizeVariant.button,
    globalOverrideStyle.button,
    sx?.button,
    disabled ? elementButtonDisabledStyle : null,
  ]);

  const elementIconDisabledStyle = StyleSheet.flatten([
    defaultStyles.iconDisabled,
    styleVariant.iconDisabled,
    globalOverrideStyle.iconDisabled,
    sx?.iconDisabled,
  ]);

  const elementIconStyle = StyleSheet.flatten([
    defaultStyles.icon,
    styleVariant.icon,
    globalOverrideStyle.icon,
    sx?.icon,
    disabled ? elementIconDisabledStyle : null,
  ]);

  const elementTextDisabledStyle = StyleSheet.flatten([defaultStyles.textDisabled, styleVariant.textDisabled]);

  const elementTextStyle = StyleSheet.flatten([
    defaultStyles.text,
    styleVariant.text,
    sizeVariant.text,
    globalOverrideStyle.text,
    sx?.text,
    disabled ? elementTextDisabledStyle : null,
  ]);

  return (
    <View style={elementRootStyle}>
      <TouchableOpacity disabled={disabled} {...otherProps}>
        <View
          style={[
            {
              // library rn doesn't support gap, it will be eliminated by stylesheet.create
              gap: 8,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any,
            elementButtonStyle,
          ]}
        >
          {icon && <View style={elementIconStyle}>{icon}</View>}
          {!!title && <Text style={elementTextStyle}>{title}</Text>}
        </View>
      </TouchableOpacity>
    </View>
  );
});

export default Button;
