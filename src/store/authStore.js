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
  addInterestedItem: (item) =>
    set((state) => ({
      interestedItems: [...state.interestedItems, item],
    })),

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
        set({ interestedItems: response.data.items });
      }
    } catch (error) {
      console.error('Failed to fetch interested items:', error.message);
    }
  },
}));

export default useAuthStore;
