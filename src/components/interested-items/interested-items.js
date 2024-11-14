import classes from './interested-items.module.css';
import Image from 'next/image';
import KospiLogo from '../../../public/svgs/kospi.svg';
import KosdaqLogo from '../../../public/svgs/kosdaq.svg';

export default function InterestedItems({ items, isEditMode, onRemoveItem }) {
  return (
    <>
      {items.map((item, index) => {
        if (!item) return null; // 데이터가 없을 경우 대비

        const currentPrice = Number(item.mkp);
        const priceChangeValue = Number(item.priceChange);
        const priceChangeRateValue = parseFloat(item.priceChangeRate);

        return (
          <div className={classes.container} key={index}>
            <div className={classes.logo}>
              <Image 
                src={item.marketCategory === 'KOSPI' ? KospiLogo : KosdaqLogo}
                alt={`${item.marketCategory} logo`}
                width={100}
                height={100}
              />
            </div>
            <div className={classes.wrapper}>
              <div className={classes.title_box}>
                <h1 className={classes.big_title}>{item.name}</h1>
                <h3 className={classes.small_title}>{item.code}</h3>
              </div>

              <div className={classes.price_info}>
                <h4 className={classes.current_price}>
                  {currentPrice.toLocaleString()}
                </h4> 
                <div className={classes.price_change_box}>
                  <h6 
                    className={`${classes.price_change} ${priceChangeValue > 0 ? classes.priceChangeUp : classes.priceChangeDown}`}>
                    {priceChangeValue > 0 ? `+${priceChangeValue.toLocaleString()}` : priceChangeValue.toLocaleString()} 
                    ({priceChangeRateValue > 0 ? `+${priceChangeRateValue.toFixed(2)}` : priceChangeRateValue.toFixed(2)}%)
                  </h6>
                  <span className={`${classes.arrow} ${priceChangeValue > 0 ? classes.arrowUp : classes.arrowDown}`}></span>
                </div>
              </div>
            </div>

            {/* 편집 모드에서만 삭제 버튼 표시 */}
            {isEditMode && (
              <button 
                className={classes.deleteButton} 
                onClick={() => onRemoveItem(item.code)}
              >
                삭제
              </button>
            )}
          </div>
        );
      })}
    </>
  );
}
