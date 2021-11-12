import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import logoPng from "./assets/FC-favicon.png";
import Logo from "../../assets/Logo";
import { UserCtx } from "../../Context/MainContext";
import { dark, light } from "../../Theme/Theme";

interface LoginProps {
  functions: any;
  authState: any;
}

const Login = (props: LoginProps) => {
  const { handleEmail, handlePassword, handleLogin, clearState } =
    props.functions;
  const context = useContext(UserCtx);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Logo
          height={75}
          mainfill={
            context!.darkModeOn === "true"
              ? dark.palette.text.primary
              : "#00000098"
          }
          secfill={light.palette.primary.main}
        />

        <Typography component="h1" variant="h5" mt={5}>
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            onChange={handleEmail}
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            onChange={handlePassword}
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2, color: "white" }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs></Grid>
            <Grid item>
              <Link to="/auth/signup">
                <div onClick={clearState}>
                  {"Don't have an account? Sign Up"}
                </div>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
