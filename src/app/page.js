'use client'
import InterestedItemsBox from '@/components/interested-items/interested-items-box';
import { useState } from 'react';
import classes from './page.module.css';
import InterestedNewsBox from '@/components/interested-news/interested-news-box';

export default function Home() {

  return (
    <main className={classes.container}>
      <div className={classes.leftSection}>
        <InterestedItemsBox />
      </div>
      
      <div className={classes.divider}></div>

      <div className={classes.rightSection}>
        
				<InterestedNewsBox />
      </div>
    </main>
  );
}
