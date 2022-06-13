import { colors, createTheme } from '@material-ui/core';

export default createTheme({
  palette: {
    primary: {
      light: '#df78ef',
      main: colors.deepPurple[400],
    },
    secondary: {
      light: '#6ff9ff',
      main: '#26c6da',
    },
    error: {
      main: colors.red[400],
    },
    type: 'dark',
  },
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: '1em',
      },
    },
  },
  props: {
    MuiPaper: {
      elevation: 4,
    },
  },
});
