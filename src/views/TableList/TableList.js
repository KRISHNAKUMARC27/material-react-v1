import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from "@mui/material";

import Button from "components/CustomButtons/Button.js";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { withStyles, MenuItem } from "@material-ui/core";
import { green, lightGreen } from "@material-ui/core/colors";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Snack from "@material-ui/core/Snackbar";

import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const defaultMaterialTheme = createTheme();

let options = {
  filtering: true,
  selection: true,
  sorting: true,
  paging: true,
  exportButton: true,
  tableLayout: "fixed",
  actionsColumnIndex: -1,
  toolbarButtonAlignment: "left",
  rowStyle: {
    fontFamily: '"aktiv-grotesk", sans-serif',
    backgroundColor: "transparent",
    lineHeight: "1.42857143",
    padding: "12px 8px",
    verticalAlign: "middle",
    fontSize: "0.8125rem",
  },
  headerStyle: {
    fontFamily: '"aktiv-grotesk", sans-serif',
    fontSize: "1.1em",
    fontWeight: "600",
    backgroundColor: "transparent",
  },
  searchFieldStyle: {
    fontFamily: '"aktiv-grotesk", sans-serif',
  },
  // rowStyle: (rowData) => {
  //   return {
  //     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  //     //add alignment here
  //     backgroundColor: "transparent",
  //     lineHeight: "1.42857143",
  //     padding: "12px 8px",
  //     verticalAlign: "middle",
  //     fontSize: "0.8125rem",
  //   };
  // },
};

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
  root: {
    flexGrow: 1,
  },
  primaryColor: {
    color: green[500],
  },
  secondaryColor: {
    color: green[700],
  },

  padding: {
    padding: 0,
  },
  mainHeader: {
    backgroundColor: green[100],
    padding: 20,
    alignItems: "center",
  },
  mainContent: {
    padding: 40,
  },
  secondaryContainer: {
    padding: "20px 25px",
    backgroundColor: green[200],
  },
};

const useStyles = makeStyles(styles);

let Environment = [];
let testSuiteEnvironment = [];
let configTestSuite = [];
let Model = [];
let TestType = [];
let scroll = "paper";
let ddr = "hello";

export default function TableList() {
  const classes = useStyles();

  const { useState } = React;

  const [columns, setColumns] = useState([
    // const columns = [
    {
      title: "Name",
      field: "name",
      cellStyle: { width: 100, maxWidth: 100 },
      headerStyle: { width: 100, maxWidth: 100 },
      width: "40%",
      render: (row) => (
        <div
          onClick={() => {
            console.log(row.id);

            // fetch(
            //   "http://localhost:8080//testData/save/testpayloadData/" + row.id
            // ).then((data) => {
            //   console.log(data.json());
            //   handleClickOpen();
            // });
          }}
        >
          {row.name}
        </div>
      ), //Becamse useless
    },
    {
      title: "Model",
      field: "modelName",
      width: "20%",
    },
    {
      title: "Env",
      field: "envType",
      width: "20%",
      // initialEditValue: "initial edit value",
      // lookup: { SI: "SI", UAT: "UAT", PROD: "PROD", DEV: "DEV" },
    },
    {
      title: "Type",
      field: "testType",
      width: "20%",
    },
    { title: "Detail", field: "testDetail", width: "20%" }, //, type: "numeric"
    { title: "Created By", field: "createdBy", width: "20%" },
    { title: "Time", field: "testCreated", width: "20%" },
  ]);

  React.useEffect(() => {
    fetchTestMetaData();

    fetch(process.env.REACT_APP_API_URL + "/config/environment")
      .then((data) => data.json())
      .then((data) => {
        // setEnvironment(data);
        Environment = [...data];
        testSuiteEnvironment = ["MIX", ...data];
      })
      .catch((err) => {
        console.log(err.message);
      });

    fetch(process.env.REACT_APP_API_URL + "/config/model")
      .then((data) => data.json())
      .then((data) => {
        Model = [...data];
      })
      .catch((err) => {
        console.log(err.message);
      });

    fetch(process.env.REACT_APP_API_URL + "/config/testType")
      .then((data) => data.json())
      .then((data) => {
        TestType = [...data];
      })
      .catch((err) => {
        console.log(err.message);
      });

    return () => {
      setData([]);
    };
  }, []);

  const fetchTestMetaData = () => {
    fetch(process.env.REACT_APP_API_URL + "/testData/findAll")
    .then((data) => data.json())
    .then((data) => setData(data))
    .catch((err) => {
      console.log(err.message);
    });
  }

  const [data, setData] = useState([]);
  const memoizeddata = React.useMemo(() => data, [data]);

  // const tableRef = React.createRef();
  const [ddrOpen, setDdrOpen] = React.useState(false);
  const [newtcopen, setNewtcopen] = React.useState(false);
  const [newtplanopen, setNewtplanopen] = React.useState(false);
  const [newtsuiteopen, setNewtsuiteopen] = React.useState(false);

  //CHGD
  const [existingtsuiteopen, setExistingtsuiteopen] = React.useState(false);
  //const [existingtSuite, setExistingtSuite] = React.useState([]);
  const [selectedtSuite, setSelectedtSuite] = React.useState("");

  const testMetaDataNameRef = React.useRef(null);
  const [modelName, setModelName] = useState("");
  const [envType, setEnvType] = useState("");
  const [testType, setTestType] = useState("");
  const testDetailRef = React.useRef(null);
  const createdByRef = React.useRef(null);
  const jsonPayloadRef = React.useRef(null);

  //Initialize new Test Task
  const testTaskNameRef = React.useRef(null);
  const [testMetaDataIds, setTestMetaDataIds] = useState([]);
  const memoizedtcIds = React.useMemo(() => testMetaDataIds, [testMetaDataIds]);

  //Initialize new test suite
  const testSuiteNameRef = React.useRef(null);
  const [suitetcIds, setSuiteTcIds] = useState([]);
  const memoizedsuitetcIds = React.useMemo(() => suitetcIds, [suitetcIds]);
  const [testSuiteEnvType, setTestSuiteEnvType] = useState("");

  const [snackopen, setSnackOpen] = React.useState(false);
  const [snackmessage, setSnackMessage] = React.useState("");
  const [snackcolor, setSnackColor] = React.useState("");

  const handleClickOpen = () => {
    setDdrOpen(true);
  };

  const handleNewTcClickOpen = () => {
    setNewtcopen(true);
    console.log("Inside handleNewTcClickOpen");
  };

  const handleNewtplanClickOpen = () => {
    setNewtplanopen(true);
    console.log("OPENED TC");
  };

  const handleNewTSuiteClickOpen = () => {
    setNewtsuiteopen(true);
  };

  const handleTSuiteCreate = () => {
    setNewtsuiteopen(false);

    let testSuiteCreationRequest = {
      name: testSuiteNameRef.current?.value,
      testMetaDataIds: memoizedsuitetcIds,
      testType: testType,
      envType: testSuiteEnvType,
    };
    createTestSuite(testSuiteCreationRequest);
  };

  const handleUpdateTSuiteClickOpen = () => {
    fetch(process.env.REACT_APP_API_URL + "/testSuite/findAll")
      .then((data) => data.json())
      .then((data) => {
        // setExistingtSuite(data);
        configTestSuite = [...data];
        setExistingtsuiteopen(true);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const updateTSuite = () => {
    setExistingtsuiteopen(false);

    let testSuiteUpdateRequest = {
      id: selectedtSuite.id,
      testMetaDataIds: memoizedsuitetcIds,
    };
    updateTestSuite(testSuiteUpdateRequest);
  };

  const handleClose = () => {
    // console.log(pink);
    setDdrOpen(false);
    setNewtcopen(false);
    setNewtplanopen(false);
    setNewtsuiteopen(false);
    setExistingtsuiteopen(false);
  };

  const handleExecute = () => {
    setNewtplanopen(false);

    let testExecutionRequest = {
      name: testTaskNameRef.current?.value,
      testMetaDataIds: memoizedtcIds,
      processRate: "4",
    };
    console.log(testExecutionRequest);
    executeTestCases(testExecutionRequest);
    setTestMetaDataIds([]);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (ddrOpen) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [ddrOpen]);

  const handleSave = () => {
    if (
      testMetaDataNameRef === "" ||
      modelName === "" ||
      envType === "" ||
      testType === "" ||
      testDetailRef === "" ||
      createdByRef === "" ||
      jsonPayloadRef === ""
    ) {
      setSnackMessage("Fill in mandatory fields");
      setSnackColor("warning");
      setSnackOpen(true);
    } else {
      setDdrOpen(false);
      setNewtcopen(false); //CHGD
      console.log("CHGD");
      //   console.log(values); //TODO WHATEVER WE SET AT LAST ALONE IS RETAINED.
      const addTestDataRequest = {
        testMetaData: {
          name: testMetaDataNameRef.current?.value,
          testDetail: testDetailRef.current?.value,
          createdBy: createdByRef.current?.value,
          modelName: modelName,
          testType: testType,
          envType: envType,
        },
        jsonPayload: jsonPayloadRef.current?.value,
      };

      saveNewTestData(addTestDataRequest);
      console.log(addTestDataRequest);
    }
  };

  

  const saveNewTestData = async (payload) => {
    await fetch(process.env.REACT_APP_API_URL + "/testData/save", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setData((posts) => [data, ...posts]);
        setSnackMessage(data.name + " added successfully");
        setSnackColor("success");
        setSnackOpen(true);
      })
      .catch((err) => {
        console.log(err.message);
        setSnackMessage(
          "Error while adding. Please check inputs " + err.message
        );
        setSnackColor("error");
        setSnackOpen(true);
      });
  };

  const editPosts = async (payload, dataUpdate) => {
    await fetch(process.env.REACT_APP_API_URL + "/testData/save", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setData([...dataUpdate]);
        setSnackMessage(data.name + " updated successfully");
        setSnackColor("success");
        setSnackOpen(true);
      })
      .catch((err) => {
        console.log(err.message);
        //   alert("Error while updating. Please check inputs " + err.message);
        setSnackMessage(
          "Error while updating. Please check inputs " + err.message
        );
        setSnackColor("error");
        setSnackOpen(true);
      });
  };

  const deleteMultiplePosts = async (payload) => {
    await fetch(process.env.REACT_APP_API_URL + "/testData/deleteMultiple", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || response.statusText);
        }
        setSnackMessage("Deleted successfully");
        setSnackColor("success");
        setSnackOpen(true);
        return response.json();
      })
      .then((data) => setData(data))
      .catch((err) => {
        console.log(err.message);
        setSnackMessage(
          "Error while deleting. Please check inputs " + err.message
        );
        setSnackColor("error");
        setSnackOpen(true);
      });
  };

  const executeTestCases = async (payload) => {
    await fetch(
      process.env.REACT_APP_API_URL + "/testTask/saveAndExecuteTestTask",
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    )
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setSnackMessage(data.name + " started");
        setSnackColor("success");
        setSnackOpen(true);
      })
      .catch((err) => {
        console.log(err.message);
        setSnackMessage("Error while executing Testcases " + err.message);
        setSnackColor("error");
      });
  };

  const createTestSuite = async (payload) => {
    await fetch(process.env.REACT_APP_API_URL + "/testSuite/saveTestSuite", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(async (response) => {
        setSuiteTcIds([]);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || response.statusText);
        }
        return response.json();
      })
      .then((res) => {
        console.log(res);
        setSnackMessage(res.name + " created");
        setSnackColor("success");
        setSnackOpen(true);
      })
      .catch((err) => {
        console.log(err.message);
        setSnackMessage("Error while creating Testsuite " + err.message);
        setSnackColor("error");
      });
  };

  const updateTestSuite = async (payload) => {
    await fetch(process.env.REACT_APP_API_URL + "/testSuite/updateTestSuite", {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(async (response) => {
        setSuiteTcIds([]);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || response.statusText);
        }
        return response.json();
      })
      .then((res) => {
        console.log(res);
        setSnackMessage(res.name + " updated");
        setSnackColor("success");
        setSnackOpen(true);
      })
      .catch((err) => {
        console.log(err.message);
        setSnackMessage("Error while updating Testsuite " + err.message);
        setSnackColor("error");
      });
  };

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="rose">
              <h4 className={classes.cardTitleWhite}>POD DDR Json</h4>
              <p className={classes.cardCategoryWhite}>
                List of Aggregation Engine Request Payloads
              </p>
            </CardHeader>

            <ThemeProvider theme={defaultMaterialTheme}>
              <MaterialTable
                title=""
                columns={columns}
                data={memoizeddata}
                options={options}
                //  tableRef={tableRef}
                onRowClick={(event, row) => {
                  // Get your id from rowData and use with link.
                  // handleClickOpen();
                  fetch(
                    process.env.REACT_APP_API_URL +
                      "/testData/testpayloadData/" +
                      row.id
                  )
                    .then((data) => data.json())
                    .then((data) => {
                      ddr = JSON.stringify(data, null, 4);
                      handleClickOpen();
                    })
                    .catch((err) => {
                      console.log(err.message);
                    });
                }}
                style={{
                  marginBottom: "0",
                  width: "100%",
                  maxWidth: "100%",
                  backgroundColor: "transparent",
                  borderSpacing: "0",
                  borderCollapse: "collapse",
                }}
                actions={[
                  {
                    tooltip: "Execute Selected TestCase Data",
                    icon: "directionsrun",
                    onClick: (evt, data) => {
                      // use REST CALL and then do findall to get data.
                      let ids = data.map((item) => item.id);
                      console.log(ids);
                      setTestMetaDataIds(ids);
                      handleNewtplanClickOpen();
                    },
                  },
                  {
                    tooltip: "Add selections to new Suite",
                    icon: "create_new_folder",
                    onClick: (evt, data) => {
                      // alert("You want to add " + data.length + " rows");
                      // use REST CALL and then do findall to get data.
                      let ids = data.map((item) => item.id);
                      console.log(ids);

                      setSuiteTcIds(ids);
                      handleNewTSuiteClickOpen();
                    },
                  },
                  {
                    tooltip: "Add selections to existing Suite",
                    icon: "drive_folder_upload",
                    onClick: (evt, data) => {
                      //  alert("You want to add " + data.length + " rows");
                      // use REST CALL and then do findall to get data.
                      let ids = data.map((item) => item.id);
                      console.log(ids);

                      setSuiteTcIds(ids);
                      handleUpdateTSuiteClickOpen();
                    },
                  },
                  {
                    tooltip: "Remove Selected TestCase Data",
                    icon: "delete",
                    onClick: (evt, data) => {
                      alert("You want to delete " + data.length + " rows");
                      // use REST CALL and then do findall to get data.
                      let ids = data.map((item) => item.id);
                      console.log(ids);

                      deleteMultiplePosts(ids);
                    },
                  },
                  {
                    icon: "refresh",
                    tooltip: "Refresh Data",
                    isFreeAction: true,
                    onClick: () => {}, //tableRef.current && tableRef.current.onQueryChange(),
                  },
                  {
                    icon: "add",
                    tooltip: "Add DDR Test Data",
                    isFreeAction: true,
                    onClick: () => {
                      handleNewTcClickOpen();
                    }, //tableRef.current && tableRef.current.onQueryChange(),
                  },
                  // {
                  //   icon: 'save',
                  //   tooltip: 'Save User',
                  //   isFreeAction: false,
                  //   onClick: (event, rowData) => alert("You saved " + rowData.name)
                  // },
                  // {
                  //   icon: 'edit',
                  //   tooltip: 'Edit Data',
                  //   isFreeAction: true,
                  //   onClick: rowData => {
                  //     // open dialog and fill your data to update
                  //   }
                  // },
                ]}
                editable={{
                  onBulkUpdate: (changes) =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                        resolve();
                      }, 1000);
                    }),
                  onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                        const dataUpdate = [...data];
                        const index = oldData.tableData.id;
                        dataUpdate[index] = newData;
                        //  console.log("Inside ROW UPDATE");
                        // console.log(JSON.stringify(newData));
                        let editRequest = {
                          testMetaData: newData,
                          jsonPayload: null,
                        };
                        editPosts(editRequest, dataUpdate);
                        // setData([...dataUpdate]);

                        resolve();
                      }, 1000);
                    }),
                  onRowDelete: (oldData) =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                        const dataDelete = [...data];
                        const index = oldData.tableData.id;
                        dataDelete.splice(index, 1);
                        // setData([...dataDelete]);

                        fetch(
                          process.env.REACT_APP_API_URL +
                            "/testData/" +
                            oldData.id,
                          {
                            method: "DELETE",
                          }
                        ).then(() => {
                          setData([...dataDelete]);
                        });

                        resolve();
                      }, 1000);
                    }),
                }}
              />
            </ThemeProvider>

            {/* </CardBody> */}
          </Card>
        </GridItem>
      </GridContainer>
      <Dialog
        open={ddrOpen}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Dot Data Request</DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            {ddr}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="success">
            Close
          </Button>
          {/* <Button onClick={handleClose}>Subscribe</Button> */}
        </DialogActions>
      </Dialog>
      <Dialog
        className={classes.root}
        maxWidth="md"
        open={newtcopen}
        onClose={handleClose}
      >
        <DialogContent>
          <Grid container direction="column" spacing={1}>
            <Grid item md={12}>
              <Card>
                <CardHeader color="rose">
                  <h4 className={classes.cardTitleWhite}>Add TestCase Data</h4>
                  <p className={classes.cardCategoryWhite}>
                    Enter DDR Payload details
                  </p>
                </CardHeader>
              </Card>
              <Grid
                container
                direction="row"
                className={classes.mainContent}
                spacing={1}
              >
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    label="TestCase Name"
                    id="testMetaDataName"
                    inputRef={testMetaDataNameRef}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={10}>
                  <Grid container direction="row" spacing={1}>
                    <Grid item xs={4}>
                      <InputLabel id="demo-select-small">
                        Environment Type
                      </InputLabel>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={envType}
                        label="Environment Type"
                        onChange={(e) => {
                          setEnvType(e.target.value);
                        }}
                      >
                        {Environment.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid item xs={4}>
                      <InputLabel id="demo-select-small">Model Name</InputLabel>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={modelName}
                        label="Model Name"
                        onChange={(e) => {
                          setModelName(e.target.value);
                        }}
                      >
                        {Model.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid item xs={4}>
                      <InputLabel id="demo-select-small">Test Type</InputLabel>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={testType}
                        label="Test Type"
                        onChange={(e) => {
                          setTestType(e.target.value);
                        }}
                      >
                        {TestType.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    margin="dense"
                    multiline
                    rows="2"
                    variant="outlined"
                    label="Test Detail"
                    id="testDetail"
                    inputRef={testDetailRef}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    label="Created By"
                    id="createdBy"
                    inputRef={createdByRef}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    margin="dense"
                    multiline
                    rows="5"
                    variant="outlined"
                    label="Paste the DDR here"
                    id="jsonPayload"
                    inputRef={jsonPayloadRef}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={handleSave} color="rose">
              Save
            </Button>
            <Button onClick={handleClose} color="white">
              Close
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Dialog
        className={classes.root}
        maxWidth="sm"
        open={newtplanopen}
        onClose={handleClose}
      >
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <Card>
                <CardHeader color="rose">
                  <h4 className={classes.cardTitleWhite}>
                    Test Execution Plan
                  </h4>
                  <p className={classes.cardCategoryWhite}>
                    Enter Test plan details to execute {memoizedtcIds.length}{" "}
                    cases
                  </p>
                </CardHeader>
              </Card>
              <Grid
                container
                direction="row"
                className={classes.mainContent}
                spacing={1}
              >
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    label="Test Task Name"
                    id="testTaskName"
                    inputRef={testTaskNameRef}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={handleExecute} color="rose">
              Execute
            </Button>
            <Button onClick={handleClose} color="white">
              Close
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Dialog
        className={classes.root}
        maxWidth="sm"
        open={newtsuiteopen}
        onClose={handleClose}
      >
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <Card>
                <CardHeader color="rose">
                  <h4 className={classes.cardTitleWhite}>Create Test Suite</h4>
                  <p className={classes.cardCategoryWhite}>
                    Enter Test Suite details to add {memoizedsuitetcIds.length}{" "}
                    cases
                  </p>
                </CardHeader>
              </Card>
              <Grid
                container
                direction="row"
                className={classes.mainContent}
                spacing={1}
              >
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    label="Test Suite Name"
                    id="testSuiteName"
                    inputRef={testSuiteNameRef}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Grid container direction="row" spacing={1}>
                    <Grid item xs={6}>
                      <InputLabel id="demo-select-small">
                        Environment Type
                      </InputLabel>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={testSuiteEnvType}
                        label="Environment Type"
                        onChange={(e) => {
                          setTestSuiteEnvType(e.target.value);
                        }}
                      >
                        {testSuiteEnvironment.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid item xs={6}>
                      <InputLabel id="demo-select-small">Test Type</InputLabel>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={testType}
                        label="Test Type"
                        onChange={(e) => {
                          setTestType(e.target.value);
                        }}
                      >
                        {TestType.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={handleTSuiteCreate} color="rose">
              Create
            </Button>
            <Button onClick={handleClose} color="white">
              Close
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Dialog
        className={classes.root}
        maxWidth="sm"
        open={existingtsuiteopen}
        onClose={handleClose}
      >
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <Card>
                <CardHeader color="rose">
                  <h4 className={classes.cardTitleWhite}>Update Test Suite</h4>
                  <p className={classes.cardCategoryWhite}>
                    Choose the Test Suite to add {memoizedsuitetcIds.length}{" "}
                    cases
                  </p>
                </CardHeader>
              </Card>
              <Grid
                container
                direction="row"
                className={classes.mainContent}
                spacing={1}
              >
                <Grid item xs={10}>
                  <InputLabel id="demo-select-small">Test Suites</InputLabel>
                  <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={selectedtSuite}
                    label="Test Suites"
                    onChange={(e) => {
                      setSelectedtSuite(e.target.value);
                    }}
                  >
                    {configTestSuite.map((option) => (
                      <MenuItem key={option.id} value={option}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={updateTSuite} color="rose">
              Update
            </Button>
            <Button onClick={handleClose} color="white">
              Close
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Snack
        autoHideDuration={6000}
        open={snackopen}
        ContentProps={{
          "aria-describedby": "message-id",
        }}
        // message={<span id="message-id"> TestTask Initiated </span>}
        onClose={() => setSnackOpen(false)}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity={snackcolor}
          sx={{ width: "100%" }}
        >
          {snackmessage}
        </Alert>
      </Snack>
    </div>
  );
}
