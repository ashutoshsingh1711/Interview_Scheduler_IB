import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Modal,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Add, Delete, Edit } from "@material-ui/icons";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import { BASE_URI, ROUTES } from "../utils";
import { CreateInterviewStepper } from "./CreateInterviewStepper";
import ModifyInterviewModal from "./ModifyInterviewModal";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginBottom: 10,
  },
  content: {
    position: "relative",
  },
  button: {
    flex: 1,
    paddingTop: "2rem",
    paddingBottom: "2rem",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default function MeetingsList() {
  const classes = useStyles();
  let { interviewList, loading, fetchInterviews } = useAppContext();

  useEffect(() => {
    fetchInterviews();
  }, []);

  const [isAddNewInterviewModalOpen, setIsAddNewInterviewModalOpen] =
    useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    id: 1,
    duration: "30",
    interviewee: "ashu@ashu.com",
    interviewer: "ashu@ashu.com",
    start_time: new Date(),
  });

  const handleModalClose = () => {
    setIsAddNewInterviewModalOpen(false);
  };
  const handleModifyModalClose = () => {
    setIsModifyModalOpen(false);
  };

  const deleteInterview = async (id) => {
    try {
      await axios.post(`${BASE_URI}${ROUTES.delete}?id=${id}`);
    } catch (e) {
      console.log(e);
    }
    fetchInterviews();
  };

  return (
    <>
      <Modal
        className={classes.modal}
        open={isAddNewInterviewModalOpen}
        onClose={handleModalClose}
      >
        <span>
          <CreateInterviewStepper
            setIsAddNewInterviewModalOpen={setIsAddNewInterviewModalOpen}
          />
        </span>
      </Modal>
      <Modal
        className={classes.modal}
        open={isModifyModalOpen}
        onClose={handleModifyModalClose}
      >
        <ModifyInterviewModal
          setIsModifyModalOpen={setIsModifyModalOpen}
          data={modalData}
        />
      </Modal>
      <div className="bg-gray-300 p-4">
        <h1 className="font-bold text-center mb-4">
          Interviews Scheduled for Today
        </h1>
        <Card className={classes.root}>
          <div className="add-new-interview">
            <Button
              onClick={() => setIsAddNewInterviewModalOpen(true)}
              className={classes.button}
            >
              <Add />
            </Button>
          </div>
        </Card>
        {loading && (
          <div className="text-center">
            <CircularProgress />
          </div>
        )}
        {interviewList?.map(
          ({ id, duration, interviewee, interviewer, start_time }) => {
            let _date = new Date(parseInt(start_time))
              .toString()
              .split("GMT")[0];
            let fromNow = moment(
              new Date(parseInt(start_time)).toString()
            ).fromNow();
            return (
              <Card className={classes.root} key={id}>
                <CardContent className={classes.content}>
                  <div className="flex flex-col content-around interview-card">
                    <h6 className="font-bold">{`Interviewer ${interviewer}`}</h6>
                    <h6 className="font-bold">{`Interviewee ${interviewee}`}</h6>
                    <h6 className="font-bold">{`${_date}`}</h6>
                    <h6 className="font-bold">{`${fromNow}`}</h6>
                  </div>
                  <h6 className="duration-text-container bg-gray-200">
                    Duration (min)
                  </h6>
                  <div className="duration-container bg-gray-200">
                    {duration}
                  </div>
                  <button
                    onClick={() => deleteInterview(id)}
                    className="delete-container bg-red-200"
                  >
                    <Delete />
                  </button>
                  <button
                    onClick={() => {
                      setIsModifyModalOpen(true);
                      setModalData({
                        id,
                        duration,
                        interviewee,
                        interviewer,
                        start_time,
                      });
                    }}
                    className="edit-container bg-blue-200"
                  >
                    <Edit />
                  </button>
                </CardContent>
              </Card>
            );
          }
        )}
      </div>
    </>
  );
}
