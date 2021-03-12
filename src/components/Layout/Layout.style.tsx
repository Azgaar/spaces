import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  app: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  background: {
    zIndex: -999,
    position: "fixed",
    backgroundImage: `url(${process.env.PUBLIC_URL}/background.jpg)`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    width: "100vw",
    height: "100vh",
    opacity: .8,
  },
}));

export default useStyles;
