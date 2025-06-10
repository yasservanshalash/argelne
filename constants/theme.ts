// file: constants/theme.ts

const COLORS = {
    primary: "#C08552", // A rich, warm brown/gold
    secondary: "#5E3023", // A deep, dark coffee brown
    tertiary: "#DAB49D", // A light, sandy beige
  
    gray: "#83829A",
    gray2: "#C1C0C8",
  
    offwhite: "#F3F4F8",
    white: "#FFFFFF",
    black: "#000000",
    red: "#e81e4d",
    green: "#00C135",
    lightWhite: "#FAFAFC",
  };
  
  const FONT = {
    regular: "DMRegular", // We will add these fonts later
    medium: "DMMedium",
    bold: "DMBold",
  };
  
  const SIZES = {
    xSmall: 10,
    small: 12,
    medium: 16,
    large: 20,
    xLarge: 24,
    xxLarge: 32,
  };
  
  const SHADOWS = {
    small: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 2,
    },
    medium: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 5.84,
      elevation: 5,
    },
  };
  
  export { COLORS, FONT, SHADOWS, SIZES };
