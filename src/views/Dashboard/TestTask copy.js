import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
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
import Warning from "components/Typography/Warning";
import Danger from "components/Typography/Danger";
import Muted from "components/Typography/Muted";
import Green from "components/Typography/Green";

import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from "@mui/material";

import Snack from "@material-ui/core/Snackbar";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@material-ui/core/TextField";
//import { Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import Checkbox from "@material-ui/core/Checkbox";
import ListItem from "@material-ui/core/ListItem";

import Switch from "@material-ui/core/Switch";

import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const defaultMaterialTheme = createTheme();
//const useStyles = makeStyles(styles);
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
      lineHeight: "1.0",
    },
    "& .MuiOutlinedInput-input": {
      fontSize: "0.8rem",
      padding: "4.5px 14px",
      marginTop: "5px",
      marginBottom: "5px",
      lineHeight: "1.5",
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'transparent', // Hide border by default
      },
      '&:hover fieldset': {
        borderColor: 'gray', // Show border on hover
      },
      '&.Mui-focused fieldset': {
        borderColor: 'darkgray', // Show border when focused
      },
      '&:hover': {
        backgroundColor: '#F5F5F5', // Light gray background on hover
      },
      '&.Mui-focused': {
        backgroundColor: '#E0E0E0', // Darker gray background when focused
      },
    },
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));


export default function TestTask() {
  const classes = useStyles();

  const [testTasks, setTestTasks] = React.useState([]);
  const [tTask, setTTask] = React.useState("");
  const [tCase, settCase] = React.useState([]);
  const [tTaskColor, setTTaskColor] = React.useState("primary");

  const [Environment, setEnvironment] = React.useState([]);
  const [ConfigTestType, setConfigTestType] = React.useState([]);
  const [ConfigTestSuite, setConfigTestSuite] = React.useState([]);

  const columns = [
    {
      title: "Name",
      field: "name",
      cellStyle: { whiteSpace: "nowrap" },
    },
    {
      title: "Model",
      field: "modelName",
      cellStyle: { whiteSpace: "nowrap" },
    },
    {
      title: "Status",
      field: "status",
      cellStyle: { whiteSpace: "nowrap" },
    },
    {
      title: "TxnId",
      field: "txnId",
    },
    {
      title: "Response CSV",
      field: "ddResponseStatus",
      cellStyle: { whiteSpace: "nowrap" },
      render: (row) => (
        <a
          href="#pablo"
          onClick={(e) => {
            e.preventDefault();
            handleCSVDownload(row.txnId);
          }}
        >
          {row.ddResponseStatus}
        </a>
      ),
    },
    {
      title: "StartDate",
      field: "startDate",
      cellStyle: { whiteSpace: "nowrap" },
    },
    {
      title: "EndDate",
      field: "endDate",
      cellStyle: { whiteSpace: "nowrap" },
    },
    {
      title: "ExecutionTime",
      field: "executionTime",
      cellStyle: { whiteSpace: "nowrap" },
    },
  ];

  const [options, setoptions] = React.useState({
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
      whiteSpace: "nowrap",
    },
    searchFieldStyle: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  });

  React.useEffect(() => {
    findAllTestTasks();
    findAllEnvTypes();
    findAllTestTypes();
    findAllTestSuites();

    const intervalId = setInterval(() => {
      applyTestTasksFilters(envType, testType, suiteName, baseline);
      console.log("Reloading testTasks");
    }, 60000);

    return () => {
      clearInterval(intervalId);
      setTestTasks([]);
    };
  }, []);

  const findAllTestTasks = () => {
    fetch(process.env.REACT_APP_API_URL + "/testTask/findAll")
      .then((data) => data.json())
      .then((data) => setTestTasks(data))
      .catch((err) => {
        console.log(err.message);
      });
  };

  const findAllEnvTypes = () => {
    fetch(process.env.REACT_APP_API_URL + "/config/environment")
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        setEnvironment(["MIX", ...data]);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const findAllTestTypes = () => {
    fetch(process.env.REACT_APP_API_URL + "/config/testType")
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        setConfigTestType([...data]);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const findAllTestSuites = () => {
    fetch(process.env.REACT_APP_API_URL + "/testSuite/findAll")
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setConfigTestSuite(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleCSVDownload = (txnId) => {
    const sasUrl =
      "https://omnshodevsaeastus2.blob.core.windows.net/panel-on-demand/" +
      txnId +
      ".csv?sp=r&st=2023-05-05T14:00:19Z&se=2024-05-05T22:00:19Z&sv=2022-11-02&sr=c&sig=qYXzE3%2BcWuGg9ejldFs8EX6Dm38hu%2FLgMk0pdeN4w7g%3D";

    setSnackMessage("Downloading " + txnId + ".csv");
    setSnackColor("success");
    setSnackOpen(true);

    window.location.href = sasUrl;
  };

  const [newtreportopen, setNewtreportopen] = React.useState(false);

  const testReportNameRef = React.useRef(null);

  const featureAggEngVMRef = React.useRef(null);
  const [
    isFeatureAggEngVMDisabled,
    setIsFeatureAggEngVMDisabled,
  ] = React.useState(true);

  const toggleFeatureAggEngVMDisabled = () => {
    setIsFeatureAggEngVMDisabled(!isFeatureAggEngVMDisabled);
  };

  const [
    newcomptplanopenFeatureVM,
    setNewComptplanopenFeatureVM,
  ] = React.useState(false);
  const [testTaskId, setTestTaskId] = React.useState("");

  const handleClose = () => {
    setNewtreportopen(false);
    setTTask("");
    settCase([]);
    setNewComptplanopenFeatureVM(false);
    setIsFeatureAggEngVMDisabled(true);
  };

  const handleExecute = () => {
    setNewComptplanopenFeatureVM(false);
    setIsFeatureAggEngVMDisabled(true);

    let testExecutionRequest = {
      name: testReportNameRef.current?.value,
      id: testTaskId,
      featureAggengVM: featureAggEngVMRef.current?.value,
    };
    comparisonRunTestTask(testExecutionRequest);
  };

  const [snackopen, setSnackOpen] = React.useState(false);
  const [snackmessage, setSnackMessage] = React.useState("");
  const [snackcolor, setSnackColor] = React.useState("");

  const handleNewtreportClickOpen = (id) => {
    fetch(process.env.REACT_APP_API_URL + "/testTask/" + id)
      .then((data) => data.json())
      .then((data) => {
        setTTask(data);
        if (data.status == "COMPLETED") {
          setTTaskColor("success");
        } else if (data.status == "INPROGRESS") {
          setTTaskColor("warning");
        } else if (data.status == "STOPPED") {
          setTTaskColor("danger");
        }

        fetch(process.env.REACT_APP_API_URL + "/testTask/testCase/" + id)
          .then((data) => data.json())
          .then((data) => {
            settCase(data);
            setNewtreportopen(true);
          })
          .catch((err) => {
            console.log(err.message);
          });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const rerunTestTask = async (payload) => {
    await fetch(process.env.REACT_APP_API_URL + "/testTask/rerunTestTask", {
      method: "POST",
      body: payload,
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
      .then((res) => {
        console.log(res);
        setSnackMessage("Rerun " + res.name + " initiated");
        setSnackColor("success");
        setSnackOpen(true);
        setTestTasks([res, ...testTasks]);
      })
      .catch((err) => {
        console.log(err.message);
        setSnackMessage("Error while executing Testcases " + err.message);
        setSnackColor("error");
      });
  };

  const comparisonRunTestTask = async (payload) => {
    await fetch(
      process.env.REACT_APP_API_URL + "/testTask/comparisonRunTestTask",
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
        setSnackMessage("Comparison Run " + res.name + " initiated");
        setSnackColor("success");
        setSnackOpen(true);
        setTestTasks([res, ...testTasks]);
        setTestTaskId(null);
      })
      .catch((err) => {
        console.log(err.message);
        setSnackMessage("Error while executing Testcases " + err.message);
        setSnackColor("error");
      });
  };

  const deleteTestTask = (payload) => {
    setSnackMessage("Deleting test task " + payload.name);
    setSnackColor("success");
    setSnackOpen(true);
    fetch(process.env.REACT_APP_API_URL + "/testTask/" + payload.id, {
      method: "DELETE",
    }).then(() => {
      findAllTestTasks();
    });
  };

  const stopTestTask = (payload) => {
    setSnackMessage("Stopping test task " + payload.name);
    setSnackColor("success");
    setSnackOpen(true);
    fetch(
      process.env.REACT_APP_API_URL + "/testTask/stopTestTask/" + payload.id,
      {
        method: "DELETE",
      }
    ).then(() => {
      findAllTestTasks();
    });
  };

  const [envType, setEnvType] = useState([]);
  const [testType, setTestType] = useState([]);
  const [suiteName, setSuiteName] = useState([]);
  const [baseline, setBaseline] = useState(false);

  const handleEnvTypeChange = (event) => {
    const newValue = event.target.value;
    setEnvType(newValue);
    applyTestTasksFilters(newValue, testType, suiteName, baseline);
  };
  
  const handleTestTypeChange = (event) => {
    const newValue = event.target.value;
    setTestType(newValue);
    applyTestTasksFilters(envType, newValue, suiteName, baseline);
  };
  
  const handleSuiteNameChange = (event) => {
    const newValue = event.target.value;
    setSuiteName(newValue);
    applyTestTasksFilters(envType, testType, newValue, baseline);
  };
  
  const handleBaselineChange = (event) => {
    const newValue = event.target.checked;
    setBaseline(newValue);
    applyTestTasksFilters(envType, testType, suiteName, newValue);
  };
  
  const applyTestTasksFilters = (envTypes, testTypes, suiteNames, baselineValue) => {
    let testTaskFiltersRequest = {
      envTypes: envTypes,
      testTypes: testTypes,
      suiteNames: suiteNames,
      baseline: baselineValue === false ? null : baselineValue,
    };
    findWithFilters(testTaskFiltersRequest);
    //console.log(testTaskFiltersRequest);
  };
  

  const findWithFilters = async (payload) => {
    await fetch(
      process.env.REACT_APP_API_URL + "/testTask/findWithFilters",
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
        setTestTasks(res);
      })
      .catch((err) => {
        console.log(err.message);
        setSnackMessage("Error while applying filters " + err.message);
        setSnackColor("error");
      });
  };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={2}>
          <FormControlLabel
            control={
              <Checkbox
                color="default"
                checked={baseline}
                onChange={handleBaselineChange}
                name="baseline"
              />
            }
            label="Filter BaseLine"
          />
        </Grid>
        <Grid item xs={2}>
          <FormControl className={classes.formControl} variant="outlined">
            <InputLabel id="envType-label" shrink={envType.length > 0}>
              EnvType
            </InputLabel>
            <Select
              labelId="envType-label"
              id="envType"
              multiple
              value={envType}
              onChange={handleEnvTypeChange}
              renderValue={(selected) =>
                selected.length === 0
                  ? ""
                  : selected.length === 1
                  ? selected[0]
                  : // : `${selected[0]},...`
                  selected.length === 2
                  ? `${selected[0]},${selected[1]}`
                  : `${selected[0]},${selected[1]},...`
              }
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
        <Grid item xs={2}>
          <FormControl className={classes.formControl} variant="outlined">
            <InputLabel id="testType-label" shrink={testType.length > 0}>
              TestType
            </InputLabel>
            <Select
              labelId="testType-label"
              id="testType"
              multiple
              value={testType}
              onChange={handleTestTypeChange}
              renderValue={(selected) =>
                selected.length === 0
                  ? ""
                  : selected.length === 1
                  ? selected[0]
                  : `${selected[0]},...`
              }
            >
              {ConfigTestType.map(
                (option) =>
                  option && (
                    <ListItem
                      button
                      key={option}
                      value={option}
                      selected={testType.includes(option)}
                      style={
                        testType.includes(option)
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
        <Grid item xs={2}>
          <FormControl className={classes.formControl} variant="outlined">
            <InputLabel id="suiteName-label" shrink={suiteName.length > 0}>
              TestSuite
            </InputLabel>
            <Select
              labelId="suiteName-label"
              id="suiteName"
              multiple
              value={suiteName}
              onChange={handleSuiteNameChange}
              renderValue={(selected) =>
                selected.length === 0
                  ? ""
                  : selected.length === 1
                  ? selected[0]
                  : `${selected[0]},...`
              }
            >
              {ConfigTestSuite.map(
                (option) =>
                  option && (
                    <ListItem
                      button
                      key={option.id}
                      value={option.name}
                      selected={suiteName.includes(option.name)}
                      style={
                        suiteName.includes(option.name)
                          ? { backgroundColor: "#2D6DF6" }
                          : {}
                      }
                    >
                      {option.name}
                    </ListItem>
                  )
              )}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <GridContainer>
        {testTasks.map((task) => (
          <GridItem key={task.id} xs={12} sm={6} md={3}>
            {(() => {
              if (task.status == "COMPLETED" && !task.baseline) {
                return (
                  <Card>
                    <CardHeader color="green" stats icon>
                      <CardIcon color="green">
                        <Icon>corporate_fare</Icon>
                      </CardIcon>
                      <p className={classes.cardCategory}>
                        {task.name} <br></br> {task.suiteName}
                      </p>
                      <h6 className={classes.cardTitle}>{task.status}</h6>
                    </CardHeader>
                    <CardFooter stats>
                      <div className={classes.stats}>
                        <a
                          href="#pablo"
                          onClick={(e) => {
                            e.preventDefault();
                            handleNewtreportClickOpen(task.id);
                          }}
                        >
                          <Green>
                            <Tooltip title="View results">
                              <Icon>auto_awesome_motion</Icon>
                            </Tooltip>
                          </Green>
                        </a>
                        <a
                          href="#pablo"
                          onClick={(e) => {
                            e.preventDefault();

                            rerunTestTask(task.id);
                          }}
                        >
                          <Green>
                            <Tooltip title="Rerun Test Task">
                              <Icon>replay</Icon>
                            </Tooltip>
                          </Green>
                        </a>
                        <a
                          href="#pablo"
                          onClick={(e) => {
                            e.preventDefault();
                            setTestTaskId(task.id);
                            setNewComptplanopenFeatureVM(true);
                          }}
                        >
                          <Green>
                            <Tooltip title="Perform Comparison Run">
                              <Icon>compare</Icon>
                            </Tooltip>
                          </Green>
                        </a>
                        <a
                          href="#pablo"
                          onClick={(e) => {
                            e.preventDefault();
                            deleteTestTask(task);
                          }}
                        >
                          <Green>
                            <Tooltip title="Delete Test Task">
                              <Icon>delete</Icon>
                            </Tooltip>
                          </Green>
                        </a>
                      </div>
                    </CardFooter>
                  </Card>
                );
              } else if (task.status == "INPROGRESS") {
                return (
                  <Card>
                    <CardHeader color="warning" stats icon>
                      <CardIcon color="warning">
                        <Icon>corporate_fare</Icon>
                      </CardIcon>
                      <p className={classes.cardCategory}>
                        {task.name} <br></br> {task.suiteName}
                      </p>
                      <h6 className={classes.cardTitle}>{task.status}</h6>
                    </CardHeader>
                    <CardFooter stats>
                      <div className={classes.stats}>
                        <a
                          href="#pablo"
                          onClick={(e) => {
                            e.preventDefault();
                            handleNewtreportClickOpen(task.id);
                          }}
                        >
                          <Warning>
                            <Tooltip title="View results">
                              <Icon>auto_awesome_motion</Icon>
                            </Tooltip>
                          </Warning>
                        </a>
                        <a
                          href="#pablo"
                          onClick={(e) => {
                            e.preventDefault();
                            stopTestTask(task);
                          }}
                        >
                          <Warning>
                            <Tooltip title="Stop Test Task">
                              <Icon>stop</Icon>
                            </Tooltip>
                          </Warning>
                        </a>
                        <a
                          href="#pablo"
                          onClick={(e) => {
                            e.preventDefault();
                            rerunTestTask(task.id);
                          }}
                        >
                          <Warning>
                            <Tooltip title="Rerun Test Task">
                              <Icon>replay</Icon>
                            </Tooltip>
                          </Warning>
                        </a>
                      </div>
                    </CardFooter>
                  </Card>
                );
              } else if (task.status == "STOPPED") {
                return (
                  <Card>
                    <CardHeader color="danger" stats icon>
                      <CardIcon color="danger">
                        <Icon>corporate_fare</Icon>
                      </CardIcon>
                      <p className={classes.cardCategory}>
                        {task.name} <br></br> {task.suiteName}
                      </p>
                      <h6 className={classes.cardTitle}>{task.status}</h6>
                    </CardHeader>
                    <CardFooter stats>
                      <div className={classes.stats}>
                        <a
                          href="#pablo"
                          onClick={(e) => {
                            e.preventDefault();
                            handleNewtreportClickOpen(task.id);
                          }}
                        >
                          <Danger>
                            <Tooltip title="View results">
                              <Icon>auto_awesome_motion</Icon>
                            </Tooltip>
                          </Danger>
                        </a>
                        <a
                          href="#pablo"
                          onClick={(e) => {
                            e.preventDefault();

                            rerunTestTask(task.id);
                          }}
                        >
                          <Danger>
                            <Tooltip title="Rerun Test Task">
                              <Icon>replay</Icon>
                            </Tooltip>
                          </Danger>
                        </a>
                        <a
                          href="#pablo"
                          onClick={(e) => {
                            e.preventDefault();
                            deleteTestTask(task);
                          }}
                        >
                          <Danger>
                            <Tooltip title="Delete Test Task">
                              <Icon>delete</Icon>
                            </Tooltip>
                          </Danger>
                        </a>
                      </div>
                    </CardFooter>
                  </Card>
                );
              } else if (task.status == "COMPLETED" && task.baseline) {
                return (
                  <Card>
                    <CardHeader color="success" stats icon>
                      <CardIcon color="success">
                        <Icon>corporate_fare</Icon>
                      </CardIcon>
                      <p className={classes.cardCategory}>
                        {task.name} <br></br> {task.suiteName}
                      </p>
                      <h6 className={classes.cardTitle}>{task.status}</h6>
                    </CardHeader>
                    <CardFooter stats>
                      <div className={classes.stats}>
                        <a
                          href="#pablo"
                          onClick={(e) => {
                            e.preventDefault();
                            handleNewtreportClickOpen(task.id);
                          }}
                        >
                          <Success>
                            <Tooltip title="View results">
                              <Icon>auto_awesome_motion</Icon>
                            </Tooltip>
                          </Success>
                        </a>
                        <a
                          href="#pablo"
                          onClick={(e) => {
                            e.preventDefault();

                            rerunTestTask(task.id);
                          }}
                        >
                          <Success>
                            <Tooltip title="Rerun Test Task">
                              <Icon>replay</Icon>
                            </Tooltip>
                          </Success>
                        </a>
                        <a
                          href="#pablo"
                          onClick={(e) => {
                            e.preventDefault();
                            setTestTaskId(task.id);
                            setNewComptplanopenFeatureVM(true);
                            //  comparisonRunTestTask(task.id, task.type);
                          }}
                        >
                          <Success>
                            <Tooltip title="Perform Comparison Run">
                              <Icon>compare</Icon>
                            </Tooltip>
                          </Success>
                        </a>
                        <a
                          href="#pablo"
                          onClick={(e) => {
                            e.preventDefault();
                            deleteTestTask(task);
                          }}
                        >
                          <Success>
                            <Tooltip title="Delete Test Task">
                              <Icon>delete</Icon>
                            </Tooltip>
                          </Success>
                        </a>
                      </div>
                    </CardFooter>
                  </Card>
                );
              }

              return null;
            })()}
          </GridItem>
        ))}
      </GridContainer>

      <Dialog
        className={classes.root}
        maxWidth="xl"
        open={newtreportopen}
        onClose={handleClose}
        // fullScreen
      >
        <DialogContent>
          <Grid container>
            <Grid item xl={12}>
              <Card>
                <CardHeader color={tTaskColor}>
                  <h3 className={classes.cardTitleWhite}>{tTask.name}</h3>
                  <p className={classes.cardCategoryWhite}>
                    StartDate:{tTask.startDate} <br />
                    EndDate:{tTask.endDate}
                  </p>
                </CardHeader>

                <ThemeProvider theme={defaultMaterialTheme}>
                  <MaterialTable
                    title=""
                    columns={columns}
                    data={tCase}
                    options={options}
                    style={{
                      marginBottom: "0",
                      width: "100%",
                      maxWidth: "100%",
                      backgroundColor: "transparent",
                      borderSpacing: "0",
                      borderCollapse: "collapse",
                    }}
                  />
                </ThemeProvider>
              </Card>
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={handleClose} color={tTaskColor}>
              Close
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Dialog
        className={classes.root}
        maxWidth="lg"
        open={newcomptplanopenFeatureVM}
        onClose={handleClose}
      >
        <DialogContent>
          <Grid container>
            <Grid item md={12}>
              <Card>
                <CardHeader color="success">
                  <h4 className={classes.cardTitleWhite}>
                    Comparison Run Execution Plan
                  </h4>
                  <p className={classes.cardCategoryWhite}>
                    Enter Test plan details to execute cases
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
                    label="Test Report Name"
                    id="testReportName"
                    inputRef={testReportNameRef}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <FormControlLabel
                  control={
                    <Switch
                      color="default"
                      onChange={toggleFeatureAggEngVMDisabled}
                      name="toggleFeatureDOAVMIP"
                    />
                  }
                  label="Enable Feature Agg Engine VM"
                />
                <Grid item xs={12}>
                  {!isFeatureAggEngVMDisabled && (
                    <TextField
                      fullWidth
                      margin="dense"
                      variant="outlined"
                      label="Feature Agg Engine VM"
                      id="featureAggEngVM"
                      inputRef={featureAggEngVMRef}
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={handleExecute} color="success">
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
