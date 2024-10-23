import classes from './interested-news.module.css';

export default function InterestedNews({ news }) {
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <h1 className={classes.title}>{news.title}</h1>
        <h3 className={classes.infos}>{news.date} - {news.source}</h3>
      </div>
    </div>
  );
}
