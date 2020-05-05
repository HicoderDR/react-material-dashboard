import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider,KeyboardDatePicker} from '@material-ui/pickers';
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination
} from '@material-ui/core';

import { getInitials } from 'helpers';
import { addSyntheticTrailingComment } from 'typescript';
import { httpPost } from 'views/request';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const UsersTable = props => {
  const { className, users, ...rest } = props;

  const classes = useStyles();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const [addtermopen,setAddTermtOpen]=useState(false);
  const [purchaseopen,setPurchaseOpen]=useState(false);
  const [userID,setUserID]=useState(0)
  const [userName,setUserName]=useState("")
  const [adds,setAdds]=useState(200000000)
  const [endDate,setEndDate]=useState(new Date())

  const [alertopen,setalertopen]=useState(false);
  const [alertstyle,setalertstyle]=useState("success");
  const [alertcontent,setalertcontent]=useState("alert");

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setalertopen(false);
  };

  const handleSelectAll = event => {
    const { users } = props;

    let selectedUsers;

    if (event.target.checked) {
      selectedUsers = users.map(user => user.userID);
    } else {
      selectedUsers = [];
    }

    setSelectedUsers(selectedUsers);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedUsers.indexOf(id);
    let newSelectedUsers = [];

    if (selectedIndex === -1) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers, id);
    } else if (selectedIndex === 0) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(1));
    } else if (selectedIndex === selectedUsers.length - 1) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedUsers = newSelectedUsers.concat(
        selectedUsers.slice(0, selectedIndex),
        selectedUsers.slice(selectedIndex + 1)
      );
    }

    setSelectedUsers(newSelectedUsers);
  };

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  const handleAddTermClose = () => {
    setAddTermtOpen(false);
  };
  const handlePurchaseClose = () => {
    setPurchaseOpen(false);
  };
  const handleDateChange = (date) => {
    setEndDate(date);
  };
  const handleAddsChange = (event) =>{
    setAdds(event.target.value)
  }

  const confirmterm=()=>{
    //console.log(userID,userName,adds,endDate)
    var year =endDate.getFullYear();//获取完整的年份(4位,1970-????)
    var month = endDate.getMonth() + 1;//获取当前月份(0-11,0代表1月)
    var day = endDate.getDate();//获取当前日(1-31)
    if (month < 10) {
        month ="0" + month;
    }
    if (day < 10) {
        day ="0" + day;
    }
    var endDateStr = year +"-" + month + "-" + day;
    httpPost("/api/admin/addterm",{
      username:userName,
      adds:adds,
      endDate:endDateStr,
    }).then(resp=>resp.json())
    .then(resp=>{
      console.log(resp)
      if(resp.data=='success') {
        setalertstyle("success")
        setalertcontent("修改成功！")
        setalertopen(true)
      }else{
        setalertstyle("error")
        setalertcontent("修改失败！")
        setalertopen(true)
      }
    }).catch(e=>{
      setalertstyle("error")
      setalertcontent("修改失败！")
      setalertopen(true)
    })
    handleAddTermClose()
  }
  const confirmpurchase=()=>{
    httpPost("/api/admin/purchase",{
      username:userName,
      adds:adds,
    }).then(resp=>resp.json())
    .then(resp=>{
      console.log(resp.data)
      if(resp.data=='success') {
        setalertstyle("success")
        setalertcontent("修改成功！")
        setalertopen(true)
      }else{
        setalertstyle("error")
        setalertcontent("修改失败！")
        setalertopen(true)
      }
    })
    .catch(e=>{
      setalertstyle("error")
      setalertcontent("修改失败！")
      setalertopen(true)
    })
    handlePurchaseClose()
  }
  return (  
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedUsers.length === users.length}
                      color="primary"
                      indeterminate={
                        selectedUsers.length > 0 &&
                        selectedUsers.length < users.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>用户ID</TableCell>
                  <TableCell>手机号</TableCell>
                  <TableCell>截止日期</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.slice(page*rowsPerPage,(page+1)*rowsPerPage).map(function(user){
                  function addterm(user){
                    setUserID(user.userID)
                    setUserName(user.userName)
                    setAdds(200000000)
                    setAddTermtOpen(true)
                  }
                  function purchase(user){
                    setUserID(user.userID)
                    setUserName(user.userName)
                    setAdds(0)
                    setPurchaseOpen(true)
                  }
                  return(
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={user.userID}
                    selected={selectedUsers.indexOf(user.userID) !== -1}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedUsers.indexOf(user.userID) !== -1}
                        color="primary"
                        onChange={event => handleSelectOne(event, user.userID)}
                        value="true"
                      />
                    </TableCell>
                    <TableCell>
                      <div className={classes.nameContainer}>
                        <Typography variant="body1">{user.userID}</Typography>
                      </div>
                    </TableCell>
                    <TableCell>{user.userName}</TableCell>
                    <TableCell>
                      {user.endDate}
                    </TableCell>
                    <TableCell>
                    <Button
                      variant="contained"
                      color="default"
                      startIcon={<AddBoxIcon />}
                      onClick={addterm.bind(this,user)}  
                    >
                      修改限免
                    </Button>
                    <Button
                      variant="contained"
                      color="default"
                      style={{marginLeft:10}}
                      startIcon={<AddBoxIcon />}
                      onClick={purchase.bind(this,user)}  
                    >
                      后台充值
                    </Button>
                    </TableCell>
                  </TableRow>
                )},this)}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={users.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardActions>
      
      <Dialog open={addtermopen} onClose={handleAddTermClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">新增限免用户</DialogTitle>
        <DialogContent>
          <TextField
            disabled
            margin="dense"
            value={userID}
            label="用户ID"
            fullWidth
          />
          <TextField
            disabled
            margin="dense"
            value={userName}
            label="手机号"
            fullWidth
          />
          <TextField
            type="number"
            margin="dense"
            value={adds}
            onChange={handleAddsChange}
            label="增加余值(默认2e8）"
            fullWidth
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="yyyy-MM-dd"
              margin="normal"
              id="date-picker-inline"
              label="选择过期时间"
              value={endDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
          <br />
          慎重操作！过期后余值将被 清零！
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddTermClose} color="primary">
            取消
          </Button>
          <Button onClick={confirmterm} color="primary">
            确认
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={purchaseopen} onClose={handlePurchaseClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">后台充值</DialogTitle>
        <DialogContent>
          <TextField
            disabled
            margin="dense"
            value={userID}
            label="用户ID"
            fullWidth
          />
          <TextField
            disabled
            margin="dense"
            value={userName}
            label="手机号"
            fullWidth
          />
          <TextField
            type="number"
            margin="dense"
            value={adds}
            onChange={handleAddsChange}
            label="增加余值(请保证在0 ~ 1e9之间)"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePurchaseClose} color="primary">
            取消
          </Button>
          <Button onClick={confirmpurchase} color="primary">
            确认
          </Button>
        </DialogActions>
      </Dialog>
    
      <Snackbar open={alertopen} autoHideDuration={3000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertstyle}>
          {alertcontent}
        </Alert>
      </Snackbar>
    </Card>
  );
};

UsersTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};


export default UsersTable;
