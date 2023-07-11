import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import DateRange from "@material-ui/icons/DateRange";
import CloudOffIcon from "@material-ui/icons/CloudOff";
import CloudQueueIcon from "@material-ui/icons/CloudQueue";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardFooter from "components/Card/CardFooter.js";
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import Tooltip from "@mui/material/Tooltip";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const useStyles = makeStyles(styles);

export default function DBHealth() {
  const classes = useStyles();

  const [health, setHealth] = React.useState([]);

  React.useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/health/db")
      .then((data) => data.json())
      .then((data) => setHealth(data))
      .catch((err) => {
        console.log(err.message);
      });

    setInterval(() => {
      fetchMetrics();
      console.log("Reloading db health");
    }, 50000);
    return () => {
      setHealth([]); // This worked for me
    };
  }, []);

  const fetchMetrics = () => {
    fetch(process.env.REACT_APP_API_URL + "/health/db")
      .then((data) => data.json())
      .then((data) => setHealth(data))
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div>
      {/* <ExportExcel excelData={health} fileName={"HealthData"} /> */}
      <GridContainer>
        {health.map((task) => (
          <GridItem key={task.name + task.env} xs={12} sm={6} md={3}>
            {(() => {
              if (task.status == "UP") {
                return (
                  <Card>
                    <CardHeader color="info" stats icon>
                      <CardIcon color="info">
                        <CloudQueueIcon />
                      </CardIcon>
                      <p className={classes.cardCategory}>{task.name}</p>
                      <h6 className={classes.cardTitle}>
                        {task.env} <small> </small>
                      </h6>
                    </CardHeader>
                    <CardFooter stats>
                      <div className={classes.stats}>
                        <Tooltip title="Last Uptime">
                          <DateRange />
                        </Tooltip>
                        {task.lastUpTime}
                      </div>
                    </CardFooter>
                  </Card>
                );
              } else if (task.status == "DOWN") {
                return (
                  <Card>
                    <CardHeader color="danger" stats icon>
                      <CardIcon color="danger">
                        <CloudOffIcon />
                      </CardIcon>
                      <p className={classes.cardCategory}>{task.name}</p>
                      <h6 className={classes.cardTitle}>
                        {task.env} <small> </small>
                      </h6>
                    </CardHeader>
                    <CardFooter stats>
                      <div className={classes.stats}>
                        <Tooltip title="Last Uptime">
                          <DateRange />
                        </Tooltip>
                        {task.lastUpTime}
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
    </div>
  );
}
