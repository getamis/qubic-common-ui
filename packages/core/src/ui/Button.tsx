import React, { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, TouchableOpacityProps } from 'react-native';
import { useOverride, useMemoStyles, ComponentVariant } from '@qubic-js/react-native-cask-ui-theme';

const defaultStyles = StyleSheet.create({
  root: {
    flexDirection: 'row',
  },
  button: {
    flexDirection: 'row',
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  icon: {},
  iconDisabled: {},
  text: {
    fontSize: 16,
    lineHeight: 21,
  },
  textDisabled: {},
});

export interface LegacyButtonProps extends Omit<TouchableOpacityProps, 'style' | 'children'> {
  /**
   * The variant to use.
   */
  variant?: ComponentVariant<'Button'>;
  /**
   * The icon beside the button title. Usually be placed on the left side.
   */
  icon?: ReactNode;
  /**
   * The text content of the button.
   */
  title?: string;
  /**
   * If `true`, the buton is disabled.
   */
  disabled?: boolean;
}

const Button: React.FC<LegacyButtonProps> = React.memo<LegacyButtonProps>(props => {
  const { props: overridedProps, styles } = useOverride<LegacyButtonProps>('Button', props);
  const { icon, title, disabled, ...otherProps } = overridedProps;

  const finalStyle = useMemoStyles([defaultStyles.root, styles.root]);
  const finalButtonDisabledStyle = useMemoStyles([defaultStyles.buttonDisabled, styles.disabled]);
  const finalButtonStyle = useMemoStyles([
    defaultStyles.button,
    styles.button,
    disabled ? finalButtonDisabledStyle : null,
  ]);
  const finalIconDisabledStyle = useMemoStyles([defaultStyles.iconDisabled, styles.iconDisabled]);
  const finalIconStyle = useMemoStyles([defaultStyles.icon, styles.icon, disabled ? finalIconDisabledStyle : null]);
  const finalTextDisabledStyle = useMemoStyles([defaultStyles.textDisabled, styles.textDisabled]);
  const finalTextStyle = useMemoStyles([defaultStyles.text, styles.text, disabled ? finalTextDisabledStyle : null]);

  // render
  return (
    <View style={finalStyle}>
      <TouchableOpacity disabled={disabled} {...otherProps}>
        <View style={finalButtonStyle}>
          {icon && <View style={finalIconStyle}>{icon}</View>}
          {icon && title && <View style={{ width: 4 }} />}
          {title && <Text style={finalTextStyle}>{title}</Text>}
        </View>
      </TouchableOpacity>
    </View>
  );
});

export default Button;
