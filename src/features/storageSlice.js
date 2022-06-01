import {
    createSlice,
    createAsyncThunk
} from "@reduxjs/toolkit";
import api from "./api"

const initialState = {
    dataStore: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

// Save image to storage
export const saveFile = createAsyncThunk(
    "/storage/single",
    async (data, thunkAPI) => {

        try {
            const response = await api.post("/storage/single", data, {
                headers: {
                    'Content-Type': 'form-data'
                }
            });
            return response.data;
        } catch (error) {
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

export const deleteFile = createAsyncThunk(
    "/storage/delete",
    async (id, thunkAPI) => {

        try {
            const response = await api.delete(`/storage/${id}`);
            return response;
        } catch (error) {
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

export const saveMultiFile = createAsyncThunk(
    "/storage/multiple",
    async (data, thunkAPI) => {

        try {
            const response = await api.post("/storage/multiple", data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return response;
        } catch (error) {
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

/*
 * async func should be added in extra reducers
 */
const storageSlice = createSlice({
    name: "storage",
    initialState,
    reducers: {
        resetAllStorage: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(saveFile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(saveFile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.dataStore = action.payload;
            })
            .addCase(saveFile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(saveMultiFile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(saveMultiFile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.dataStore = action.payload;
            })
            .addCase(saveMultiFile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteFile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteFile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.dataStore = action.payload;
            })
            .addCase(deleteFile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    },
});

export const {
    resetAllStorage
} = storageSlice.actions;
export default storageSlice.reducer;