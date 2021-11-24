const util = require("util");
const express = require("express");
const mysql = require("mysql");
const moment = require("moment");
const router = express.Router();
const { scheduleEmail } = require("../handlers/EmailScheduler");

const connectDB = require("../database/index.js");
const EmailScheduler = require("../handlers/EmailScheduler");
const mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "interview_scheduler",
});
connectDB.connect(mysqlConnection);

const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);

router.get("/getInterviews", async (req, res) => {
  let interviewsList = await query("select * from Interview;");
  let { date } = req.query;
  let currentInterviewList = [];
  for (var list_ind = 0; list_ind < interviewsList.length; list_ind++) {
    interview = await JSON.parse(JSON.stringify(interviewsList[list_ind]));
    let curr_date = new Date(parseInt(interview.start_time))
      .toISOString()
      .split("T")[0];
    if (curr_date == date) {
      let curr_people = await query(
        `select * from userinterviewroleschema where i_id= ${interview.id};`
      );
      console.log(curr_people);
      for (var temp = 0; temp < curr_people.length; temp++) {
        let person = JSON.parse(JSON.stringify(curr_people[temp]));
        if (person.uid != person.i_id) {
          if (person.role == "p_interviewer") {
            let p_person = await query(
              `select * from user where id= ${person.uid};`
            );
            interview.p_interviewer = p_person[0].email;
            interview.interviewer = p_person[0].email;
          } else {
            let s_person = await query(
              `select * from user where id= ${person.uid};`
            );
            interview.s_interviewers = s_person[0].email;
          }
        } else {
          let i_person = await query(
            `select * from user where id= ${person.uid};`
          );
          interview.interviewee = i_person[0].email;
        }
      }
      console.log(interview);
      currentInterviewList.push({ ...interview });
    }
  }
  res.json(currentInterviewList);
});

router.get("/is-user-available", async (req, res) => {
  let { start_time, end_time, email, user_role } = req.query;
  let user = await query(`select * from User where email="${email}"`);
  if (user[0]?.user_role !== user_role || user?.length == 0) {
    res.json({
      status: "err",
    });
  }
  start_time = parseInt(start_time);
  end_time = parseInt(end_time);
  let userInterviewsList = await query(
    `select * from Interview where ${user_role}="${email}"`
  );

  userInterviewsList.map((interview) => {
    let interview_start_time = parseInt(interview.start_time);
    let interview_end_time = parseInt(interview.end_time);

    if (start_time <= interview_start_time && end_time >= interview_end_time) {
      res.json({
        status: "err",
      });
    } else if (
      start_time >= interview_start_time &&
      end_time <= interview_end_time
    ) {
      res.json({
        status: "err",
      });
    } else if (
      start_time <= interview_start_time &&
      end_time <= interview_end_time &&
      end_time >= interview_start_time
    ) {
      res.json({
        status: "err",
      });
    } else if (
      start_time >= interview_start_time &&
      start_time <= interview_end_time &&
      end_time >= interview_end_time
    ) {
      res.json({
        status: "err",
      });
    }
  });

  res.json({
    status: "ok",
  });
});

router.get("/is-user-modification-available", async (req, res) => {
  let { start_time, end_time, email, user_role, id } = req.query;
  console.log(email);

  start_time = parseInt(start_time);
  end_time = parseInt(end_time);

  let userInterviewsList = await query(
    `select * from Interview where p_interviewer="${email}" OR s_interviewers="${email}" OR interviewee ="${email}"; `
  );

  let newuserInterviewsList = [];
  userInterviewsList.forEach((interview) => {
    if (interview.id != id) newuserInterviewsList.push(interview);
  });
  var flag = 0;
  console.log(newuserInterviewsList);
  console.log("hello");
  if (newuserInterviewsList.length == 0) {
    res.json({
      status: "ok",
    });
  } else {
    for (var temp = 0; temp < newuserInterviewsList.length; temp++) {
      let interview = JSON.parse(JSON.stringify(newuserInterviewsList[temp]));
      let interview_start_time = parseInt(interview.start_time);
      let interview_end_time = parseInt(interview.end_time);

      if (
        start_time <= interview_start_time &&
        end_time >= interview_end_time
      ) {
        flag = 1;
        res.json({
          status: "err",
        });
      } else if (
        start_time >= interview_start_time &&
        end_time <= interview_end_time
      ) {
        flag = 1;
        res.json({
          status: "err",
        });
      } else if (
        start_time <= interview_start_time &&
        end_time <= interview_end_time &&
        end_time >= interview_start_time
      ) {
        flag = 1;
        res.json({
          status: "err",
        });
      } else if (
        start_time >= interview_start_time &&
        start_time <= interview_end_time &&
        end_time >= interview_end_time
      ) {
        flag = 1;
        res.json({
          status: "err",
        });
      }
    }
    if (flag == 0) {
      res.send({
        status: "ok",
      });
    }
  }
});
router.post("/addInterview", async (req, res) => {
  let {
    start_time,
    end_time,
    s_interviewers,
    p_interviewer,
    interviewee,
    duration,
  } = req.body;
  console.log({
    start_time,
    end_time,
    s_interviewers,
    p_interviewer,
    interviewee,
    duration,
  });

  let s_interviewerList = s_interviewers.split(",");

  s_interviewerList;

  let interviewInsert = await query(
    `insert into Interview(start_time, end_time, s_interviewers, p_interviewer, interviewee, duration) values("${start_time}", "${end_time}", "${s_interviewerList[0]}", "${p_interviewer}" ,"${interviewee}", "${duration}")`
  );

  // interviewee insert
  let userInsert = await query(
    `insert into User(email) values("${interviewee}")`
  );

  await query(
    `insert into UserInterviewRoleSchema(role, uid, i_id) values("interviewee", ${userInsert.insertId}, ${interviewInsert.insertId})`
  );

  //list of shadow interviewer insert
  s_interviewerList.map(async (s_interviewers) => {
    userInsert = await query(
      `insert into User(email) values("${s_interviewers}")`
    );
    await query(
      `insert into UserInterviewRoleSchema(role, uid, i_id) values("s_interviewers", ${userInsert.insertId}, ${interviewInsert.insertId})`
    );
  });

  let primary_interviewr = await query(
    `insert into User(email) values("${p_interviewer}")`
  );
  await query(
    `insert into UserInterviewRoleSchema(role, uid, i_id) values("p_interviewer", ${primary_interviewr.insertId}, ${interviewInsert.insertId})`
  );

  res.sendStatus(200);
});

router.post("/delete", async (req, res) => {
  try {
    let { id } = req.query;
    await query(`delete from Interview where id= ${id}`);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(503);
  }
});

router.post("/modify", async (req, res) => {
  try {
    let { start_time, end_time, duration, interviewee, interviewer, id } =
      req.body;
    await query(
      `update Interview set start_time="${start_time}", end_time="${end_time}", duration="${duration}", interviewee="${interviewee}", p_interviewer="${interviewer}" where id=${id}`
    );
    scheduleEmail(interviewee, new Date(parseInt(start_time)));
    scheduleEmail(interviewer, new Date(parseInt(start_time)));
    res.sendStatus(200);
  } catch (err) {
    console.log("update failed", err);
    res.sendStatus(503);
  }
});

module.exports = router;
