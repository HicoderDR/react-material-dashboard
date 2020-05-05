import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import AssignmentIcon from '@material-ui/icons/Assignment';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import Icon from '@material-ui/core/Icon';
import {httpGet,httpPost} from '../request';
import {NotFound as NotFoundView} from '../../views';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));
const Cardboard = () => {
  const [alertopen,setalertopen]=useState(false);
  const [alertstyle,setalertstyle]=useState("success");
  const [alertcontent,setalertcontent]=useState("alert");


  const [title, settitle] = useState("标题加载中...");
  const [content,setcontent]= useState("正文加载中...");
  const [version,setversion]= useState(0);
  const [open, setOpen] = React.useState(false);

  const handleAlertopen= () => {
    setalertopen(true);
  };
  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setalertopen(false);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const TitleChange = (event) => {
    settitle(event.target.value);
  };
  const ContentChange = (event) => {
    setcontent(event.target.value);
  };
  useEffect(() => {
    getboard()
  },[version]);
  const getboard =() =>{
    httpGet("/api/admin/board")
    .then(resp=>resp.json())
    .then(resp=>{
      //console.log(resp)
      settitle(resp.data.title)
      setcontent(resp.data.content)
      setversion(resp.data.version)
      setalertstyle("success")
      setalertcontent("数据获取成功！")
      setalertopen(true)
    }).catch(e =>{
      setalertstyle("error")
      setalertcontent("数据获取失败！")
      setalertopen(true)
    })
  }
  const setboard =() =>{
    setOpen(false);
    httpPost("/api/admin/board",{
      title:title,
      content:content
    }).then(resp=>resp.json())
    .then(resp=>{
      console.log(resp)
      setalertstyle("success")
      setalertcontent("修改请求成功！")
      setalertopen(true)
    }).catch(e =>{
      setalertstyle("error")
      setalertcontent("修改请求失败！")
      setalertopen(true)
    })
  }

  return(
    <Card>
      <CardContent>
        <AssignmentIcon></AssignmentIcon>
        {"  公告板"}
        <br /> 
        <br />
        <Typography variant="h4" component="p">
          {title}
        </Typography>
        <br />
        <Typography   color="textSecondary">
          {content}
        </Typography>
      </CardContent>
      <CardActions>
        <Button 
          size="medium" 
          variant="outlined" 
          color="primary"
          onClick={handleClickOpen}
        >
          修改公告
        </Button>
      </CardActions>

      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">修改公告</DialogTitle>
        <DialogContent>

          <TextField
            autoFocus
            id="title"
            margin="dense"
            value={title}
            onChange={TitleChange}
            label="公告标题"
            fullWidth
          />
          <TextField
            value={content}
            onChange={ContentChange}
            multiline
            margin="dense"
            label="公告正文(字数限制255)"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            取消
          </Button>
          <Button onClick={setboard} color="primary">
            发布
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={alertopen} autoHideDuration={3000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertstyle}>
          {alertcontent}
        </Alert>
      </Snackbar>
    </Card>
  )
}

const Dashboard = () => {
  const classes = useStyles();
  if(sessionStorage.token) 
  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          lg={8}
          md={12}
          xl={9}
          xs={12}
        >
          <Cardboard />
        </Grid>
      </Grid>
    </div>
  );
  else return (<NotFoundView></NotFoundView>)
};

export default Dashboard;
