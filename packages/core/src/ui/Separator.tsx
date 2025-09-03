import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useOverride, useMemoStyles, ComponentVariant } from '@qubic-js/react-native-cask-ui-theme';

const defaultStyles = StyleSheet.create({
  root: {
    backgroundColor: '#ddd',
    height: StyleSheet.hairlineWidth,
  },
});

export type SeparatorProps = {
  variant?: ComponentVariant<'Separator'>;
};

export default React.memo<SeparatorProps>(props => {
  const { props: overridedProps, styles } = useOverride('Separator', props);
  const { children } = overridedProps;

  const finalStyle = useMemoStyles([defaultStyles.root, styles.root]);

  return <View style={finalStyle}>{children}</View>;
});
