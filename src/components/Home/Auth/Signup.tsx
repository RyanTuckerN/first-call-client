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

interface SignupProps {
  functions: any;
  authState: any;
}

const Signup = (props: SignupProps) => {
  const {
    handleEmail,
    handlePassword,
    handleFirst,
    handleLast,
    handleSignup,
    clearState,
  } = props.functions;

  const { first, last, email, password } = props.authState;

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
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSignup} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                value={first}
                onChange={handleFirst}
                id="firstName"
                label="First Name"
                autoFocus={!first ? true : false}
                InputProps={{ required: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                value={last}
                onChange={handleLast}
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                aria-required
                InputProps={{ required: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                value={email}
                onChange={handleEmail}
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                InputProps={{ required: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                autoFocus={first && last && email ? true : false}
                fullWidth
                value={password}
                onChange={handlePassword}
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                InputProps={{ required: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            sx={{ mt: 3, mb: 2, color: "white" }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/auth/login">
                <div onClick={clearState}>Already have an account? Sign in</div>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;
