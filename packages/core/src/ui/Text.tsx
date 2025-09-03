import React, { useMemo, ReactNode } from 'react';
import { StyleSheet, Text as OriginText, TextProps as OriginTextProps } from 'react-native';
import { useOverride, ComponentVariant } from '@qubic-js/react-native-cask-ui-theme';

const defaultStyles = StyleSheet.create({
  text: {
    flexShrink: 1,
    minWidth: 0,
  },
});

export interface TextProps extends Omit<OriginTextProps, 'style'> {
  /**
   * The variant to use.
   */
  variant?: ComponentVariant<'Text'>;
  /**
   * The text alignment.
   */
  textAlign?: 'left' | 'center' | 'right';
  /**
   * The text to display or nested Text components.
   */
  children: ReactNode;
}

const Text = React.forwardRef<React.ElementRef<typeof OriginText>, TextProps>((props, ref) => {
  const { props: overridedProps, styles } = useOverride('Text', props);
  const { textAlign, children, ...otherProps } = overridedProps;

  // FIX: workaround for multiple lines text on Android
  // https://github.com/facebook/react-native/issues/24837
  // if developer set fontSize without lineHeight.
  // set lineHeight as fontSize + 5 for multiple lines text
  const flattenTextStyles = StyleSheet.flatten(styles.text);
  /* @ts-ignore */
  const { fontSize, lineHeight: customLineHeight } = flattenTextStyles || {};
  const lineHeight = fontSize && !customLineHeight ? fontSize + 5 : customLineHeight;

  const finalTextStyle = useMemo(() => {
    return [defaultStyles.text, styles.text, { lineHeight }, textAlign ? { textAlign } : null];
  }, [styles.text, lineHeight, textAlign]);

  return (
    <OriginText ref={ref} style={finalTextStyle} {...otherProps}>
      {children}
    </OriginText>
  );
});

export default React.memo(Text);
