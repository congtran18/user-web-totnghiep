import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api"

export const getMessages = createAsyncThunk("/message/get", async (data, thunkAPI) => {
    try {

        const { token, uid } = data

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await api.get(`/message/${uid}`, config);

        return response

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const chatTutorSlice = createSlice({
    name: "chatTutor",
    initialState: {
        id: '',
        activeChat: '',
        isLoading: true,
        tutors: [],
        users: [],
        messages: [],
    },
    reducers: {
        listTutors: (state, action) => {
            state.tutors = action.payload.filter(
                (user) => user.user_tutor.length > 0 && user.user_tutor[0].accept === true
            );
        },
        listUsers: (state, action) => {
            state.users = action.payload
        },
        ActiveChat: (state, action) => {
            state.activeChat = action.payload
            state.messages = []
        },
        newMessage: (state, action) => {
            state.messages = [...state.messages, action.payload]
        },
        loadMessages: (state, action) => {
            state.messages = [...action.payload]
        },
        resetAll: (state) => {
            state.id = ''
            state.activeChat = ''
            state.isLoading = false
            state.tutors = []
            state.users = []
            state.messages = []
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMessages.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMessages.fulfilled, (state, action) => {
                state.isLoading = false;
                // state.user = action.payload;
            })
            .addCase(getMessages.rejected, (state, action) => {
                state.isLoading = false;
                state.messages = [...action.payload]
            })
    },

});


export const { listTutors, listUsers, ActiveChat, newMessage, loadMessages, resetAll } = chatTutorSlice.actions;
export default chatTutorSlice.reducer;