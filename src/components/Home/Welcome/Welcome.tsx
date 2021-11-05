import * as React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import "./Welcome.css";
// import CssBaseline from "@mui/material/CssBaseline";
// import Container from "@mui/material/Container";
// import Box from "@mui/material/Box";
import {
  Box,
  Grid,
  Paper,
  Container,
  Typography,
  CssBaseline,
  Divider,
  Button,
} from "@mui/material";
import { ArrowDownward } from "@mui/icons-material";
import wave from "./assets/wavesNegative.svg";
import band from "./assets/band.png";
import gigEdit from "./assets/gigEdit.png";
import gigPage from "./assets/gigPage.png";
import gigsMapped from "./assets/gigsMapped.png";
import invitation from "./assets/invitation.png";
import profile from "./assets/profile.png";
import board from "./assets/board.png";
import { UserCtx } from "../../Context/MainContext";
import { Transition } from "react-transition-group";
import { Zoom, Fade } from "react-reveal";
import { AppState } from "../../../App";
import Logo from "../../assets/Logo";

const duration = 300;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
};

const transitionStyles: any = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
};

interface WelcomeProps {}

class Welcome extends React.Component {
  static contextType = UserCtx;
  constructor(props: WelcomeProps, context: AppState) {
    super(props, context);
    this.state = {};
  }

  render() {
    return (
      <>
        <Container maxWidth="lg" sx={{ minHeight: "90vh" }}>
          <Zoom delay={200}>
            <Grid container>
              <Grid
                item
                xs={12}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <div style={{ height: 120 }} />{" "}
                {/* <div style={{height: 10}}> */}
                  <Logo  height={160} />
                <Grid item xs={10}>
                  <Zoom duration={300} delay={1500}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      textAlign="justify"
                      sx={{ pt: 2, maxWidth: 280 }}
                    >
                      <i>We want to book your bands for you!</i>
                    </Typography>
                  </Zoom>
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                display="flex"
                flexDirection="column"
                alignItems="center"
                id="welcome-photo"
              >
                <img
                  src={band}
                  alt="sihloutte of a band"
                  style={{
                    maxHeight: 350,
                    filter: `invert(97%) sepia(4%) saturate(394%) hue-rotate(178deg) brightness(110%) contrast(68%)`,
                  }}
                />
              </Grid>
              {/* <Divider sx={{width: '100%', p: 3}} /> */}
            </Grid>
          </Zoom>
          <div style={{ height: 40, width: "100%" }} />
          <Zoom duration={300} delay={1500}>
            <Grid item xs={12} display="flex" justifyContent="center">
              <HashLink smooth to={`#text-anchor`}>
                <ArrowDownward id={"hash-link"} />
              </HashLink>
            </Grid>
          </Zoom>
        </Container>
        <div id="text-anchor" style={{ height: 90, width: "100%" }} />
        <Container maxWidth={"lg"}>
          <Paper>
            <Grid container p={2}>
              <Grid
                item
                xs={12}
                md={5}
                textAlign="justify"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                // border={1}
                // sx={{ borderColor: "divider" }}
              >
                <Fade left duration={500}>
                  <Typography variant="overline">Mission</Typography>
                </Fade>
                <Fade left duration={500}>
                  <Typography sx={{ textIndent: 22 }}>
                    {`Are you sick of keeping track of countless
                  email, text, and messaging-app threads? Do you
                  need a central location to keep track of all of
                  your jobs? Do you want a place to connect with
                  other freelance musicians? You have come to the
                  right place!
                  `}
                  </Typography>
                </Fade>
                <Fade left duration={500}>
                  <Typography sx={{ textIndent: 22 }}>
                    {`Our aim is to be the
                  #1 software solution for independant
                  musicians and bandleaders. We know the
                  stresses of freelancing, and want to fill
                  in at least one of the gaps. `}
                  </Typography>
                </Fade>
              </Grid>
              <Grid
                item
                xs={12}
                md={7}
                display="flex"
                justifyContent="center"
                sx={{ pt: 2 }}
              >
                <Fade right duration={500}>
                  <img
                    src={gigPage}
                    alt="View of an example gig page"
                    style={{ maxWidth: "85%", borderRadius: 9 }}
                  />
                </Fade>
              </Grid>
              <Divider sx={{ height: 1, my: 5, width: "100%" }} />

              <Grid
                container
                item
                xs={12}
                display="flex"
                flexWrap="wrap-reverse"
                sx={{ pt: 2 }}
              >
                <Grid
                  item
                  xs={12}
                  md={7}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid display="flex" flexWrap="wrap" justifyContent="center">
                    <Fade left duration={500}>
                      <img
                        src={invitation}
                        alt="View of the main app dashboard"
                        style={{ height: 400, borderRadius: 9, padding: 5 }}
                      />
                    </Fade>
                    <Fade left duration={500}>
                      <img
                        src={gigsMapped}
                        alt="View of the main app dashboard"
                        style={{ height: 400, borderRadius: 9, padding: 5 }}
                      />
                    </Fade>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={5} textAlign="justify">
                  <Fade right duration={500}>
                    <Typography variant="overline">Core features</Typography>
                  </Fade>
                  <Fade right duration={500}>
                    <Typography sx={{ textIndent: 22 }}>
                      {`Using FirstCall's platform, musicians can free
                    themselves of the stresses that come along with
                    booking an ensemble. Give us the what/when/where/how
                    much and we will take care of 'who'. All you need to
                    do is provide a list of instruments and email addresses.
                    We will contact your calls in the order you list them.
                    Your first call can't make the gig? We will immediately
                    send the request to the next person on your list.
                    `}
                    </Typography>
                  </Fade>
                  <Fade right duration={500}>
                    <Typography sx={{ textIndent: 22 }}>
                      {`Lead a big band, or ad-hoc orchestra? Don't waste your
                    time chasing down a third trombone or bassoonist, let us
                    do it for you! We will even remember the email addresses
                    you give us to save you time the next time you create a gig.
                    Best of all, our platform is deliberatly usable. The folks
                    you invite to play don't even have to have a FirstCall account
                    to accept or decline! We will send a link to the email address
                    you provide and they will be given a simple choice of 'Accept'
                    or 'Decline'. They will probably want to sign up though once
                    they hear how easy it is to use!
                     `}
                    </Typography>
                  </Fade>
                </Grid>
              </Grid>
              <Divider sx={{ height: 1, my: 5, width: "100%" }} />

              <Grid
                item
                xs={12}
                md={5}
                textAlign="justify"
                display="flex"
                flexDirection="column"
                justifyContent="center"
              >
                <Fade left duration={500}>
                  <Typography variant="overline">Bonus features</Typography>
                </Fade>
                <Fade left duration={500}>
                  <Typography sx={{ textIndent: 22 }}>
                    In addition to the core features, FirstCall also serves as a
                    communication hub. Every gig has its own private messaging
                    board. Band members can use this to communicate any
                    necessary planning. Post something, and hopefully after a
                    while someone will have{" "}
                    <strong>
                      <i>Read</i>
                      -it!
                    </strong>
                  </Typography>
                </Fade>
                <Fade left duration={500}>
                  <Typography sx={{ textIndent: 22 }}>
                    You also are given a profile page where you can share gig
                    photos with short captions. Think{" "}
                    <strong>
                      <i>Gig</i>-stagram
                    </strong>
                    ! Your profile also displays your preferred payment
                    information (Venmo, Cash App, etc).
                  </Typography>
                </Fade>
              </Grid>
              <Grid
                item
                xs={12}
                md={7}
                display="flex"
                justifyContent="center"
                sx={{ pt: 2 }}
              >
                <Fade right duration={500}>
                  <img
                    src={board}
                    alt="View of an example gig messageboard"
                    style={{ maxWidth: "90%", borderRadius: 9 }}
                  />
                </Fade>
              </Grid>
              <Grid
                item
                xs={12}
                display="flex"
                justifyContent="center"
                sx={{ pt: 2 }}
              >
                <Fade bottom duration={500}>
                  <img
                    src={profile}
                    alt="View of an example profile page"
                    style={{ maxWidth: "90%", borderRadius: 9 }}
                  />
                </Fade>
              </Grid>
            </Grid>
          <div style={{ height: 80, width: "100%" }} />
          {!this.context?.auth && (
            <Fade bottom duration={800}>
              <Grid container display="flex" justifyContent="center">
                <Link to="/auth/signup">
                  <Button variant="contained" color="success" sx={{ p: 3 }}>
                    <Typography variant="h3">Sign up today!</Typography>
                  </Button>
                </Link>
              </Grid>
            </Fade>
          )}
          <div style={{ height: 80, width: "100%" }} />

          </Paper>
        </Container>
        <div style={{ height: 40, width: "100%" }} />

        {/* <div style={{backgroundImage: `url(${wave})`, height: 111, backgroundColor: 'white'}} /> */}
      </>
    );
  }
}

export default Welcome;
