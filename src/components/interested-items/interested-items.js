import classes from './interested-items.module.css';

export default function InterestedItems(params) {
	return (
		<div className={classes.container}>
			<div className={classes.logo}>

			</div>
			<div className={classes.wrapper}>
				<div className={classes.title_box}>
					<h1 className={classes.big_title}>
						삼성전자
					</h1>
					<h3 className={classes.small_title}>
						005930
					</h3>
				</div>

				<div className={classes.price_info}>
					<div className={classes.current_price}>61,500</div>
					<div className={classes.price_change_box}>
						<h4 className={classes.price_change}>-2,500(-1.99)</h4>
						<span className={classes.arrow}></span>
					</div>
					
				</div>
			</div>
		</div>
	)
};
