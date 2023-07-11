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
import moment from "moment";

const useStyles = makeStyles(styles);

const statusMapping = {
  "UP": {
    color: "success",
    Icon: CloudQueueIcon
  },
  "DOWN": {
    color: "danger",
    Icon: CloudOffIcon
  },
  "INIT": {
    color: "danger",
    Icon: CloudOffIcon
  }
};

const HealthCard = ({ status, env, lastUptime }) => {
  const classes = useStyles();
  const { color, Icon } = statusMapping[status] || {};

  return (
    <Card>
      <CardHeader color={color} stats icon>
        <CardIcon color={color}>
          <Icon />
        </CardIcon>
        <h6 className={classes.cardTitle}>{env}</h6>
      </CardHeader>
      <CardFooter stats>
        <div className={classes.stats}>
          <Tooltip title="Last UpTime">
            <DateRange />
          </Tooltip>
          {lastUptime ? moment(lastUptime).format("MM/DD/YYYY, h:mm:ss a") : "Not up yet"}
        </div>
      </CardFooter>
    </Card>
  );
};

export default function Health() {
  const [health, setHealth] = React.useState([]);

  React.useEffect(() => {
    const fetchApiHealth = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL + "/health/apps");
        const data = await response.json();
        setHealth(data);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchApiHealth();
    const intervalId = setInterval(fetchApiHealth, 60000);

    return () => {
      clearInterval(intervalId);
      setHealth([]);
    };
  }, []);

  return (
    <GridContainer>
      {health.map((apiHealth) => (
        <GridItem key={apiHealth.env} xs={12} sm={6} md={3}>
          <HealthCard status={apiHealth.status} env={apiHealth.env} lastUptime={apiHealth.lastUptime} />
        </GridItem>
      ))}
    </GridContainer>
  );
}
