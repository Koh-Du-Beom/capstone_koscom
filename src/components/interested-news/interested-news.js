import classes from './interested-news.module.css';

export default function InterestedNews() {
	return (
		<div className={classes.container}>
			<div className={classes.logo}>

			</div>
		
			<div className={classes.wrapper}>
				<h1 className={classes.title}></h1>
				<h3 className={classes.infos}>
					
				</h3>
			</div>

		</div>
	)
};

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
              <div className={classes.current_price}>{item.currentPrice}</div>
              <div className={classes.price_change_box}>
                <h4 className={item.priceChange > 0 ? 'text-danger' : 'text-primary'}>
                  {item.priceChange} ({item.percentagechange}%)
                </h4>
                <span className={`${classes.arrow} ${item.priceChange < 0 ? classes.arrowUp : classes.arrowDown}`}></span>
              </div>
            </div>
          </div>
        </div>