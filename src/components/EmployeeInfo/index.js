import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import { CircularProgress, createTheme, ThemeProvider } from "@mui/material";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";

const theme = createTheme({
  typography: {
    fontSize: 22,
  },
});

const CustomButton = styled(Button)({
  boxShadow: "none",
  textTransform: "none",
  fontSize: 16,
  padding: "6px 12px",
  border: "1px solid",
  lineHeight: 1.5,
  backgroundColor: "#0063cc",
  borderColor: "#0063cc",
  "&:hover": {
    backgroundColor: "#0069d9",
    borderColor: "#0062cc",
    boxShadow: "none",
  },
  "&:active": {
    boxShadow: "none",
    backgroundColor: "#0062cc",
    borderColor: "#005cbf",
  },
  "&:focus": {
    boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
  },
});

function TransitionLeft(props) {
  return <Slide {...props} direction="left" />;
}
export default function BasicTextFields() {
  const [formData, setFormData] = React.useState({
    id: 0,
    name: "",
    age: 0,
    department: "",
  });

  const [formErrors, setFormErrors] = React.useState({
    id: 0,
    name: "",
    age: 0,
    department: "",
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  const [transition, setTransition] = React.useState(undefined);

  const handleClick = (Transition) => () => {
    setTransition(() => Transition);
  };

  /*update state*/
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setFormErrors({
      ...formErrors,
      [name]: validateField,
    });
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  /*VALIDATION*/
  const checkValidation = () => {
    const errors = { ...formErrors };
    errors.name = !formData.name.trim() ? "Name is required" : "";
    errors.id = errors.id = !formData.id ? "id is required" : "";

    setFormErrors(errors);
  };
  const validateField = (name, value) => {
    switch (name) {
      case "id":
        checkValidation(value);
        break;
      case "name":
        checkValidation(value);
        break;
      case "age":
        checkValidation(value);
        break;
      case "department":
        checkValidation(value);
        break;
      default:
        return true;
    }
  };
  const submitHandler = (e) => {
    e.preventDefault();
    console.log("Button clicked");

    checkValidation();
    setIsLoading(true);

    axios
      .post("./sample.json", {
        userId: formData.id,
        name: formData.name,
        age: formData.age,
        department: formData.department,
      })
      .then((response) => {
        console.log("Post created:", response.data);
        showSnackbar(
          `Post with ${JSON.stringify(
            response.data.userId
          )}'s userId created...`
        );
      })

      .catch((err) => {
        console.error("Error creating post:", err);
        showSnackbar(`Error creating post: ${JSON.stringify(err)}`);
      })
      .finally(() => {
        setIsLoading(false);
        console.log(isLoading);
      });
  };
  return (
    <ThemeProvider theme={theme}>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { width: "35rem", m: 4 },
          justifyContent: "center",
        }}
        noValidate
        onSubmit={submitHandler}
        autoComplete="off"
      >
        <div>
          <TextField
            fullWidth
            helperText={formErrors.name ? "" : "Please enter your Name"}
            error={Boolean(formErrors.name)}
            id="outlined-basic"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <TextField
            helperText={
              formErrors.department ? "" : "Please enter your department"
            }
            id="outlined-start-adornment"
            label="department"
            fullWidth
            name="department"
            value={formData.department}
            onChange={handleChange}
          />
        </div>

        <div>
          <TextField
            helperText={formErrors.id ? formErrors.id : "Please enter your ID"}
            error={Boolean(formErrors.id)}
            id="demo-helper-txt-misaligned"
            label="id"
            fullWidth
            type="number"
            name="id"
            value={formData.id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <TextField
            helperText={
              formErrors.age ? formErrors.age : "Please enter your age"
            }
            error={Boolean(formErrors.age)}
            id="demo-helper-txt-misaligned"
            label="age"
            fullWidth
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>

        <Stack spacing={2} direction="row">
          {isLoading ? (
            <CircularProgress size={34}></CircularProgress>
          ) : (
            <CustomButton
              type="submit"
              variant="outlined"
              onClick={handleClick(TransitionLeft)}
            >
              Create Employee
            </CustomButton>
          )}
        </Stack>
        <Snackbar
          TransitionComponent={transition}
          key={transition ? transition.name : ""}
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        ></Snackbar>
      </Box>
    </ThemeProvider>
  );
}
