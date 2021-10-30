import * as React from "react";
// import { Link } from "react-router-dom";
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
  Button
} from "@mui/material";
import wave from "./assets/wavesNegative.svg";
import band from "./assets/band.png";
import { UserCtx } from "../../Context/MainContext";

interface WelcomeProps {}

const Welcome = (props: WelcomeProps) => {
  return (
    <>
      <Container maxWidth="lg">
        <Grid container>
          <Grid
            item
            xs={12}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <div style={{ height: 160 }} />
            <Typography variant="h1" fontWeight={500} fontSize={70}>
              <Box component="span" sx={{ color: "" }}>
                F
              </Box>
              irst
              <Box
                component="span"
                sx={{ color: "secondary.light" }}
                fontWeight={900}
              >
                C
              </Box>
              all
            </Typography>

            <Grid item xs={10}>
              <Typography
                variant="body2"
                fontWeight={600}
                textAlign="justify"
                sx={{ pt: 2, maxWidth: 280 }}
              >
                <i>
                  We want to book your bands for you!
                </i>
              </Typography>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <img
              src={band}
              alt="sihloutte of a band"
              style={{
                maxHeight: 375,
                filter: `invert(97%) sepia(4%) saturate(394%) hue-rotate(178deg) brightness(110%) contrast(68%)`,
              }}
            />
          </Grid>
          {/* <Divider sx={{width: '100%', p: 3}} /> */}
        </Grid>
      </Container>
      <div style={{ height: 90, width: "100%" }} />
      <Container maxWidth={"lg"}>
        <Paper>
          <Grid container p={2}>
            <Grid
              item
              xs={12}
              md={5}
              textAlign="justify"
              // border={1}
              // sx={{ borderColor: "divider" }}
            >
              <Typography variant="overline">Mission</Typography>
              <Typography sx={{ textIndent: 22 }}>
                {`Are you sick of keeping track of countless
                email, text, and messaging-app threads? Do you 
                need a central location to keep track of all of 
                your jobs? Do you want a place to connect with 
                other freelance musicians? You have come to the 
                right place!
                `}
              </Typography>
              <Typography sx={{ textIndent: 22 }}>
                {`Our aim is to be the 
                #1 software solution for independant 
                musicians and bandleaders. We know the
                stresses of freelancing, and want to fill
                in at least one of the gaps. `}
              </Typography>
            </Grid>
            <Grid item xs={12} md={7}></Grid>
            <Grid item xs={12} md={7}></Grid>
            <Grid item xs={12} md={5} textAlign="justify">
              <Typography variant="overline">Core features</Typography>
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
            </Grid>
            <Grid item xs={12} md={5} textAlign="justify">
              <Typography variant="overline">Bonus features</Typography>
              <Typography sx={{ textIndent: 22 }}>
                In addition to the core features, FirstCall also serves as
                a communication hub. Every gig has its own private messaging 
                board. Band members can use this to communicate any necessary
                planning. Post something, and hopefully after a while someone
                will have <strong><i>read</i></strong>-it! 
                
              </Typography>
              <Typography sx={{ textIndent: 22 }}>
                You also are given a profile page where you can share gig photos
                with short captions. Think <strong><i>Gig</i>-stagram</strong>! Your profile also 
                displays your preferred payment information (Venmo, Cash App, etc).
                
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      <div style={{ height: 80, width: "100%" }} />
              <Grid container display='flex' justifyContent='center'>
                <Button variant='contained' color='success' sx={{p: 3}}>
                  <Typography variant='h3'>Sign up today!</Typography>
                </Button>
              </Grid>
      </Container>
      <div style={{ height: 200, width: "100%" }} />

      {/* <div style={{backgroundImage: `url(${wave})`, height: 111, backgroundColor: 'white'}} /> */}
    </>
  );
};

export default Welcome;
