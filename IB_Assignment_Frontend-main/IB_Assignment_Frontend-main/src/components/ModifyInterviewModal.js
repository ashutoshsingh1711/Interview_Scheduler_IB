import DateFnsUtils from "@date-io/date-fns";
import { Input } from "@material-ui/core";
import {
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import moment from "moment";
import React, { useState } from "react";
import { useAppContext } from "../contexts/AppContext";

export default function ModifyInterviewModal({
  data: { id, duration, interviewee, interviewer, star_time },
  setIsModifyModalOpen,
}) {
  let {
    date,
    modifyNewInterview,
    isUserModificationAvailable,
    fetchInterviews,
  } = useAppContext();

  const [_duration, setDuration] = useState(duration);
  const [interviewerErr, setInterviewerErr] = useState(false);
  const [intervieweeErr, setIntervieweeErr] = useState(false);
  const [intervieweeEmail, setIntervieweeEmail] = useState(interviewee);
  const [interviewerEmail, setInterviewerEmail] = useState(interviewer);
  const [error, setError] = useState(false);
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

  const validateUsers = async () => {
    let start_time = parseInt(moment(selectedDate).format("x"));
    let end_time = start_time + parseInt(_duration) * 60000; // convert minutes to ms for timestamp,
    let intervieweeStatus = await isUserModificationAvailable({
      start_time,
      end_time,
      email: intervieweeEmail,
      user_role: "interviewee",
      id,
    });
    let interviewerStatus = await isUserModificationAvailable({
      start_time,
      end_time,
      email: interviewerEmail,
      user_role: "interviewer",
      id,
    });

    if (
      interviewerStatus.status === "ok" &&
      intervieweeStatus.status === "ok"
    ) {
      let newInterviewDetails = {
        date: date.toString(),
        start_time,
        end_time,
        interviewer: interviewerEmail,
        duration: _duration,
        interviewee: intervieweeEmail,
        id,
      };
      await modifyNewInterview(newInterviewDetails);
      fetchInterviews();
      setIsModifyModalOpen(false);
    } else {
      if (interviewerStatus.status === "err") setInterviewerErr(true);
      if (intervieweeStatus.status === "err") setIntervieweeErr(true);
    }
  };

  const handleModify = async () => {
    await validateUsers();
  };

  return (
    <>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div className="bg-gray-200 p-10">
          <div className="text-center">
            <div className=" flex flex-row">
              <h6 className="font-bold mr-4">Interviewee Email</h6>
              <Input
                value={intervieweeEmail}
                placeholder={interviewee}
                onChange={(e) => setIntervieweeEmail(e.target.value)}
                error={intervieweeErr}
              />
            </div>
            <div className=" flex flex-row">
              <h6 className="font-bold mr-4">Interviewer Email</h6>
              <Input
                value={interviewerEmail}
                placeholder={interviewer}
                onChange={(e) => setInterviewerEmail(e.target.value)}
                error={interviewerErr}
              />
            </div>
          </div>
          <div className="text-center">
            <h6 className="font-bold">Duration in minutes...</h6>
            <Input
              value={_duration}
              placeholder={duration}
              onChange={(e) => handleDurationChange(e.target.value)}
              error={error}
            />
          </div>
          <div className="text-center">
            <KeyboardTimePicker
              margin="normal"
              id="time-picker"
              value={selectedDate}
              onChange={setSelectedDate}
            />
          </div>
          <button
            className="bg-gray-300 p-4 mx-auto mt-2"
            onClick={handleModify}
          >
            Modify
          </button>
        </div>
      </MuiPickersUtilsProvider>
    </>
  );
}
