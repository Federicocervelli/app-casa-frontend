import React, { createContext, useReducer, Dispatch } from 'react';
import { Chore, House, User } from '../types/types';
import { Session } from '@supabase/supabase-js';

// Define types for your state and actions
type State = {
  session: Session | null;
  house: House | null;
  houseUsers: User[];
  chores: Chore[];
  houseLoaded: boolean;
  selectedChore: Chore | null;
};

type Action = 
  | { type: 'setHouse'; payload: House | null }
  | { type: 'setHouseUsers'; payload: User[] }
  | { type: 'setChores'; payload: Chore[] }
  | { type: 'setSession'; payload: Session | null }
  | { type: 'setHouseLoaded'; payload: boolean }
  | { type: 'setSelectedChore'; payload: Chore | null }


// Initial state
const initialState: State = {
  session: null,
  house: null,
  houseUsers: [],
  chores: [],
  houseLoaded: false,
  selectedChore: null
};

// Reducer function
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setHouse':
      return { ...state, house: action.payload };
    case 'setChores':
      return { ...state, chores: action.payload };
    case 'setSession':
      return { ...state, session: action.payload };
    case 'setHouseUsers':
      return { ...state, houseUsers: action.payload };
    case 'setHouseLoaded':
      return { ...state, houseLoaded: action.payload };
    case 'setSelectedChore':
      return { ...state, selectedChore: action.payload };
    default:
      return state;
  }
}

// Create context
export const AppContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
}>({ state: initialState, dispatch: () => undefined });

// Provider component
export function AppProvider({ children } : { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
