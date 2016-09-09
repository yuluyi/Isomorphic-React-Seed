import React from 'react';
import style from './index.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

function Loading() {
  return (
      <div className={style.loading} >
        <div className={style.UFO} />
        <div className={style.light} />
        <div className={style['D-sir']} />
        <div>加载中...</div>
      </div>
    )
}

export default withStyles(style)(Loading);
