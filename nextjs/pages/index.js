import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    display: "flex"
    // justifyContent: "space-between"
  },
  role: {
    textTransform: "uppercase"
  },
  navigator: {
    color: theme.palette.primary.contrastText,
    borderRadius: 0,
    margin: "0.5rem"
  },
  lightPrimary: {
    color: theme.palette.primary.contrastText,
    textTransform: "uppercase",
    fontSize: "5vw"
  },
  lightSecondary: {
    color: theme.palette.secondary.light
  },
  bodyContainer: {
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}));

export default function ButtonAppBar() {
  const classes = useStyles();
  const name = "DULAM BRENDON";
  const role = "Web Developer & Engineer";

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Container className={classes.container}>
            <div style={{ flexGrow: 1 }}>
              <Typography variant="h4" color="secondary">
                <strong>{name}</strong>
              </Typography>
              <Typography variant="subtitle1" className={classes.role}>
                {role}
              </Typography>
            </div>
            <Hidden smDown style={{ flexGrow: 1 }}>
              {["home", "about me", "side projects", "contact"].map(label => (
                <Button key={`bt-${label}`} className={classes.navigator}>
                  {label}
                </Button>
              ))}
            </Hidden>
          </Container>
        </Toolbar>
      </AppBar>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={8}>
            <img
              style={{ width: "100%" }}
              src="https://images.unsplash.com/photo-1517055729445-fa7d27394b48?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80"
              alt="Engineering Image"
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <Typography className={classes.lightPrimary}>making</Typography>
            <Typography className={classes.lightPrimary}>ideas</Typography>
            <Typography className={classes.lightPrimary}>happen</Typography>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
