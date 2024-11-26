import { create } from 'zustand';

const useAuthStore = create((set) => ({
  isLoggedIn: false, // 로그인 상태 초기값
  email: null, // 유저의 이메일

  // 로그인 상태 업데이트
  login: (userData) => set({
    isLoggedIn: true,
    email: userData.email, // email 저장
  }),

  logout: () => set({
    isLoggedIn: false,
    email: null, // email 초기화
  }),
}));

export default useAuthStore;
