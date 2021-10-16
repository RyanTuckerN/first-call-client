import {
  Route,
  Link,
  Switch,
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import MuiLink from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

interface LoginProps {
  functions: any;
  authState: any
}

const Login = (props: LoginProps) => {
  const { handleEmail, handlePassword, handleLogin, clearState } = props.functions;

  // return (
  //   <div>
  //     <label htmlFor="email">Email address</label>
  //     <input type="email" id="email" name="email" onChange={handleEmail}/>
  //     <label htmlFor="password">Password</label>
  //     <input type="password" id="password" name="password" onChange={handlePassword} />
  //     <Link to="/auth/signup">
  //       <div onClick={clearState}>Need to sign up?</div>
  //     </Link>
  //   </div>
  // );

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
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={handleLogin}
          noValidate
          sx={{ mt: 1 }}
        >
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
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <MuiLink href="#" variant="body2">
                Forgot password?
              </MuiLink>
            </Grid>
            <Grid item>
              <Link to="/auth/signup">
                <MuiLink href="#" onClick={clearState} variant="body2">
                  {"Don't have an account? Sign Up"}
                </MuiLink>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
    </Container>
  );
};

export default Login;
