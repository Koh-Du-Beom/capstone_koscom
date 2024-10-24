'use client'
import { createContext, useState, useContext } from 'react';
import { getLocalStorageItems, setLocalStorageItems } from '@/utils/localStorage'; // 로컬스토리지 유틸리티 사용

const InterestedItemsContext = createContext();
const LOCAL_STORAGE_KEY = 'interestedItems';

export const InterestedItemsProvider = ({ children }) => {
  const [interestedItems, setInterestedItems] = useState(getLocalStorageItems(LOCAL_STORAGE_KEY) || []);

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

  return (
    <InterestedItemsContext.Provider value={{ interestedItems, addInterestedItem, removeInterestedItem }}>
      {children}
    </InterestedItemsContext.Provider>
  );
};

export const useInterestedItems = () => useContext(InterestedItemsContext);
