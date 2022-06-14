import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import api from "./api"

export const getReviewTutor = createAsyncThunk("/reviewTutor/get", async (uid, thunkAPI) => {
    try {

        const response = await api.get(`/reviewTutor/${uid}`);

        return response[0]

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const deleteReviewTutor = createAsyncThunk("/reviewTutor/delete", async (data, thunkAPI) => {
    try {

        const { token, id } = data

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await api.delete(`/reviewTutor/delete-review/${id}`, config);

        return response

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const createReviewTutor = createAsyncThunk("/reviewTutor/post", async (data, thunkAPI) => {
    try {

        const { token, ...res } = data

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await api.post(`/reviewTutor`, res, config);

        if (response.error) {
            toast.error(response.error.message)
            return;
        }

        toast.success("Đánh giá gia sư thành công!")
        return response.data

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const createWarningTutor = createAsyncThunk("/warningTutor/post", async (data, thunkAPI) => {
    try {

        const { token, ...res } = data

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await api.post(`/warningTutor`, res, config);

        if (response.error) {
            toast.error(response.error.message)
            return;
        }

        toast.success("Tố cáo của bạn đã được gửi!")
        return response.data

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const reviewTutorSlice = createSlice({
    name: "reviewTutor",
    initialState: {
        isLoading: true,
        reviewTutors: [],
        total: 0,
    },
    reducers: {
        resetAll: (state) => {
            state.isLoading = false
            state.reviewTutors = []
            state.total = 0
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getReviewTutor.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getReviewTutor.fulfilled, (state, action) => {
                state.isLoading = false;
                // state.user = action.payload;
                state.reviewTutors = action.payload.all_review
                state.total = action.payload.count.length > 0 ? action.payload.count[0].totalCount : 0;
            })
            .addCase(getReviewTutor.rejected, (state, action) => {
                state.isLoading = false;
            })
            .addCase(createReviewTutor.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createReviewTutor.fulfilled, (state, action) => {
                state.isLoading = false;
                // state.user = action.payload;
                // action.payload && state.reviewTutors.push(action.payload)
            })
            .addCase(createReviewTutor.rejected, (state, action) => {
                state.isLoading = false;
            })
            .addCase(deleteReviewTutor.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteReviewTutor.fulfilled, (state, action) => {
                state.isLoading = false;
                toast.success("Xóa review thành công!")
                // state.user = action.payload;
                // action.payload && state.reviewTutors.push(action.payload)
            })
            .addCase(deleteReviewTutor.rejected, (state, action) => {
                state.isLoading = false;
            })
            .addCase(createWarningTutor.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createWarningTutor.fulfilled, (state, action) => {
                state.isLoading = false;
                // state.user = action.payload;
                // action.payload && state.reviewTutors.push(action.payload)
            })
            .addCase(createWarningTutor.rejected, (state, action) => {
                state.isLoading = false;
            })
    },

});


export const { resetAll } = reviewTutorSlice.actions;
export default reviewTutorSlice.reducer;