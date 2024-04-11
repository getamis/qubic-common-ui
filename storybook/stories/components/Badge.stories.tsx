import React from 'react';
import { Badge, BadgeProps } from '@qubic-js/react-native-cask-ui-core';
import { Story, Meta } from '@storybook/react';

export default {
  title: 'Components/Legacy/Badge',
  component: Badge,
  argTypes: {
    variant: {},
    color: { control: 'color' },
  },
  args: {
    children: 'COOL',
  },
} as Meta;

const Template: Story<BadgeProps> = args => <Badge {...args} />;

export const Basic = Template.bind({});
Basic.storyName = 'Basic';
Basic.args = {};

export const Slim = Template.bind({});
Slim.storyName = 'Variant - Slim';
Slim.args = {
  variant: 'slim',
};
