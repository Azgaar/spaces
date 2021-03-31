import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  spinner: {
    width: "8em",
    height: "8em",
    margin: "30% auto",
    "& div": {
      width: "33%",
      height: "33%",
      backgroundColor: theme.palette.primary.main,
      float: "left",
      animation: "$cubic 1.5s infinite ease-out"
    },
    "& :nth-child(1)": {animationDelay: ".2s"},
    "& :nth-child(2)": {animationDelay: ".3s"},
    "& :nth-child(3)": {animationDelay: ".4s"},
    "& :nth-child(4)": {animationDelay: ".1s"},
    "& :nth-child(5)": {animationDelay: ".2s"},
    "& :nth-child(6)": {animationDelay: ".3s"},
    "& :nth-child(7)": {animationDelay: ".0s"},
    "& :nth-child(8)": {animationDelay: ".1s"},
    "& :nth-child(9)": {animationDelay: ".2s"}
  },
  "@keyframes cubic": {
    "0%, 70%, 100%": {
      opacity: 0.7,
      transform: "scale3D(1, 1, 1)"
    },
    "35%": {
      opacity: 1,
      transform: "scale3D(0, 0, 1)"
    }
  }
}));

export default useStyles;
