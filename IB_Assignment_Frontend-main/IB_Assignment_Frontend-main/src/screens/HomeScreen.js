import DateFnsUtils from '@date-io/date-fns';
import { Typography } from '@material-ui/core';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import React from 'react';
import { MeetingsList } from '../components';
import { useAppContext } from '../contexts';
export default function HomeScreen() {
  const { date, setDate } = useAppContext();

  return (
    <div className='flex flex-row h-full'>
      <div className='flex-initial bg-gray-200 py-2 px-10'>
        <Typography variant='h6'>Select Date</Typography>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            margin='normal'
            id='date-picker-dialog'
            format='dd/MM/yyyy'
            value={date}
            onChange={setDate}
            disablePast
          />
        </MuiPickersUtilsProvider>
      </div>
      <div className='flex-1 bg-gray-300'>
        <MeetingsList />
      </div>
    </div>
  );
}
