import React from 'react';
import InterestedItems from './interested-items';
import classes from './interested-items-box.module.css';

const InterestedItemsBox = ({ items }) => {
  return (
    <section className={classes.container}>
      <div className={classes.header}>
        <h2 className={classes.title}>
          <span className={classes.star}>★</span> 관심 종목
					<span className={classes.counts}>2개</span>
        </h2>
        <div className={classes.actions}>
          <span className={classes.action}>편집</span>
          <span className={classes.action}>추가</span>
        </div>
      </div>
      <div className={classes.itemsList}>
        <InterestedItems items={items} />
      </div>
    </section>
  );
};

export default InterestedItemsBox;
