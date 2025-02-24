import React from "react";

import type { Meta } from "@storybook/react";

import TimeDisplay, { TimeDisplayProps } from "@/components/timer/TimeDisplay";

const meta = {
  title: "Components/TimeDisplay",
  component: TimeDisplay,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    second: { control: { type: "number" } },
    isBlinking: { control: { type: "boolean" } },
  },
  args: { second: 60, isBlinking: false },
} satisfies Meta<typeof TimeDisplay>;

export default meta;

export const Default = (args: TimeDisplayProps) => {
  return (
    <div>
      <TimeDisplay {...args} />
    </div>
  );
};
