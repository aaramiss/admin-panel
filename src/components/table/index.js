import React, { useState, useEffect } from "react";
import axios from "axios";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";

// import TableSortLabel from "@mui/material/TableSortLabel";
import { tokens } from "../../theme";
import {
  useTheme,
  ThemeProvider,
  TextField,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import { styled } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";

const AddButton = styled(Button)({
  boxShadow: "none",
  textTransform: "none",
  fontSize: 16,
  padding: "6px 12px",
  lineHeight: 1.5,
  marginLeft: "10px",
  backgroundColor: "#fff",

  fontFamily: [
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(","),
  "&:hover": {
    border: "1px solid #fff",
    backgroundColor: "rgba(20, 27, 45, 0.08)",
    color: "#fff",
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
export default function DoctorTable({ showSnackbar }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [doctors, setDoctors] = useState([
    {
      id: 0,
      name: "",
      specialty: "",
      location: "",
      phone: 0,
      email: "",
    },
  ]);

  // const [columns, setColumns] = useState([]);
  // const [orderBy, setOrderBy] = useState("doctor_name");
  // const [order, setOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  // const [selectionModel, setSelectionModel] = useState([]);
  // const [rows, setRows] = React.useState([]);
  const navigat = useNavigate();

  const pageSize = 5;

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      editable: true,
    },
    { field: "location", headerName: "Location", flex: 1, editable: true },
    { field: "id", headerName: "ID", flex: 1, editable: false },
    { field: "specialty", headerName: "Specialty", flex: 1, editable: true },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            color="secondary"
            onClick={() => handleEdit(params.row.id)}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            color="secondary"
            onClick={(e) => handleDelete(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];
  useEffect(() => {
    axios
      .get("http://localhost:3000/doctors")
      .then((res) => {
        setDoctors(res.data);
      })
      .catch((error) => {
        console.error("Error fetching Data:", error);
      });
  }, []);

  const handleDelete = (id) => {
    console.log("Delete doctor with ID:", id);
    const conf = window.confirm("Do you want to delete?");
    if (conf) {
      axios
        .delete("http://localhost:3000/doctors/" + id)
        .then((res) => {
          showSnackbar("record has deleted!!");
          fetchData();
        })
        .catch((err) => console.log(err));
    }
  };
  const handleEdit = (id) => {
    // Use the navigate function to redirect to the edit page
    navigat(`/update/${id}`);
  };
  const fetchData = () => {
    axios
      .get("http://localhost:3000/doctors")
      .then((response) => {
        setDoctors(response.data);
        showSnackbar("Data successfully fetched.");
      })
      .catch((error) => console.error("Error fetching data:", error));
  };
  // const handleSortRequest = (property) => {
  //   const isAsc = orderBy === property && order === "asc";
  //   setOrder(isAsc ? "desc" : "asc");
  //   setOrderBy(property);
  // };

  // Search
  const filteredDoctors = doctors.slice().filter((doctor) => {
    return (
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <CssTextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          id="outlined-size-small"
          size="small"
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            margin: "16px 1px",
          }}
        />
        <Link to="/create">
          <AddButton
            variant="outlined"
            style={{ margin: "16px 4px" }}
            startIcon={<AddCircleOutlinedIcon />}
          >
            Add
          </AddButton>
        </Link>

        {/* <TableContainer component={Paper}>
        <Table sx={{}} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">
                <TableSortLabel
                  active={orderBy === "doctor_ID"}
                  direction={orderBy === "doctor_ID" ? order : "asc"}
                  onClick={() => handleSortRequest("doctor_ID")}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell align="left">
                <TableSortLabel
                  active={orderBy === "doctor_name"}
                  direction={orderBy === "doctor_name" ? order : "asc"}
                  onClick={() => handleSortRequest("doctor_name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell align="left">
                <TableSortLabel
                  active={orderBy === "doctor_specialty"}
                  direction={orderBy === "doctor_specialty" ? order : "asc"}
                  onClick={() => handleSortRequest("doctor_specialty")}
                >
                  Specialty
                </TableSortLabel>
              </TableCell>
              <TableCell align="left">Location</TableCell>
              <TableCell align="left">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAndFilteredDoctors.map((doctor) => (
              <TableRow
                key={doctor.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {doctor.id}
                </TableCell>
                <TableCell align="left">{doctor.name}</TableCell>
                <TableCell align="left">{doctor.specialty}</TableCell>
                <TableCell align="left">{doctor.location}</TableCell>
                <TableCell align="left">
                  <Link to={`/update/${doctor.id}`}>
                    <IconButton color="secondary">
                      <EditIcon />
                    </IconButton>
                  </Link>

                  <IconButton
                    color="secondary"
                    onClick={(e) => handleDelete(doctor.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}

        <Box
          height="85vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
          }}
        >
          <DataGrid
            rows={filteredDoctors}
            columns={columns}
            pageSize={pageSize}
            rowsPerPageOptions={[pageSize]}
            pagination
            checkboxSelection
            initialState={{
              sorting: {
                sortModel: [{ field: "name", sort: "desc" }],
              },
            }}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
