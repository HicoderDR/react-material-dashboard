import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Typography, Link } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Footer = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Typography variant="body1">
        &copy;{' '}
        <Link
          component="a"
          href="https://hicoderdr.github.io/"
          target="_blank"
        >
          HicoDR
        </Link>
        . 2020
      </Typography>
      <Typography variant="caption">
        同济大学 
        <Link
          component="a"
          href="https://www.tsmartvib.com/"
          target="_blank"
        >
          工程结构振动舒适度课题组
        </Link>
      </Typography>
    </div>
  );
};

Footer.propTypes = {
  className: PropTypes.string
};

export default Footer;
