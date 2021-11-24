import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import React from 'react';
export function Header() {
  return (
    <AppBar position='static' color='default'>
      <Toolbar>
        <IconButton edge='start' color='inherit' aria-label='menu'>
          <Menu />
        </IconButton>
        <Typography variant='h6'>Interview Scheduler</Typography>
      </Toolbar>
    </AppBar>
  );
}
