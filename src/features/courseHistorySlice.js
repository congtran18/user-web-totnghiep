import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api"
import { toast } from "react-toastify";

const initialState = {
    videoId: null,
    courseHistory: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

export const saveCourseHistory = createAsyncThunk(
    "/videocall/post",
    async (data, thunkAPI) => {
        try {

            const { token, ...res } = data

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await api.post('/videocall', res, config);

            if (response.error) {
                return;
            }
            return response.data

        } catch (error) {
            console.log("error", error)
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const commentCourseHistory = createAsyncThunk(
    "/videocall/put",
    async (data, thunkAPI) => {
        try {

            const { id, token, ...res } = data

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await api.patch(`/videocall/update-comment/${id}`, res, config);

            if (response.error) {
                return;
            }
            return response

        } catch (error) {
            console.log("error", error)
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const deleteCourseHistory = createAsyncThunk("/videocall/delete", async (data, thunkAPI) => {
    try {
        const { token, id } = data

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await api.delete(`/videocall/${id}`, config);

        return response

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


export const courseHistorySlice = createSlice({
    name: "courseHistory",
    initialState,
    reducers: {
        resetAll: (state) => {
            state.videoId = null;
            state.courseHistory = null;
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(saveCourseHistory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(saveCourseHistory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.videoId = action.payload._id
                // state.user = action.payload;
            })
            .addCase(saveCourseHistory.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                toast.error("Lỗi khi lưu course!");
            })
            .addCase(commentCourseHistory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(commentCourseHistory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                toast.success("Đánh giá học viên thành công!");
            })
            .addCase(commentCourseHistory.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                toast.error("Lỗi khi cập nhật course!");
            })
            .addCase(deleteCourseHistory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteCourseHistory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                toast.success("Xóa buổi học thành công!");
            })
            .addCase(deleteCourseHistory.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                toast.error("Lỗi khi xóa!");
            })
    },


});
export const { resetAll } = courseHistorySlice.actions;
export default courseHistorySlice.reducer;