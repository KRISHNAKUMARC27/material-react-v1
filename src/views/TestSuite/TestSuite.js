import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardFooter from "components/Card/CardFooter.js";

import Button from "components/CustomButtons/Button.js";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import Grid from "@material-ui/core/Grid";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import Success from "components/Typography/Success";
import Primary from "components/Typography/Primary";
import Rose from "components/Typography/Rose";

import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from "@mui/material";

import Snack from "@material-ui/core/Snackbar";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@material-ui/core/TextField";

//import MenuItem from "@material-ui/core/MenuItem";
//import Select from "@material-ui/core/Select";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import Checkbox from "@material-ui/core/Checkbox";
import ListItem from "@material-ui/core/ListItem";

import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const defaultMaterialTheme = createTheme();
const useStyles = makeStyles((theme) => ({
  ...styles,
  formControl: {
    margin: theme.spacing(1),
    minWidth: 100,
    width: 110,
    "& .MuiInputBase-root": {
      fontSize: "0.8rem",
      lineHeight: "1.2",
    },
    "& .MuiListItem-root": {
      fontSize: "0.8rem",
      lineHeight: "1.2",
    },
    "& .MuiInputLabel-root": {
      padding: "0 0 4px",
      lineHeight: "0.8",
    },
    "& .MuiOutlinedInput-input": {
      fontSize: "0.8rem",
      padding: "4.5px 14px",
      marginTop: "5px",
      marginBottom: "5px",
      lineHeight: "1.5",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "transparent", // Hide border by default
      },
      "&:hover fieldset": {
        borderColor: "gray", // Show border on hover
      },
      "&.Mui-focused fieldset": {
        borderColor: "darkgray", // Show border when focused
      },
      "&:hover": {
        backgroundColor: "#F5F5F5", // Light gray background on hover
      },
      "&.Mui-focused": {
        backgroundColor: "#E0E0E0", // Darker gray background when focused
      },
    },
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

let options = {
  filtering: false,
  sorting: true,
  paging: false,
  exportButton: true,
  tableLayout: "fixed",
  actionsColumnIndex: -1,
  toolbarButtonAlignment: "left",
  rowStyle: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    backgroundColor: "transparent",
    lineHeight: "1.42857143",
    padding: "12px 8px",
    verticalAlign: "middle",
    fontSize: "0.8125rem",
  },
  headerStyle: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: "1.1em",
    fontWeight: "600",
    backgroundColor: "transparent",
  },
  searchFieldStyle: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
};

const colorMap = {
  "SMOKE TEST": {
    headerColor: "success",
    iconColor: "success",
  },
  "REGRESSION TEST": {
    headerColor: "rose",
    iconColor: "rose",
  },
  // add more test types as needed
};

const colorComponentsMapping = {
  success: Success,
  rose: Rose,
};

const tccolumns = [
  {
    title: "Name",
    field: "name",
    cellStyle: { width: 100, maxWidth: 100 },
    headerStyle: { width: 100, maxWidth: 100 },
    width: "40%",
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
  },
  {
    title: "Type",
    field: "testType",
    width: "20%",
  },
  { title: "Created By", field: "createdBy", width: "20%" },
  { title: "Time", field: "testCreated", width: "20%" },
];

export default function TestSuite() {
  const classes = useStyles();

  const [Environment, setEnvironment] = React.useState([]);
  const [ConfigTestType, setConfigTestType] = React.useState([]);

  const [testSuitesList, setTestSuitesList] = React.useState([]);
  const [tSuite, setTSuite] = React.useState("");
  const [testMetaDataList, setTestMetaDataList] = React.useState([]);
  const [tSuiteColor, setTSuiteColor] = React.useState("primary");
  const [envType, setEnvType] = React.useState("");
  const [testType, setTestType] = React.useState("");

  const [testMetaDataIds, setTestMetaDataIds] = React.useState([]);
  // const [ttasktype, setTtaskType] = React.useState("");
  // const [ttaskEnvType, setTtaskEnvType] = React.useState("");
  // const [ttaskSuiteName, setTtaskSuiteName] = React.useState("");
  const [tTaskTSuite, setTastTSuite] = React.useState("");

  const [newtsuiteopen, setNewtsuiteopen] = React.useState(false);
  const [newtplanopen, setNewtplanopen] = React.useState(false);
  const [newtplanopenFeatureVM, setNewtplanopenFeatureVM] = React.useState(
    false
  );
  const [snackopen, setSnackOpen] = React.useState(false);
  const [snackmessage, setSnackMessage] = React.useState("");
  const [snackcolor, setSnackColor] = React.useState("");

  // Initializt new test report plan
  const testTaskNameRef = React.useRef(null);
  const featureAggengVMIPRef = React.useRef(null);

  const [processRate, setProcessRate] = React.useState(4);
  const emailRecipientsRef = React.useRef(null);

  const [msTeamsNotif, setMsTeamsNotif] = React.useState(false);
  const [baseline, setBaseline] = React.useState(false);

  React.useEffect(() => {
    fetchTestSuites();

    fetch(process.env.REACT_APP_API_URL + "/config/environment")
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        setEnvironment(["ALL", "MIX", ...data]);
      })
      .catch((err) => {
        console.log(err.message);
      });

    fetch(process.env.REACT_APP_API_URL + "/config/testType")
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        setConfigTestType([...data]);
      })
      .catch((err) => {
        console.log(err.message);
      });

    return () => {
      setTestSuitesList([]);
    };
  }, []);

  const fetchTestSuites = () => {
    fetch(process.env.REACT_APP_API_URL + "/testSuite/findAll")
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setTestSuitesList(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const fetchByEnvType = (type) => {
    fetch(process.env.REACT_APP_API_URL + "/testSuite/envType/" + type)
      .then((data) => data.json())
      .then((data) => {
        setTestSuitesList(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const fetchByTestType = (type) => {
    fetch(process.env.REACT_APP_API_URL + "/testSuite/testType/" + type)
      .then((data) => data.json())
      .then((data) => {
        setTestSuitesList(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleClose = () => {
    setNewtsuiteopen(false);
    setNewtplanopen(false);
    setNewtplanopenFeatureVM(false);
    setBaseline(false);
  };

  const handleMsTeamsNotif = (event) => {
    setMsTeamsNotif(event.target.checked);
  };

  const handleTestSuiteClickOpen = (suite) => {
    setTSuite(suite);
    if (suite.testType == "SMOKE TEST") {
      setTSuiteColor("success");
    } else {
      setTSuiteColor("rose");
    }

    fetch(
      process.env.REACT_APP_API_URL + "/testSuite/getTestMetaData/" + suite.id
    )
      .then((response) => response.json())
      .then((data) => {
        setTestMetaDataList(data);
        setNewtsuiteopen(true);
      })
      .catch((err) => {
        console.log(err.message);
        setSnackMessage(
          "Error while retrieving. Please check inputs " + err.message
        );
        setSnackColor("error");
        setSnackOpen(true);
      });
  };

  const openTestTask = (testSuite) => {
    setTestMetaDataIds(testSuite.testMetaDataIds);
    // setTtaskType(testSuite.testType);
    // setTtaskEnvType(testSuite.envType);
    // setTtaskSuiteName(testSuite.name);
    setTastTSuite(testSuite);
    setNewtplanopen(true);
  };

  const openTestTaskForFeatureVM = (testSuite) => {
    setTestMetaDataIds(testSuite.testMetaDataIds);
    // setTtaskType(testSuite.testType);
    // setTtaskEnvType(testSuite.envType);
    // setTtaskSuiteName(testSuite.name);
    setTastTSuite(testSuite);
    setNewtplanopenFeatureVM(true);
  };

  const deleteTestSuite = (testSuite) => {
    fetch(process.env.REACT_APP_API_URL + "/testSuite/" + testSuite.id, {
      method: "DELETE",
    }).then(() => {
      fetchTestSuites();
      setSnackMessage(testSuite.name + " Test suite deleted successfully");
      setSnackColor("success");
      setSnackOpen(true);
    });
  };

  const handleTestTaskExecute = () => {
    setNewtplanopen(false);
    setNewtplanopenFeatureVM(false);

    let testExecutionRequest = {
      name: testTaskNameRef.current?.value,
      //  testMetaDataIds: testMetaDataIds,
      processRate: processRate,
      // taskType: ttasktype,
      emailRecipients: emailRecipientsRef.current?.value,
      msTeamsNotif: msTeamsNotif,
      featureAggengVMIP: featureAggengVMIPRef.current?.value,
      baseline: baseline,
      // envType: ttaskEnvType,
      //  suiteName: ttaskSuiteName,
      testSuite: tTaskTSuite,
    };
    console.log(testExecutionRequest);
    executeTestSuite(testExecutionRequest);
  };

  const executeTestSuite = async (payload) => {
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
      .then((res) => {
        console.log(res);
        setSnackMessage(res.name + " started");
        setSnackColor("success");
        setSnackOpen(true);
        setBaseline(false);
        setProcessRate(4);
      })
      .catch((err) => {
        console.log(err.message);
        setSnackMessage("Error while executing Testcases " + err.message);
        setSnackColor("error");
        setSnackOpen(true);
      });
  };

  const ColoredWrapper = ({ color, children }) => {
    const ColorComponent = colorComponentsMapping[color];
    return <ColorComponent>{children}</ColorComponent>;
  };

  const TestSuiteCard = ({
    suite,
    handleClick,
    handleOpenTask,
    handleOpenTaskForFeatureVM,
    handleDelete,
  }) => {
    const { headerColor, iconColor } = colorMap[suite.testType] || {};

    return (
      <Card>
        <CardHeader color={headerColor} stats icon>
          <CardIcon color={iconColor}>
            <Icon>folder_open</Icon>
          </CardIcon>
          <p className={classes.cardCategory}>{suite.name}</p>
        </CardHeader>
        <CardFooter stats>
          <div className={classes.stats}>
            <a
              href="#pablo"
              onClick={(e) => {
                e.preventDefault();
                handleClick(suite);
              }}
            >
              <ColoredWrapper color={iconColor}>
                <Tooltip title="View testcases">
                  <Icon>auto_awesome_motion</Icon>
                </Tooltip>
              </ColoredWrapper>
            </a>
            <a
              href="#pablo"
              onClick={(e) => {
                e.preventDefault();
                handleOpenTask(suite);
              }}
            >
              <ColoredWrapper color={iconColor}>
                <Tooltip title="Execute test suite">
                  <Icon>directionsrun</Icon>
                </Tooltip>
              </ColoredWrapper>
            </a>
            <a
              href="#pablo"
              onClick={(e) => {
                e.preventDefault();
                handleOpenTaskForFeatureVM(suite);
              }}
            >
              <ColoredWrapper color={iconColor}>
                <Tooltip title="Execute test suite on feature VM">
                  <Icon>forward</Icon>
                </Tooltip>
              </ColoredWrapper>
            </a>
            <a
              href="#pablo"
              onClick={(e) => {
                e.preventDefault();
                handleDelete(suite);
              }}
            >
              <ColoredWrapper color={iconColor}>
                <Tooltip title="Delete test suite">
                  <Icon>delete</Icon>
                </Tooltip>
              </ColoredWrapper>
            </a>
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div>
      {/* <Grid item xs={16}> */}
      <Grid container direction="row-reverse" spacing={1}>
        <Grid>
          <FormControl className={classes.formControl} variant="outlined">
            <InputLabel
              id="envType-label"
              shrink={envType != null && envType !== ""}
            >
              EnvType
            </InputLabel>
            <Select
              labelId="envType-label"
              id="envType"
              // multiple
              value={envType}
              onChange={(e) => {
                setEnvType(e.target.value);
                fetchByEnvType(e.target.value);
              }}
              renderValue={(selected) => `${selected}`}
            >
              {Environment.map(
                (option) =>
                  option && (
                    <ListItem
                      button
                      key={option}
                      value={option}
                      selected={envType.includes(option)}
                      style={
                        envType.includes(option)
                          ? { backgroundColor: "#2D6DF6" }
                          : {}
                      }
                    >
                      {option}
                    </ListItem>
                  )
              )}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <GridContainer>
        {testSuitesList.map((suite) => (
          <GridItem key={suite.id} xs={12} sm={6} md={3}>
            <TestSuiteCard
              suite={suite}
              handleClick={handleTestSuiteClickOpen}
              handleOpenTask={openTestTask}
              handleOpenTaskForFeatureVM={openTestTaskForFeatureVM}
              handleDelete={deleteTestSuite}
            />
          </GridItem>
        ))}
      </GridContainer>
      <Dialog
        className={classes.root}
        maxWidth="lg"
        open={newtsuiteopen}
        onClose={handleClose}
      >
        <DialogContent>
          <Grid container>
            <Grid item md={12}>
              <Card>
                <CardHeader color={tSuiteColor}>
                  <h3 className={classes.cardTitleWhite}>{tSuite.name}</h3>
                </CardHeader>

                <ThemeProvider theme={defaultMaterialTheme}>
                  <MaterialTable
                    title=""
                    columns={tccolumns}
                    data={testMetaDataList}
                    options={options}
                    style={{
                      marginBottom: "0",
                      width: "100%",
                      maxWidth: "100%",
                      backgroundColor: "transparent",
                      borderSpacing: "0",
                      borderCollapse: "collapse",
                    }}
                    editable={{
                      onRowDelete: (oldData) =>
                        new Promise((resolve, reject) => {
                          setTimeout(() => {
                            const dataDelete = [...testMetaDataList];
                            const index = oldData.tableData.id;
                            dataDelete.splice(index, 1);
                            //deletetestcases(oldData, dataDelete);
                            fetch(
                              process.env.REACT_APP_API_URL +
                                "/testSuite/deleteTestMetaData/" +
                                tSuite.id +
                                "/" +
                                oldData.id,
                              {
                                method: "DELETE",
                              }
                            ).then(() => {
                              setTestMetaDataList([...dataDelete]);
                            });
                            resolve();
                          }, 1000);
                        }),
                    }}
                  />
                </ThemeProvider>
              </Card>
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={handleClose} color={tSuiteColor}>
              Close
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Dialog
        className={classes.root}
        maxWidth="lg"
        open={newtplanopen}
        onClose={handleClose}
      >
        <DialogContent>
          <Grid container>
            <Grid item md={12}>
              <Card>
                <CardHeader color="success">
                  <h4 className={classes.cardTitleWhite}>
                    Test Execution Plan
                  </h4>
                  <p className={classes.cardCategoryWhite}>
                    Enter Test plan details to execute {testMetaDataIds.length}{" "}
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
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="default"
                        checked={baseline}
                        onChange={(e) => {
                          setBaseline(e.target.checked);
                        }}
                        name="baseline"
                      />
                    }
                    label="Set as BaseLine"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="number"
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    label="Process Rate"
                    id="processRate"
                    onChange={(e) => {
                      setProcessRate(e.target.value);
                    }}
                    required
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      inputProps: { min: 1, max: 8 },
                    }}
                    defaultValue={processRate}
                    onKeyDown={(event) => {
                      if (
                        event.key !== "ArrowUp" &&
                        event.key !== "ArrowDown"
                      ) {
                        event.preventDefault();
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    label="Email Recipients (Separate email-ids with ,)"
                    id="emailRecipients"
                    inputRef={emailRecipientsRef}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="default"
                        checked={msTeamsNotif}
                        onChange={handleMsTeamsNotif}
                        name="msnotif"
                      />
                    }
                    label="Enable Teams Notification"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={handleTestTaskExecute} color="success">
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
        maxWidth="lg"
        open={newtplanopenFeatureVM}
        onClose={handleClose}
      >
        <DialogContent>
          <Grid container>
            <Grid item md={12}>
              <Card>
                <CardHeader color="success">
                  <h4 className={classes.cardTitleWhite}>
                    Test Execution Plan on Feature VM
                  </h4>
                  <p className={classes.cardCategoryWhite}>
                    Enter Test task details to execute {testMetaDataIds.length}{" "}
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
                <Grid item xs={6}>
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
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    label="Feature Aggregation Engine VM Info"
                    id="featureAggengVMIP"
                    inputRef={featureAggengVMIPRef}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="number"
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    label="Process Rate"
                    id="processRate"
                    onChange={(e) => {
                      setProcessRate(e.target.value);
                    }}
                    required
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      inputProps: { min: 1, max: 8 },
                    }}
                    defaultValue={processRate}
                    onKeyDown={(event) => {
                      if (
                        event.key !== "ArrowUp" &&
                        event.key !== "ArrowDown"
                      ) {
                        event.preventDefault();
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    label="Email Recipients (Separate email-ids with ,)"
                    id="emailRecipients"
                    inputRef={emailRecipientsRef}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="default"
                        checked={msTeamsNotif}
                        onChange={handleMsTeamsNotif}
                        name="msnotif"
                      />
                    }
                    label="Enable Teams Notification"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={handleTestTaskExecute} color="success">
              Execute
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
