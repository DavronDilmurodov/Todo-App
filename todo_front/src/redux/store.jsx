import { configureStore } from '@reduxjs/toolkit';
import todoSlice from './Todo/todoSlice';

export const store = configureStore({
    reducer: {
        todo: todoSlice,
    },
});
