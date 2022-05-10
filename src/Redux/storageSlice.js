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
export const saveImage = createAsyncThunk(
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
            .addCase(saveImage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(saveImage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.dataStore = action.payload;
            })
            .addCase(saveImage.rejected, (state, action) => {
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