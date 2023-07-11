import React, { useEffect } from "react";
import ReactDOM from "react-dom";

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

import Grid from "@material-ui/core/Grid";

import { green, lightGreen } from "@material-ui/core/colors";

import Snack from "@material-ui/core/Snackbar";
import MuiAlert from "@mui/material/Alert";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const fileType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

const defaultMaterialTheme = createTheme();

let options = {
  // filtering: true,
  // selection: true,
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
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "center",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "center",
  },
  variant: "menu",
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

export default function ComparisonExecution() {
  const classes = useStyles();

  const { useState } = React;

  //const [columns, setColumns] = useState([
  const columns = [
    {
      title: "Initial Run",
      field: "preTestTaskName",
      cellStyle: { width: 100, maxWidth: 100 },
      headerStyle: { width: 100, maxWidth: 100 },
      render: (row) => (
        <a
          href="#pablo"
          onClick={(e) => {
            e.preventDefault();
            handleNewtreportClickOpen(row.preTestTaskId);
          }}
        >
          {row.preTestTaskName}
        </a>
      ),
    },
    {
      title: "Comparison Run",
      field: "postTestTaskName",
      width: "20%",
      render: (row) => (
        <a
          href="#pablo"
          onClick={(e) => {
            e.preventDefault();
            handleNewtreportClickOpen(row.postTestTaskId);
          }}
        >
          {row.postTestTaskName}
        </a>
      ),
    },
    {
      title: "Status",
      field: "status",
      width: "20%",
      render: (row) => (
        <a
          href="#pablo"
          onClick={(e) => {
            e.preventDefault();
            console.log(row);
            setCompareTaskName(row.postTestTaskName);
            handleComparisonReportClickOpen(row.id);
          }}
        >
          {row.status}
        </a>
      ),
    },
  ];

  const executionColumns = [
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
      title: "Env",
      field: "envType",
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
            console.log(row);
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

  const tcCompareColumns = [
    {
      title: "Name",
      field: "name",
      cellStyle: { width: 100, maxWidth: 100 },
      headerStyle: { width: 100, maxWidth: 100 },
    },
    {
      title: "Pre Exe TxnId",
      field: "preTxnId",
      width: "20%",
      render: (row) => (
        <a
          href="#pablo"
          onClick={(e) => {
            e.preventDefault();
            handleCSVDownload(row.preTxnId);
          }}
        >
          {row.preTxnId}
        </a>
      ),
    },
    {
      title: "Post Exe TxnId",
      field: "postTxnId",
      width: "20%",
      render: (row) => (
        <a
          href="#pablo"
          onClick={(e) => {
            e.preventDefault();
            handleCSVDownload(row.postTxnId);
          }}
        >
          {row.postTxnId}
        </a>
      ),
    },
    {
      title: "Differences",
      field: "differences",
      render: (row) => (
        <a
          href="#pablo"
          onClick={(e) => {
            e.preventDefault();
            console.log(row);
            exportToExcel(row.name, row);
          }}
        >
          {row.differences}
        </a>
      ),
    },
  ];

  const [data, setData] = useState([]);

  React.useEffect(() => {
    findAllCompareTestTasks();

    setInterval(() => {
      findAllCompareTestTasks();
      console.log("Reloading ComparisonExecution");
    }, 60000);
    return () => {
      setData([]); // This worked for me()
    };
  }, []);

  const findAllCompareTestTasks = () => {
    fetch(process.env.REACT_APP_API_URL + "/compareTestTasks/findAll")
      .then((data) => data.json())
      .then((data) => setData(data))
      .catch((err) => {
        console.log(err.message);
      });
  };

  const [tTask, setTTask] = React.useState("");
  const [tCase, settCase] = React.useState([]);
  const [tTaskColor, setTTaskColor] = React.useState("primary");

  const [newtreportopen, setNewtreportopen] = React.useState(false);

  const handleClose = () => {
    setNewtreportopen(false);
    setTTask("");
    settCase([]);
    setNewtcasecomparereportopen(false);
    settCaseCompare([]);
  };

  const handleNewtreportClickOpen = (id) => {
    fetch(process.env.REACT_APP_API_URL + "/testTask/" + id)
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || response.statusText);
        }
        return response.json();
      })
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
          .then(async (response) => {
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(errorText || response.statusText);
            }
            return response.json();
          })
          .then((data) => {
            settCase(data);
            setNewtreportopen(true);
          })
          .catch((err) => {
            console.log(err.message);
            setSnackMessage("Error while opening " + err.message);
            setSnackColor("error");
            setSnackOpen(true);
          });
      })
      .catch((err) => {
        console.log(err.message);
        setSnackMessage("Error while opening " + err.message);
        setSnackColor("error");
        setSnackOpen(true);
      });
  };

  const [tCaseCompare, settCaseCompare] = React.useState([]);

  const [
    newtcasecomparereportopen,
    setNewtcasecomparereportopen,
  ] = React.useState(false);
  const [compareTaskName, setCompareTaskName] = React.useState("");

  const handleComparisonReportClickOpen = (id) => {
    fetch(
      process.env.REACT_APP_API_URL + "/compareTestTasks/compareTestTask/" + id
    )
      .then((data) => data.json())
      .then((data) => {
        settCaseCompare(data);
        console.log(data);
        setNewtcasecomparereportopen(true);
      });
  };

  const [snackopen, setSnackOpen] = React.useState(false);
  const [snackmessage, setSnackMessage] = React.useState("");
  const [snackcolor, setSnackColor] = React.useState("");

  const exportToExcel = async (fileName, row) => {
    console.log(row.id);
    fetch(
      process.env.REACT_APP_API_URL +
        "/compareTestTasks/downloadCSVdifference/" +
        row.id
    )
      .then((data) => data.json())
      .then((excelListData) => {
        // Convert list of JSON objects to Excel sheet
        const ws = XLSX.utils.json_to_sheet(excelListData);

        // Create new workbook and add the worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "data");

        // Generate Excel file and save
        const excelBuffer = XLSX.write(wb, {
          bookType: "xlsx",
          type: "array",
        });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, "Difference_" + fileName + fileExtension);

        setSnackMessage("Downloading differences");
        setSnackColor("success");
        setSnackOpen(true);
      })
      .catch((err) => {
        console.log(err.message);
        setSnackMessage("Error while downloading parquet " + err.message);
        setSnackColor("error");
        setSnackOpen(true);
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

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>
                Comparison Execution Status
              </h4>
              <p className={classes.cardCategoryWhite}>
                List of Comparison Executions
              </p>
            </CardHeader>

            <ThemeProvider theme={defaultMaterialTheme}>
              <MaterialTable
                title=""
                columns={columns}
                data={data}
                options={options}
                //  tableRef={tableRef}

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
                        fetch(
                          process.env.REACT_APP_API_URL +
                            "/compareTestTasks/" +
                            oldData.id,
                          {
                            method: "DELETE",
                          }
                        ).then(() => {
                          findAllCompareTestTasks();
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
                    columns={executionColumns}
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
        open={newtcasecomparereportopen}
        onClose={handleClose}
        // fullScreen
      >
        <DialogContent>
          <Grid container>
            <Grid item md={12}>
              <Card>
                <CardHeader color="success">
                  <h3 className={classes.cardTitleWhite}>{compareTaskName}</h3>
                </CardHeader>

                <ThemeProvider theme={defaultMaterialTheme}>
                  <MaterialTable
                    title=""
                    columns={tcCompareColumns}
                    data={tCaseCompare}
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
            <Button onClick={handleClose} color="success">
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
