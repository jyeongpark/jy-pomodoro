import React from "react";

import type { Preview } from "@storybook/react";
import "@/app/globals.css";
import { withThemeByDataAttribute } from "@storybook/addon-themes";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  decorators: [
    withThemeByDataAttribute({
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "light",
      attributeName: 'data-theme',
    }),
    (Story)=><Story/>
  ],
};

export default preview;
