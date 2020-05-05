import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import { UsersToolbar, UsersTable } from './components';
import mockData from './data';
import { httpGet } from 'views/request';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import {NotFound as NotFoundView} from '../../views';
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const TermList = () => {
  const classes = useStyles();

  const [alertopen,setalertopen]=useState(false);
  const [alertstyle,setalertstyle]=useState("success");
  const [alertcontent,setalertcontent]=useState("alert");

  const [allusers,setalluser]=useState(mockData);
  const [users,setusers] = useState(mockData);
  const [v,setv]=useState(0);

  const getUsers=()=>{
    httpGet('/api/admin/allterm')
    .then(resp=>resp.json())
    .then(resp=>{
      setalertstyle("success")
      setalertcontent("数据获取成功！")
      setalertopen(true)
      setusers(resp.data)
      setalluser(resp.data)
      return resp
    }).catch(e=>{
      setalertstyle("error")
      setalertcontent("数据获取失败！")
      setalertopen(true)
    })
  }
  useEffect(() => {
    getUsers()
  },[v]);
  const handleAlertopen= () => {
    setalertopen(true);
  };
  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setalertopen(false);
  };

  function search(txt){
    var newlist=[]
    //console.log(allusers[0].userName.indexOf(txt))
    for (var i in allusers){
      var str=allusers[i].userName
      if(str.indexOf(txt)!= -1){
        newlist.push(allusers[i]);
      }
    }
    //console.log(newlist);
    setusers(newlist);
  }
  if(sessionStorage.token) 
  return (
    <div className={classes.root}>
      <UsersToolbar users={users} search={search}/>
      <div className={classes.content}>
        <UsersTable users={users} />
      </div>
      <Snackbar open={alertopen} autoHideDuration={3000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertstyle}>
          {alertcontent}
        </Alert>
      </Snackbar>
    </div>
  );
  else return (<NotFoundView></NotFoundView>)
};

export default TermList;
