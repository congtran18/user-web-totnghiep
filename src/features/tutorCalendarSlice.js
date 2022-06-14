import {
    createSlice,
    createAsyncThunk
} from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import api from "./api"
import { prepareEvents, prepareEvent } from "helpers/prepareEvents";

export const getEvents = createAsyncThunk("/calendar/get", async (uid, thunkAPI) => {
    try {

        const response = await api.get(`/calendar/${uid}`);

        return response.data

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const createEvent = createAsyncThunk("/calendar/post", async (data, thunkAPI) => {
    try {

        const { token, ...res } = data

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await api.post("/calendar", res, config);

        if (response.error) {
            toast.error(response.error.message)
            return null
        }

        toast.success("Thêm lịch thành công!");

        return prepareEvent(response.data)

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const updateEvent = createAsyncThunk("/calendar/update", async (data, thunkAPI) => {
    try {

        const { token, id, ...res } = data

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await api.patch(`/calendar/${id}`, res, config);

        if (response.error) {
            toast.error(response.error.message)
            return null
        }

        toast.success("Sửa lịch thành công!");

        return response.data

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const deleteEvent = createAsyncThunk("/calendar/delete", async (data, thunkAPI) => {
    try {
        const { token, id } = data

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await api.delete(`/calendar/${id}`, config);

        if (response.error) {
            toast.error(response.error.message)
            return null
        }

        toast.success("Xóa lịch thành công!");

        return response.data

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


export const tutorCalendarSlice = createSlice({
    name: "tutorCalendar",
    initialState: {
        openModal: false,
        listCalendar: [],
        calendarData: null,
        activeEvent: null,
        isLoading: false,
    },
    reducers: {
        eventSetActive: (state, action) => {
            state.activeEvent = action.payload
        },
        eventClearActiveEvent: (state) => {
            state.activeEvent = null
        },
        uiOpenModal: (state) => {
            state.openModal = true
        },
        uiCloseModal: (state) => {
            state.openModal = false
        },
        resetAll: (state) => {
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getEvents.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getEvents.fulfilled, (state, action) => {
                state.isLoading = false;
                state.listCalendar = prepareEvents(action.payload);
            })
            .addCase(getEvents.rejected, (state, action) => {
                state.isLoading = false;
                toast.error("Kiểm tra lại thông tin!");
            })
            .addCase(createEvent.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createEvent.fulfilled, (state, action) => {
                state.isLoading = false;
                state.calendarData = action.payload;
                action.payload && state.listCalendar.push(action.payload)
            })
            .addCase(createEvent.rejected, (state, action) => {
                state.isLoading = false;
                toast.error("Kiểm tra lại thông tin!");
            })
            .addCase(updateEvent.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateEvent.fulfilled, (state, action) => {
                state.isLoading = false;
                state.calendarData = action.payload;
                state.listCalendar = action.payload ? state.listCalendar.map((calendarData) => {
                    calendarData._id === action.payload._id ? action.payload : calendarData
                }) : state.listCalendar
            })
            .addCase(updateEvent.rejected, (state, action) => {
                state.isLoading = false;
                toast.error("Kiểm tra lại thông tin!");
            })
            .addCase(deleteEvent.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteEvent.fulfilled, (state, action) => {
                state.isLoading = false;
                state.listCalendar = state.listCalendar.filter(
                    (calendarData) => calendarData._id !== (action.payload ? action.payload._id : '')
                );
            })
            .addCase(deleteEvent.rejected, (state, action) => {
                state.isLoading = false;
                toast.error("Kiểm tra lại thông tin!");
            })
    },

});


export const { uiOpenModal, uiCloseModal, resetAll, eventSetActive, eventClearActiveEvent } = tutorCalendarSlice.actions;
export default tutorCalendarSlice.reducer;