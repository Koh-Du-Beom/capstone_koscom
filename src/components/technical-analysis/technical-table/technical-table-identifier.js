
import React from 'react';
import Image from 'next/image';
import classes from './technical-table-identifier.module.css'
import kospiLogo from '../../../../../public/svgs/kospi.svg'
import kosdaqLogo from '../../../../../public/svgs/kosdaq.svg'
import defaultLogo from '../../../../../public/svgs/krx.svg'

export default function TechnicalTableIdentifier({ index, ticker, company_name, exchange_code }){
	const getExchangeLogo = (code) => {
    switch (code) {
      case 'KDQ':
        return kosdaqLogo; // KOSDAQ 로고 경로
      case 'KRX':
        return kospiLogo; // KOSPI 로고 경로
      default:
        return defaultLogo; // 기본 로고 경로
    }
  };
	
	return (
		<div className={classes.identifierContainer}>
      <span className={classes.index}>{index}</span>
      <Image
        src={getExchangeLogo(exchange_code)}
        alt={`${exchange_code} logo`}
        width={24}
        height={24}
        className={classes.exchangeLogo}
      />
      <div className={classes.infoContainer}>
        <span className={classes.ticker}>{ticker}</span>
        <span className={classes.companyName}>{company_name}</span>
      </div>
    </div>
	)
}