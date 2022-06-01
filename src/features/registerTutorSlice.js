import {
    createSlice,
    createAsyncThunk
} from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import api from "./api"

export const registerTutor = createAsyncThunk("/tutor/post", async (data, thunkAPI) => {
    try {

        const { token, ...res } = data

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await api.post("/tutor", res, config);

        return response.data

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const updateTutor = createAsyncThunk("/tutor/update", async (data, thunkAPI) => {
    try {

        const { token, uid, ...res } = data

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await api.patch(`/tutor/${uid}`, res, config);

        return response.data

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const registerTutorSlice = createSlice({
    name: "registerTutor",
    initialState: {
        tutorData: null,
        stepOne: {},
        stepTwo: {},
        isLoading: false,
        isSuccess: false,
        isError: false
    },
    reducers: {
        confirmStepOne: (state, action) => {
            state.stepOne = { ...action.payload }
            toast.success('Trả lời câu hỏi')
        },
        addStepOneUrl: (state, action) => {
            state.stepOne = { ...state.stepOne, ...action.payload }
        },
        confirmStepTwo: (state, action) => {
            state.stepTwo = { ...action.payload }
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(registerTutor.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(registerTutor.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.tutorData = action.payload;
                toast.success("Chờ xác nhận!");
            })
            .addCase(registerTutor.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                toast.error("Kiểm tra lại thông tin!");
            })
            .addCase(updateTutor.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateTutor.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.tutorData = action.payload;
                toast.success("Cập nhật thông tin thành công!");
            })
            .addCase(updateTutor.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                toast.error("Kiểm tra lại thông tin!");
            })
    },

});


export const { confirmStepOne, confirmStepTwo, addStepOneUrl } = registerTutorSlice.actions;
export default registerTutorSlice.reducer;