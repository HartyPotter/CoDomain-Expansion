// import { extendTheme } from "@chakra-ui/react";

// const theme = extendTheme({
//   config: {
//     initialColorMode: "dark",
//     useSystemColorMode: false,
//   },
// });
// export default theme;

import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    50: "#e3f2fd",
    100: "#bbdefb",
    200: "#90caf9",
    300: "#64b5f6",
    400: "#42a5f5",
    500: "#2196f3",
    600: "#1e88e5",
    700: "#1976d2",
    800: "#1565c0",
    900: "#0d47a1",
  },
  background: {
    primary: "#1a202c",
    secondary: "#2d3748",
  },
};

const fonts = {
  body: "Inter, system-ui, sans-serif",
  heading: "Inter, system-ui, sans-serif",
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const styles = {
  global: (props) => ({
    body: {
      bg: "background.primary",
      color: "whiteAlpha.900",
    },
  }),
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: "bold",
      borderRadius: "md",
    },
    variants: {
      solid: (props) => ({
        bg: `${props.colorScheme}.500`,
        color: "white",
        _hover: {
          bg: `${props.colorScheme}.600`,
        },
      }),
      outline: (props) => ({
        borderColor: `${props.colorScheme}.500`,
        color: `${props.colorScheme}.500`,
        _hover: {
          bg: `${props.colorScheme}.50`,
        },
      }),
    },
  },
  Input: {
    variants: {
      filled: {
        field: {
          bg: "background.secondary",
          _hover: {
            bg: "background.secondary",
          },
          _focus: {
            bg: "background.secondary",
          },
        },
      },
    },
    defaultProps: {
      variant: "filled",
    },
  },
};

const theme = extendTheme({
  colors,
  fonts,
  config,
  styles,
  components,
});

export default theme;