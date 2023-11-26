import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import { CircularProgress, useTheme, ThemeProvider } from "@mui/material";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";

const CustomButton = styled(Button)({
  boxShadow: "none",
  textTransform: "none",
  fontSize: 16,
  color: " #fff",
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
const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#A0AAB4",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#B2BAC2",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#E0E3E7",
    },
    "&:hover fieldset": {
      borderColor: "#B2BAC2",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#6F7E8C",
    },
  },
});
function TransitionLeft(props) {
  return <Slide {...props} direction="left" />;
}
export default function AddDoctor({
  // showSnackbar,
  // snackbarMessage,
  // snackbarOpen,
  // setSnackbarOpen,
  // validateField,
  // checkValidation,
  props,
}) {
  const theme = useTheme();
  const [formData, setFormData] = React.useState({
    id: 0,
    name: "",
    specialty: "",
    location: "",
    phone: "",
    email: "",
  });

  const [formErrors, setFormErrors] = React.useState({
    id: "",
    name: "",
    specialty: "",
    location: "",
    phone: "",
    email: "",
  });

  const [isLoading, setIsLoading] = React.useState(false);

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
    const validationResult = props.validateField(name, value);
    setFormErrors({
      ...formErrors,
      [name]: validationResult,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("Button clicked");

    props.checkValidation();
    setIsLoading(true);

    axios
      .post("http://localhost:3000/doctors", {
        name: formData.name,
        specialty: formData.specialty,
        location: formData.location,
      })
      .then((response) => {
        console.log("Post created:", response.data);
        props.showSnackbar(
          `Post with ${JSON.stringify(response.data.id)}'s userId created...`
        );
      })

      .catch((err) => {
        console.error("Error creating post:", err);
        props.showSnackbar(`Error creating post: ${JSON.stringify(err)}`);
      })
      .finally(() => {
        setIsLoading(false);
        console.log(isLoading);
      });
  }; //http://localhost:3005/user
  return (
    <ThemeProvider theme={theme}>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 4 },
          justifyContent: "center",
        }}
        noValidate
        onSubmit={submitHandler}
        autoComplete="off"
      >
        <div>
          <CssTextField
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
          <CssTextField
            helperText={"Please enter your location"}
            id="outlined-start-adornment"
            label="location"
            fullWidth
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div>
          <CssTextField
            helperText={"Please enter your ID"}
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
          <CssTextField
            helperText={"Please enter your specialty"}
            error={Boolean(formErrors.specialty)}
            id="demo-helper-txt-misaligned"
            label="specialty"
            fullWidth
            name="specialty"
            value={formData.specialty}
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
              Create Doctor
            </CustomButton>
          )}
        </Stack>
        <Snackbar
          TransitionComponent={transition}
          key={transition ? transition.name : ""}
          open={props?.snackbarOpen}
          autoHideDuration={5000}
          onClose={() => props?.setSnackbarOpen(false)}
          message={props?.snackbarMessage}
        ></Snackbar>
      </Box>
    </ThemeProvider>
  );
}
