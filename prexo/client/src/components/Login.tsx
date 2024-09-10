import { useContext, useState } from "react";
import { AuthContext } from "../context/auth-context";
import "./Login.css";

export function Login() {
  const [credentials, setCredentials] = useState({
    f_UserName: "",
    f_Pwd: "",
  });

  const { login } = useContext(AuthContext);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(credentials);
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          name="f_UserName"
          value={credentials.f_UserName}
          onChange={(e) =>
            setCredentials({ ...credentials, f_UserName: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Password"
          name="f_Pwd"
          value={credentials.f_Pwd}
          onChange={(e) =>
            setCredentials({ ...credentials, f_Pwd: e.target.value })
          }
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;

// import React from "react";
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   TextField,
//   Typography,
//   Container,
// } from "@mui/material";
// import { Lock as LockIcon } from "lucide-react";

// const LoginPage: React.FC = () => {
//   return (
//     <Container
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "100vh",
//         background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
//       }}
//     >
//       <Card
//         sx={{
//           display: "flex",
//           maxWidth: 400,
//           width: "100%",
//           boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             alignItems: "center",
//             bgcolor: "primary.main",
//             color: "primary.contrastText",
//             p: 2,
//             width: "30%",
//           }}
//         >
//           <LockIcon size={48} />
//           <Typography variant="h6" sx={{ mt: 2 }}>
//             Login
//           </Typography>
//         </Box>
//         <CardContent
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             width: "70%",
//             p: 3,
//           }}
//         >
//           <TextField
//             label="Username"
//             variant="outlined"
//             margin="normal"
//             fullWidth
//           />
//           <TextField
//             label="Password"
//             type="password"
//             variant="outlined"
//             margin="normal"
//             fullWidth
//           />
//           <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
//             Login
//           </Button>
//         </CardContent>
//       </Card>
//     </Container>
//   );
// };

// export default LoginPage;
