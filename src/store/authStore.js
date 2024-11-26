import { create } from 'zustand';

const useAuthStore = create((set) => ({
  isLoggedIn: false, // 로그인 상태 초기값
  user: null, // 사용자 정보

  // 로그인 상태 업데이트
  login: (userData) => set({ isLoggedIn: true, user: userData }),
  logout: () => set({ isLoggedIn: false, user: null }), // 로그아웃 상태 초기화
}));

export default useAuthStore;
