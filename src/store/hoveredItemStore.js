import { create } from 'zustand';

const useHoveredItemStore = create((set) => ({
  hoveredItem: null, // 현재 hover된 아이템
  setHoveredItem: (item) => set({ hoveredItem: item }), // hover된 아이템 설정
  clearHoveredItem: () => set({ hoveredItem: null }), // hover 상태 초기화
}));

export default useHoveredItemStore;
