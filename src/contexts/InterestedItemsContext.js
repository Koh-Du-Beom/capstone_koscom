'use client';
import { createContext, useState, useEffect, useContext } from 'react';
import { getLocalStorageItems, setLocalStorageItems } from '@/utils/localStorage';

const InterestedItemsContext = createContext();
const LOCAL_STORAGE_KEY = 'interestedItems';

export const InterestedItemsProvider = ({ children }) => {
  const [interestedItems, setInterestedItems] = useState([]); // 초기값은 빈 배열
  const [isInitialized, setIsInitialized] = useState(false); // 초기화 여부 확인

  // 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    const storedItems = getLocalStorageItems(LOCAL_STORAGE_KEY) || [];
    setInterestedItems(storedItems);
    setIsInitialized(true); // 초기화 완료
  }, []);

  const addInterestedItem = (item) => {
    const updatedItems = [...interestedItems, item];
    setInterestedItems(updatedItems);
    setLocalStorageItems(LOCAL_STORAGE_KEY, updatedItems); // 로컬 스토리지에도 저장
  };

  const removeInterestedItem = (itemCode) => {
    const updatedItems = interestedItems.filter(item => item.code !== itemCode);
    setInterestedItems(updatedItems);
    setLocalStorageItems(LOCAL_STORAGE_KEY, updatedItems); // 로컬 스토리지에서 삭제
  };

  // 초기화가 완료된 경우에만 children 렌더링
  if (!isInitialized) {
    return null; // 초기화 중에는 렌더링하지 않음
  }

  return (
    <InterestedItemsContext.Provider value={{ interestedItems, addInterestedItem, removeInterestedItem }}>
      {children}
    </InterestedItemsContext.Provider>
  );
};

export const useInterestedItems = () => useContext(InterestedItemsContext);
