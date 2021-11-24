const validateUser = (
  start_time,
  end_time,
  interview_start_time,
  interview_end_time
) => {
  if (start_time <= interview_start_time && end_time >= interview_end_time) {
    return false;
  } else if (
    start_time >= interview_start_time &&
    end_time <= interview_end_time
  ) {
    return false;
  } else if (
    start_time <= interview_start_time &&
    end_time <= interview_end_time &&
    end_time >= interview_start_time
  ) {
    return false;
  } else if (
    start_time >= interview_start_time &&
    start_time <= interview_end_time &&
    end_time >= interview_end_time
  ) {
    return false;
  }
};

module.exports = {
  validateUser,
};
