import classes from './interested-news.module.css';

export default function InterestedNews({ news }) {
  // 클릭 시, 실제 기사로 이동
  const handleLinkClick = () => {
    window.open(news.link, '_blank');
  };

  return (
    <div className={classes.container} onClick={handleLinkClick}>
      <div className={classes.wrapper}>
        <h1 className={classes.stock_name}>[{news.stockName}]</h1>
        <h2 className={classes.title}>{news.title}</h2>
        <h3 className={classes.infos}>{news.date}</h3>

      </div>
    </div>
  );
}
