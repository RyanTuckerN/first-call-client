import * as React from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import "./Welcome.css";
import {
  Grid,
  Paper,
  Container,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import { ArrowDownward } from "@mui/icons-material";
import band from "./assets/band.png";
import gigPage from "./assets/gigPage.png";
import gigsMapped from "./assets/gigsMapped.png";
import invitation from "./assets/invitation.png";
import profile from "./assets/profile.png";
import board from "./assets/board.png";
import { UserCtx } from "../../Context/MainContext";
import { Zoom, Fade, LightSpeed } from "react-reveal";
import { AppState } from "../../../App";
import Logo from "../../assets/Logo";
import { dark, light } from "../../Theme/Theme";

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
        <Container maxWidth="md">
          <LightSpeed left cascade >
            <Grid container  height={"45vh"}>
              <Grid
                item
                xs={12}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <div style={{ height: 120 }} />{" "}
                <Logo
                  height={140}
                  mainfill={
                    this.context.darkModeOn === "true"
                      ? dark.palette.text.primary
                      : "#00000098"
                  }
                  secfill={light.palette.primary.main}
                />
                <Grid item xs={10}>
                  <Zoom duration={300} delay={1000}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      textAlign="justify"
                      sx={{ pt: 2, maxWidth: 280 }}
                    >
                      <i>We want to book your bands for you!</i>
                    </Typography>
                  </Zoom>
                  <Zoom duration={300} delay={1500}>
                    <Grid
                      item
                      pt={2}
                      xs={12}
                      display="flex"
                      justifyContent="center"
                    >
                      <HashLink smooth to={`#text-anchor`}>
                        <ArrowDownward id={"hash-link"} />
                      </HashLink>
                    </Grid>
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
                      maxWidth: '90vw',
                      filter:
                        this.context.darkModeOn === "true"
                          ? "invert(100%) sepia(7%) saturate(7%) hue-rotate(70deg) brightness(107%) contrast(100%)"
                          : "invert(42%) sepia(0%) saturate(0%) hue-rotate(167deg) brightness(94%) contrast(91%)",
                        }}
                        />
                </Grid>
              
            </Grid>
          </LightSpeed>
            <div style={this.context.darkModeOn === "true" ?{display: 'none'}:{}}>
              <div style={{ height: '40vh', width: "100%" }} />
              <div style={{ height: '10vh', width: "100%" }} />
            </div>
          <Paper sx={{ display: "flex", flexDirection: "column" }}>
            <div style={this.context.darkModeOn !== "true" ?{display: 'none'}:{}}>
            <div style={{ height: 0 }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path
                  fill="#121212"
                  fillOpacity={1}
                  d="M0,224L0,224L37.9,224L37.9,160L75.8,160L75.8,128L113.7,128L113.7,224L151.6,224L151.6,288L189.5,288L189.5,160L227.4,160L227.4,320L265.3,320L265.3,64L303.2,64L303.2,32L341.1,32L341.1,256L378.9,256L378.9,320L416.8,320L416.8,96L454.7,96L454.7,128L492.6,128L492.6,224L530.5,224L530.5,96L568.4,96L568.4,224L606.3,224L606.3,64L644.2,64L644.2,128L682.1,128L682.1,288L720,288L720,224L757.9,224L757.9,64L795.8,64L795.8,256L833.7,256L833.7,160L871.6,160L871.6,128L909.5,128L909.5,0L947.4,0L947.4,64L985.3,64L985.3,288L1023.2,288L1023.2,256L1061.1,256L1061.1,64L1098.9,64L1098.9,288L1136.8,288L1136.8,288L1174.7,288L1174.7,128L1212.6,128L1212.6,192L1250.5,192L1250.5,192L1288.4,192L1288.4,128L1326.3,128L1326.3,160L1364.2,160L1364.2,32L1402.1,32L1402.1,256L1440,256L1440,0L1402.1,0L1402.1,0L1364.2,0L1364.2,0L1326.3,0L1326.3,0L1288.4,0L1288.4,0L1250.5,0L1250.5,0L1212.6,0L1212.6,0L1174.7,0L1174.7,0L1136.8,0L1136.8,0L1098.9,0L1098.9,0L1061.1,0L1061.1,0L1023.2,0L1023.2,0L985.3,0L985.3,0L947.4,0L947.4,0L909.5,0L909.5,0L871.6,0L871.6,0L833.7,0L833.7,0L795.8,0L795.8,0L757.9,0L757.9,0L720,0L720,0L682.1,0L682.1,0L644.2,0L644.2,0L606.3,0L606.3,0L568.4,0L568.4,0L530.5,0L530.5,0L492.6,0L492.6,0L454.7,0L454.7,0L416.8,0L416.8,0L378.9,0L378.9,0L341.1,0L341.1,0L303.2,0L303.2,0L265.3,0L265.3,0L227.4,0L227.4,0L189.5,0L189.5,0L151.6,0L151.6,0L113.7,0L113.7,0L75.8,0L75.8,0L37.9,0L37.9,0L0,0L0,0Z"
                ></path>
              </svg>
          
            </div>
              <div style={{ height: '40vh', width: "100%" }} />
              <div id="text-anchor" style={{ height: 1, width: "100%" }} />
              <div style={{ height: '10vh', width: "100%" }} />
            </div>
            <Grid container p={2}>
              <Grid
                item
                xs={12}
                md={6}
                textAlign="justify"
                display="flex"
                flexDirection="column"
                justifyContent="center"
              >
                <Fade left duration={800}>
                  <Typography variant="overline">Mission</Typography>
                </Fade>
                <Fade left duration={800}>
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
                <Fade left duration={800}>
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
                md={6}
                display="flex"
                justifyContent="center"
                sx={{ pt:4}}
              >
                <Fade right duration={800}>
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
                    <Fade left duration={800}>
                      <img
                        src={invitation}
                        alt="View of the main app dashboard"
                        style={{ height: 400, borderRadius: 9, padding: 5 }}
                      />
                    </Fade>
                    <Fade left duration={800}>
                      <img
                        src={gigsMapped}
                        alt="View of the main app dashboard"
                        style={{ height: 400, borderRadius: 9, padding: 5 }}
                      />
                    </Fade>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={5} textAlign="justify">
                  <Fade right duration={800}>
                    <Typography variant="overline">Core features</Typography>
                  </Fade>
                  <Fade right duration={800}>
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
                  <Fade right duration={800}>
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
                <Fade left duration={800}>
                  <Typography variant="overline">Bonus features</Typography>
                </Fade>
                <Fade left duration={800}>
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
                <Fade left duration={800}>
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
                <Fade right duration={800}>
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
                <Fade bottom duration={800}>
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
                      <Typography variant="h5">Sign up today!</Typography>
                    </Button>
                  </Link>
                </Grid>
              </Fade>
            )}
          </Paper>
        </Container>
        <div style={{ height: 40, width: "100%" }} />
      </>
    );
  }
}

export default Welcome;
