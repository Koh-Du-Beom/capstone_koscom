import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function TableCircularProgressBar({ point }) {
  // 점수에 따른 색상 결정
  let pathColor = '';
  if (point >= 0 && point < 20) {
    pathColor = '#dc3545'; // Bootstrap Red
  } else if (point >= 20 && point < 40) {
    pathColor = '#fd7e14'; // Bootstrap Orange
  } else if (point >= 40 && point < 60) {
    pathColor = '#ffc107'; // Bootstrap Yellow
  } else if (point >= 60 && point < 80) {
    pathColor = '#28a745'; // Bootstrap Green
  } else if (point >= 80 && point <= 100) {
    pathColor = '#007bff'; // Bootstrap Blue
  } else {
    pathColor = '#6c757d'; // Bootstrap Gray (예외 처리용)
  }

  return (
    <div style={{ width: 50, height: 50 }}>
      <CircularProgressbar
        value={point}
        text={`${Number(point).toFixed(0)}점`}
        styles={buildStyles({
          // 텍스트 색상
          textColor: '#000',
          // 진행바 색상
          pathColor: pathColor,
          // 배경 트랙 색상
          trailColor: '#d6d6d6',
          // 텍스트 크기
          textSize: '30px',
          // 진행바 끝 부분 둥글게 만들기
          strokeLinecap: 'butt',
        })}
      />
    </div>
  );
}
