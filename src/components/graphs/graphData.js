export const salesData = {
  labels: ["2021/12", "2022/12", "2023/12", "2024/06"],
  datasets: [
    {
      label: "매출액",
      data: [2796048, 3022314, 2589355, 1459839], // 매출액 데이터
      backgroundColor: "rgba(75, 192, 192, 0.2)", // 매출액 그래프 색상
      borderColor: "rgba(75, 192, 192, 1)", // 매출액 테두리 색상
      borderWidth: 1,
    },
    {
      label: "영업이익",
      data: [516339, 433766, 65670, 170499], // 영업이익 데이터
      backgroundColor: "rgba(153, 102, 255, 0.2)", // 영업이익 그래프 색상
      borderColor: "rgba(153, 102, 255, 1)", // 영업이익 테두리 색상
      borderWidth: 1,
    },
  ],
};

