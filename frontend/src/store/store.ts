import { createStore, applyMiddleware, AnyAction } from 'redux'
import thunk, { ThunkAction } from 'redux-thunk'
import reducer from 'store/reducer';

const store = createStore(reducer, applyMiddleware(thunk))

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;

export type RootState = ReturnType<typeof store.getState>

export default store;
