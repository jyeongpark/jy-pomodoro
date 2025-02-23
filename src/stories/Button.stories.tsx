import React from "react";

import type { Meta } from "@storybook/react";
import { fn } from "@storybook/test";

import Button, { ButtonProps } from "@/components/common/Button";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    variant: { options: ["fill", "outline"], control: { type: "select" } },
    size: {
      options: ["small", "medium", "large"],
      control: { type: "radio" },
    },
    disabled: { control: "boolean" },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { variant: "fill", size: "medium", onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const Default = (args: ButtonProps) => {
  // const { variant, size, ...rest } = args;
  return (
    <div>
      <Button {...args}>Button</Button>
    </div>
  );
};

export const Small = () => {
  return (
    <div>
      <Button variant="outline" size="small">
        outline small
      </Button>
    </div>
  );
};

export const Large = () => {
  return (
    <div>
      <Button variant="fill" size="large">
        FILL LARGE
      </Button>
    </div>
  );
};
