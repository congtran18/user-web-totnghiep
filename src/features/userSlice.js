import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api"
import { toast } from "react-toastify";
import Cookies from 'js-cookie'
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

const user = JSON.stringify(Cookies.get("userInfo"));

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

export const loginUser = createAsyncThunk("/auth/login", async (user, thunkAPI) => {
    try {

        const response = await api.post("/auth/login", user);

        Cookies.set("userInfo", JSON.stringify(response.data));

        return response.data

    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const registerUser = createAsyncThunk(
    "/auth/register",
    async (user, thunkAPI) => {
        try {

            const response = await api.post('/users', user);

            if (response.error) {
                toast.error(response.error.message);
                return;
            }
            toast.success("Đăng ký thành công!");
            Cookies.set("userInfo", true);
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


export const logout = createAsyncThunk("/auth/logout", async () => {
    if (Cookies.get("userInfo")) {
        Cookies.remove("userInfo")
    } else {
        signOut()
    }

});


export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // logout: (state) => {
        //     state.currentUser = null;
        //     Cookies.remove("userInfo")
        // },
        resetAll: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
                toast.error("Lỗi khi đăng kí!");
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
                toast.success("Đăng nhập thành công!");
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
                toast.error("Kiểm tra lại thông tin đăng nhập!");
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                toast.success("Đăng xuất thành công!");
            });
    },


});
export const { resetAll } = userSlice.actions;
export default userSlice.reducer;