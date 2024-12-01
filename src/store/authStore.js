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
          code: item.code,
          name: item.name,
          marketCategory: item.marketCategory,
        },
      });

      const stockData = response.data;
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

        // 각 아이템에 주가 데이터 추가
        const itemsWithStockData = await Promise.all(
          items.map(async (item) => {
            try {
              const res = await axios.get('/api/stockList', {
                params: {
                  code: item.code,
                  name: item.name,
                  marketCategory: item.marketCategory,
                },
              });
              const stockData = res.data;
              return { ...item, ...stockData };
            } catch (error) {
              console.error('Failed to fetch stock data for item:', error.message);
              return item; // 주가 데이터를 가져오지 못하면 원래 아이템 그대로 반환
            }
          })
        );

        set({ interestedItems: itemsWithStockData });
      }
    } catch (error) {
      console.error('Failed to fetch interested items:', error.message);
    }
  },

  
}));

export default useAuthStore;
