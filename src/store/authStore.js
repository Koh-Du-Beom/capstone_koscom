import { create } from 'zustand';

const useAuthStore = create((set) => ({
  isLoggedIn: false, // 로그인 상태 초기값
  email: null, // 유저 이메일
  interestedItems: [], // 유저 관심 종목 리스트

  // 로그인
  login: (userData) =>
    set({
      isLoggedIn: true,
      email: userData.email,
      interestedItems: [], // 초기화
    }),

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
}));

export default useAuthStore;
