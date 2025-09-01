import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DataPersistenceContextType {
  saveData: (key: string, data: any) => Promise<void>;
  loadData: (key: string) => Promise<any>;
  deleteData: (key: string) => Promise<void>;
  clearAllData: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const DataPersistenceContext = createContext<DataPersistenceContextType | undefined>(undefined);

interface DataPersistenceProviderProps {
  children: ReactNode;
}

export const DataPersistenceProvider = ({ children }: DataPersistenceProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveData = async (key: string, data: any): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      // For now, use localStorage. In production, this would be API calls
      localStorage.setItem(`brand_platform_${key}`, JSON.stringify({
        data,
        timestamp: Date.now(),
        version: '1.0'
      }));
      await new Promise(resolve => setTimeout(resolve, 200)); // Simulate API delay
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save data';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const loadData = async (key: string): Promise<any> => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API delay
      const stored = localStorage.getItem(`brand_platform_${key}`);
      if (!stored) return null;
      
      const parsed = JSON.parse(stored);
      return parsed.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteData = async (key: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      localStorage.removeItem(`brand_platform_${key}`);
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API delay
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete data';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAllData = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('brand_platform_'));
      keys.forEach(key => localStorage.removeItem(key));
      await new Promise(resolve => setTimeout(resolve, 200)); // Simulate API delay
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear data';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DataPersistenceContext.Provider value={{
      saveData,
      loadData,
      deleteData,
      clearAllData,
      isLoading,
      error
    }}>
      {children}
    </DataPersistenceContext.Provider>
  );
};

export const useDataPersistence = () => {
  const context = useContext(DataPersistenceContext);
  if (context === undefined) {
    throw new Error('useDataPersistence must be used within a DataPersistenceProvider');
  }
  return context;
};