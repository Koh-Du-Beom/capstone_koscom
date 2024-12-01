// store/authStore.js
import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set, get) => ({
  isLoggedIn: false,
  email: null,
  interestedItems: [],

  // 로그인
  login: async (userData) => {
    set({
      isLoggedIn: true,
      email: userData.email,
      interestedItems: [], // 초기화
    });
    // 로그인 후 관심 종목 가져오기
    await get().fetchInterestedItems();
  },

  // 로그아웃
  logout: () =>
    set({
      isLoggedIn: false,
      email: null,
      interestedItems: [], // 초기화
    }),

  // 관심 종목 설정
  setInterestedItems: (items) =>
    set({
      interestedItems: items,
    }),

  // 관심 종목 추가
  addInterestedItem: async (item) => {
    try {
      // 주가 데이터 가져오기
      const response = await axios.get('/api/stockList', {
        params: {
          codes: item.code,
          names: item.name,
          marketCategories: item.marketCategory,
        },
      });

      const [stockData] = response.data; // 배열로 반환되므로 첫 번째 아이템 추출
      const newItem = { ...item, ...stockData };

      set((state) => ({
        interestedItems: [...state.interestedItems, newItem],
      }));
    } catch (error) {
      console.error('Failed to fetch stock data for new item:', error.message);
    }
  },

  // 관심 종목 삭제
  removeInterestedItem: (code) =>
    set((state) => ({
      interestedItems: state.interestedItems.filter(
        (item) => item.code !== code
      ),
    })),

  // 관심 종목 가져오기
  fetchInterestedItems: async () => {
    const { email } = get();
    if (!email) return;

    try {
      const response = await axios.get('/api/interestedItems', {
        params: { email },
      });

      if (response.status === 200) {
        const items = response.data.items;

        if (items.length === 0) {
          set({ interestedItems: [] });
          return;
        }

        // 각 아이템의 코드, 이름, 시장 구분을 배열로 추출
        const codes = items.map((item) => item.code).join(',');
        const names = items.map((item) => item.name).join(',');
        const marketCategories = items.map((item) => item.marketCategory).join(',');

        // 주가 데이터 한 번에 가져오기
        const stockResponse = await axios.get('/api/stockList', {
          params: {
            codes,
            names,
            marketCategories,
          },
        });

        const stockDataList = stockResponse.data;

        // 코드 기준으로 아이템과 주가 데이터를 매칭
        const itemsWithStockData = items.map((item) => {
          const stockData = stockDataList.find((data) => data.code === item.code);
          return stockData ? { ...item, ...stockData } : item;
        });

        set({ interestedItems: itemsWithStockData });
      }
    } catch (error) {
      console.error('Failed to fetch interested items:', error.message);
    }
  },
}));

export default useAuthStore;
