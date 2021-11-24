import DateFnsUtils from "@date-io/date-fns";
import { CircularProgress, Input } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../contexts/AppContext";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: "#fff",
    padding: "2rem",
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const getSteps = () => {
  return [
    "What time?",
    "Duration?",
    "Select Interviewer and Interviewee",
    "Finish",
  ];
};

export function CreateInterviewStepper({ setIsAddNewInterviewModalOpen }) {
  const classes = useStyles();
  const { date, scheduleNewInterview, isUserAvailable } = useAppContext();
  const [activeStep, setActiveStep] = useState(0);
  const [duration, setDuration] = useState("");
  const [interviewerErr, setInterviewerErr] = useState(false);
  const [intervieweeErr, setIntervieweeErr] = useState(false);
  const [intervieweeEmail, setIntervieweeEmail] = useState("");
  const [p_interviewerEmail, setP_interviewerEmail] = useState("");
  const [s_interviewersEmail, setS_interviewersEmail] = useState("");
  const [error, setError] = useState(false);
  const steps = getSteps();
  const [selectedDate, setSelectedDate] = useState(date);

  const handleDurationChange = (duration) => {
    let re = /^\d+$/g;
    setDuration(duration);
    if (!re.test(duration)) {
      setError(true);
      return;
    }
    setError(false);
  };

  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <div className="text-center">
            <KeyboardTimePicker
              margin="normal"
              id="time-picker"
              value={selectedDate}
              onChange={setSelectedDate}
            />
          </div>
        );
      case 1:
        return (
          <div className="text-center">
            <h6 className="font-bold">Duration in minutes...</h6>
            <Input
              value={duration}
              placeholder={"30"}
              onChange={(e) => handleDurationChange(e.target.value)}
              error={error}
            />
          </div>
        );
      case 2:
        return (
          <div className="text-center">
            <div className=" flex flex-row">
              <h6 className="font-bold mr-4">Interviewee Email</h6>
              <Input
                value={intervieweeEmail}
                placeholder={"ashu@ashu.com"}
                onChange={(e) => setIntervieweeEmail(e.target.value)}
                error={intervieweeErr}
              />
            </div>
            <div className=" flex flex-row">
              <h6 className="font-bold mr-4">Primary Interviewer Email</h6>
              <Input
                value={p_interviewerEmail}
                placeholder={"ashu@ashu.com"}
                onChange={(e) => setP_interviewerEmail(e.target.value)}
                error={interviewerErr}
              />
            </div>
            <div className=" flex flex-row">
              <h6 className="font-bold mr-4">Shadow Interviewer Email</h6>
              <Input
                value={s_interviewersEmail}
                placeholder={"ashu@ashu.com"}
                onChange={(e) => setS_interviewersEmail(e.target.value)}
                error={interviewerErr}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="text-center">
            <CircularProgress />
          </div>
        );
      default:
        return "Unknown stepIndex";
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const validateUsers = async () => {
    let start_time = parseInt(moment(selectedDate).format("x"));
    let end_time = start_time + parseInt(duration) * 60000; // convert minutes to ms for timestamp,
    // let intervieweeStatus = await isUserAvailable({
    //   start_time,
    //   end_time,
    //   email: intervieweeEmail,
    //   user_role: 'interviewee',
    // });
    // let interviewerStatus = await isUserAvailable({
    //   start_time,
    //   end_time,
    //   email: interviewerEmail,
    //   user_role: 'interviewer',
    // });

    // if (interviewerStatus.status == 'ok' && intervieweeStatus.status == 'ok') {
    let newInterviewDetails = {
      date: selectedDate.toString(),
      start_time,
      end_time,
      s_interviewersEmail,
      p_interviewerEmail,
      duration,
      interviewee: intervieweeEmail,
    };
    await scheduleNewInterview(newInterviewDetails);
    setActiveStep(0);
    setIsAddNewInterviewModalOpen(false);
    // } else {
    //   if (interviewerStatus.status == 'err') setInterviewerErr(true);
    //   if (intervieweeStatus.status == 'err') setIntervieweeErr(true);
    //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
    // }
  };

  useEffect(() => {
    if (activeStep === steps.length - 1) {
      setIntervieweeErr(false);
      setInterviewerErr(false);
      validateUsers();
    }
  }, [activeStep]);

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className={classes.root}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step, _id) => (
            <Step key={_id}>
              <StepLabel>{step}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div>
          {activeStep !== steps.length && (
            <div className="text-center">
              <Typography className={classes.instructions}>
                {getStepContent(activeStep)}
              </Typography>
              {activeStep !== steps.length - 1 && (
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.backButton}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    disabled={error}
                  >
                    {activeStep === steps.length - 2 ? "Finish" : "Next"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </MuiPickersUtilsProvider>
    </div>
  );
}
