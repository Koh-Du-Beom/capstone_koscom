import React from 'react';
import Image from 'next/image';
import classes from './technical-table-identifier.module.css';

export default function TechnicalTableIdentifier({ index, company_name, exchange_code}) {
  
	const getExchangeLogo = (code) => {
    switch (code) {
      case 'KOSDAQ':
        return '/svgs/kosdaq.svg'; // KOSDAQ 로고 경로
      case 'KOSPI':
        return '/svgs/kospi.svg'; // KOSPI 로고 경로
      default:
        return '/svgs/krx.svg'; // 기본 로고 경로
    }
  }; //로고도 변경하기

  return (
    <div className={classes.identifierContainer}>
      <span className={classes.index}>{index}</span>
      <div className={classes.infoContainer}>
        <span className={classes.companyName}>{company_name}</span>
      </div>
    </div>
  );
}
