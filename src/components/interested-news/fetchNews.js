export async function fetchAllNews(stockCodes) {
  const allNews = {};
  
  for (let code of stockCodes) {
    const response = await fetch(`/api/news?code=${code}`);
    const news = await response.json();
    allNews[code] = news;
  }

  return allNews;
}
