import React, { useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { CSVLink, CSVDownload } from "react-csv";
import { Notifications, Password } from './components';
import {NotFound as NotFoundView} from '../../views';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { httpGet } from 'views/request';
import Paper from '@material-ui/core/Paper';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    width:'100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const Settings = () => {
  const [users,setusers]=useState([])
  const [terms,setterms]=useState([])
  const [v,setv] =useState(0)

  const classes = useStyles();
  const [alertopen,setalertopen]=useState(false);
  const [alertstyle,setalertstyle]=useState("success");
  const [alertcontent,setalertcontent]=useState("alert");

  const userheaders=[
    {label:"用户ID",key:"userID"},
    {label:"手机号",key:"userName"},
    {label:"余值",key:"balance"},
    {label:"已使用",key:"used"},
    {label:"上次购买优惠时间",key:"icon"},
  ]
  const termheaders=[
    {label:"用户ID",key:"userID"},
    {label:"手机号",key:"userName"},
    {label:"限免截止日期",key:"endDate"},
  ]
  const getUsers=()=>{
    httpGet('/api/admin/alluser')
    .then(resp=>resp.json())
    .then(resp=>{
      setalertstyle("success")
      setalertcontent("数据获取成功！正在处理csv...")
      setalertopen(true)
      const data=resp.data
      var newlist=[]
      for(var i in data){
        newlist.push({
          userID:data[i].userID,
          userName:data[i].userName,
          balance:data[i].balance,
          used:data[i].used,
          icon:data[i].icon,
        })
      }
      setusers(newlist)
    }).catch(e=>{
      setalertstyle("error")
      setalertcontent("数据获取失败！")
      setalertopen(true)
    })
  }
  const getTermUsers=()=>{
    httpGet('/api/admin/allterm')
    .then(resp=>resp.json())
    .then(resp=>{
      setalertstyle("success")
      setalertcontent("数据获取成功！正在处理csv...")
      setalertopen(true)
      const data=resp.data
      var newlist=[]
      for(var i in data){
        newlist.push({
          userID:data[i].userID,
          userName:data[i].userName,
          endDate:data[i].endDate,
        })
      }
      setterms(newlist)
    }).catch(e=>{
      setalertstyle("error")
      setalertcontent("数据获取失败！")
      setalertopen(true)
    })
  }

  useEffect(() => {
    getUsers()
    getTermUsers()
  },[v]);
  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setalertopen(false);
  };
  if(sessionStorage.token) 
  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
      >
        <ExpansionPanel style={{width:'100%'}}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>总用户表导出</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              这里可以导出总的用户表，为csv格式，使用excel自行处理。
            </Typography>
            <Typography>
              <CSVLink data={users} headers={userheaders}>
                下载用户表
              </CSVLink>
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel style={{width:'100%'}}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>限免用户表导出</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              这里可以导出限免用户表，为csv格式，使用excel自行处理。
            </Typography>
            <Typography>
              <CSVLink data={terms} headers={termheaders}>
                下载限免用户表
              </CSVLink>
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel style={{width:'100%'}}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>图片导出ReadMe</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              1.首先使用ssh登陆服务器
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails>
            <Typography>
              2.cd 到/home 目录下（切勿乱动这里的文件）
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails>
            <Typography>
              3.执行 zip -r myfile.zip scrimg/ 为打包原图
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails>
            <Typography>
              4.执行 zip -r myfile.zip img/ 为打包结果图
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails>
            <Typography>
              5.下载myfile.zip
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails>
            <Typography>
              6.下载完后删除压缩包rm myfile.zip
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel style={{width:'100%'}}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>公告异常</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              1.首先使用ssh登陆服务器
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails>
            <Typography>
              2.cd 到/home 目录下（切勿乱动这里的文件）
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails>
            <Typography>
              3.查看目录下board.json，打开验证是否有问题，如仍有问题，重启APP服务端
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel style={{width:'100%'}}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>使用说明PDF异常</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              1.首先使用ssh登陆服务器
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails>
            <Typography>
              2.cd 到/home 目录下（切勿乱动这里的文件）
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails>
            <Typography>
              3.查看目录下pdf文件，打开验证是否有问题，如仍有问题，重启APP服务端
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel style={{width:'100%'}}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>钢筋AI服务端异常(python)</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              1.首先使用ssh登陆服务器
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails>
            <Typography>
              2.screen -ls显示目前已有的screen,找到algoserver
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails>
            <Typography>
              3.screen -r -d algoserver 登陆screen
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails>
            <Typography>
              4.查看有无问题，ctrl+C关闭后重启：在/root/APP下python server.py
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails>
            <Typography>
              5.关闭窗口即可
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel style={{width:'100%'}}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>钢筋APP服务端异常(java)</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              1.首先使用ssh登陆服务器
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails>
            <Typography>
              2.netstat -lnp|grep 80 找到运行在8081端口的进程pid
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails>
            <Typography>
              3.kill -9 THAT_PID
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails>
            <Typography>
              4.重启：在/root/APP下nohup ./startapp.sh &
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails>
            <Typography>
              5.关闭窗口即可
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel style={{width:'100%'}}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>钢筋网页管理端异常(java)</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              1.首先使用ssh登陆服务器
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails>
            <Typography>
              2.screen -ls 找到frontserver
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails>
            <Typography>
              3.screen -r -d frontserver
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails>
            <Typography>
              4.Ctrl+C后重启：在/root/APP下 serve -s front_dist
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails>
            <Typography>
              5.关闭窗口即可
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel style={{width:'100%'}}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>直接操作数据库</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              1.首先使用ssh-root登陆服务器
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails>
            <Typography>
              2.终端键入mysql进入数据库操作界面
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails>
            <Typography>
              3.选定数据库use steelcounter;
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails>
            <Typography>
              4.例如给每个用户增加余额3次
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails>
            <Typography>
              5.update user set balance=balance+3;
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails>
            <Typography>
              备注：请慎重，建议先在测试数据库中进行模拟，确认无误后先停止8081端口的后台服务(防止备份间隙用户充值等情况)，然后备份数据库，最后进行操作。
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails>
            <Typography>
              测试数据库的构建：请使用本机mysql创建steelcounter数据库，后执行steelcounter-test.sql
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel style={{width:'100%'}}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>手动备份数据库</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              1.首先使用ssh-root登陆服务器
            </Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelDetails>
            <Typography>
              2.备份命令mysqldump -h 127.0.0.1 -P 3306 -u counter -p PASSWORD steelcounter > bak.sql;
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Grid>
      
      <Snackbar open={alertopen} autoHideDuration={3000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertstyle}>
          {alertcontent}
        </Alert>
      </Snackbar>
    </div>
  );
  else return (<NotFoundView></NotFoundView>)
};

export default Settings;
