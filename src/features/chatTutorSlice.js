import {
    createSlice,
} from "@reduxjs/toolkit";

export const chatTutorSlice = createSlice({
    name: "chatTutor",
    initialState: {
        id: '',
        activeChat: '',
        tutors: [],
        messages: [],
    },
    reducers: {
        listTutors: (state, action) => {
            state.tutors = action.payload
        },
        activeChat: (state, action) => {
            state.activeChat = action.payload
            state.messages = []
        },
        newMessage: (state, action) => {
            state.messages = [...state.messages , action.payload]
        },
        loadMessages: (state, action) => {
            state.messages = [...action.payload]
        },
        resetAll: (state) => {
            state.id = ''
            state.activeChat = ''
            state.tutors = []
            state.messages = []
        },
    },

});


export const { listTutors, activeChat, newMessage, loadMessages, resetAll } = chatTutorSlice.actions;
export default chatTutorSlice.reducer;