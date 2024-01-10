import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    todos: [],
};

export const getTodos = createAsyncThunk('gettodos', async () => {
    const createdBy = localStorage.getItem('userId');
    const res = await axios.get(`http://localhost:3000/todo/${createdBy}`);
    return res.data;
});

export const createTodo = createAsyncThunk('createtodo', async (body, { rejectWithValue }) => {
    const createdBy = localStorage.getItem('userId');
    const res = await axios
        .post(`http://localhost:3000/todo`, { ...body, createdBy })
        .catch((err) => rejectWithValue(err.response.data));
    return res.data;
});

export const removeTodo = createAsyncThunk('removetodo', async (id) => {
    const createdBy = localStorage.getItem('userId');
    const res = await axios.delete(`http://localhost:3000/todo/${id}/${createdBy}`);
    return { data: res.data, id };
});

export const editIsCompleted = createAsyncThunk('editiscompleted', async (id) => {
    const createdBy = localStorage.getItem('userId');
    const res = await axios.put(`http://localhost:3000/todo/iscompleted/${id}/${createdBy}`);
    return res.data;
});

export const editTodo = createAsyncThunk('edittodo', async ({ newTodo, id }, { rejectWithValue }) => {
    const createdBy = localStorage.getItem('userId');
    const res = await axios
        .put(`http://localhost:3000/todo/${id}/${createdBy}`, { ...newTodo })
        .catch((err) => rejectWithValue(err.response.data));
    return res.data;
});

export const todoSlice = createSlice({
    initialState,
    name: 'todo',
    extraReducers: (builder) => {
        builder
            .addCase(getTodos.fulfilled, (state, { payload }) => {
                state.todos = payload.data;
                state.loading = false;
            })
            .addCase(createTodo.fulfilled, (state, { payload }) => {
                state.todos.unshift(payload.data);
            })
            .addCase(removeTodo.fulfilled, (state, { payload }) => {
                state.todos = state.todos.filter((t) => t.id !== payload.id);
            })
            .addCase(editIsCompleted.fulfilled, (state, { payload }) => {
                state.todos = state.todos.map((t) => {
                    if (t.id === payload.data.id) {
                        return { ...t, isCompleted: payload.data.isCompleted };
                    }
                    return t;
                });
            })
            .addCase(editTodo.fulfilled, (state, { payload }) => {
                state.todos = state.todos.map((t) => (t.id !== payload.data.id ? t : payload.data));
            });
    },
});

export default todoSlice.reducer;
