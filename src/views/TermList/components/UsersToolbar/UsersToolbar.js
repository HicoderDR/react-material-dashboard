import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';

import { SearchInput } from 'components';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  root: {},
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  }
}));

const UsersToolbar = props => {
  const { className,users,search, ...rest } = props;

  const classes = useStyles();
  const [text,settext]=useState("")

  const handleChange=(event,reason)=>{
    
    settext(event.target.value)
  }
  useEffect(() => {
    
  })

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div className={classes.row} >
        <Paper style={{
          padding: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: 220,
          marginRight:100
        }}>
          <InputBase
            placeholder="Search by phonenum"
            value={text}
            onChange={handleChange}
          />
          <IconButton type="submit" onClick={()=>search(text)}>
            <SearchIcon></SearchIcon>
          </IconButton>
        </Paper>
        
        <h3>{"过期后一天将被移出此列表"}</h3>
      </div>
    </div>
  );
};

UsersToolbar.propTypes = {
  className: PropTypes.string
};

export default UsersToolbar;
