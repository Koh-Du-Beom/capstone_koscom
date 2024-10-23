import classes from './interested-items.module.css';
import Image from 'next/image';
import LogoTmp from '../../../public/images/tmpLogo.png';

export default function InterestedItems({ items, isEditMode, onRemoveItem }) {
  return (
    <>
      {items.map((item, index) => (
        <div className={classes.container} key={index}>
          <div className={classes.logo}>
            <Image 
              src={LogoTmp}
              alt="tmpLogo"
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
              <h4 className={classes.current_price}>{Number(item.mkp).toLocaleString()}</h4> 
              <div className={classes.price_change_box}>
                <h6 
                  className={`${classes.price_change} ${item.priceChange > 0 ? classes.priceChangeUp : classes.priceChangeDown}`}>
                  {item.priceChange > 0 ? `+${Number(item.priceChange).toLocaleString()}` : Number(item.priceChange).toLocaleString()} 
                  ({(item.priceChangeRate > 0 ? '+' : '') + parseFloat(item.priceChangeRate).toFixed(2)}%)
                </h6>
								<span className={`${classes.arrow} ${item.priceChange > 0 ? classes.arrowUp : classes.arrowDown}`}></span>
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
      ))}
    </>
  );
}
