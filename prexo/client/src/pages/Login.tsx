import React, {
  useContext,
  useState,
  useCallback,
  useEffect,
  memo,
} from "react";
import { AuthContext } from "../context/auth-context";
import {
  Container,
  Grid,
  Box,
  CardContent,
  TextField,
  Button,
  Card,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import logo from "../assets/logo.jpg";
import { useNavigate } from "react-router-dom";

const StyledCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(4),
  width: "90%",
  maxWidth: "500px",
  boxShadow: "none",
}));

interface Credentials {
  f_UserName: string;
  f_Pwd: string;
}

interface LoginFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  credentials: Credentials;
}

const LoginForm: React.FC<LoginFormProps> = memo(
  ({ onSubmit, onChange, credentials }) => (
    <Box component="form" noValidate autoComplete="off" onSubmit={onSubmit}>
      <TextField
        type="text"
        label="Enter Username"
        variant="standard"
        fullWidth
        name="f_UserName"
        value={credentials.f_UserName}
        onChange={onChange}
        sx={{ marginBottom: "3vh" }}
      />
      <TextField
        type="password"
        label="Enter Password"
        variant="standard"
        fullWidth
        name="f_Pwd"
        value={credentials.f_Pwd}
        onChange={onChange}
        sx={{ marginBottom: "3vh" }}
      />
      <Button
        type="submit"
        variant="contained"
        color="info"
        fullWidth
        sx={{ mt: 2 }}
      >
        Login
      </Button>
    </Box>
  )
);

export function Login() {
  const [credentials, setCredentials] = useState<Credentials>({
    f_UserName: "",
    f_Pwd: "",
  });

  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      login(credentials);
    },
    [credentials, login]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <Container>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "100vh" }}
      >
        <Box
          sx={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            // padding: "2vh",
            paddingTop: "0px",
            bgcolor: "white",
          }}
        >
          <Grid
            container
            spacing={1}
            alignItems="center"
            sx={{ padding: "20px" }}
          >
            <Grid item xs={12} sm={4}>
              <Typography variant="h5" align="center">
                <img src={logo} alt="Logo" height="150" width="200" />
              </Typography>
            </Grid>

            <Grid item xs={12} sm={8} sx={{ padding: "10px" }}>
              <StyledCard>
                <CardContent>
                  <LoginForm
                    onSubmit={handleSubmit}
                    onChange={handleChange}
                    credentials={credentials}
                  />
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Container>
  );
}

export default Login;
