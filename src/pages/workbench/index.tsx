import React from 'react';

import CardDefault from '@/commons/assets/images/card-default.jpg';

import styles from './index.module.scss';

const WorkBench = () => {
  console.log(222)
  return (
    <div className={styles.workbench}>
      <div className={styles.card}>
        <div className={styles.cardImage}>
          <img src={CardDefault} />
        </div>
        <div className={styles.cardTitle}>
          酒店管理系统
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardImage}>
          <img src={CardDefault} />
        </div>
        <div className={styles.cardTitle}>
          图书管理系统
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardImage}>
          <img src={CardDefault} />
        </div>
        <div className={styles.cardTitle}>
          前端工具
        </div>
      </div>
    </div>
  );
};

export default WorkBench;