import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Api from '../../Config/Api'

export const getUsersBalance = createAsyncThunk(
    'balance/getUsersBalance',
    async (body = {}, { rejectWithValue }) => {
        try {
            const { data } = await Api.post('/sales/client/getclientTransactions', body)
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

const usersBalanceSlice = createSlice({
    name: 'usersBalanceSlice',
    initialState: {
        usersBalance: [],
        loading: false,
        totalPage: 0,
        totalCount: 0
    },
    extraReducers: {
        [getUsersBalance.pending]: (state) => {
            state.loading = true
        },
        [getUsersBalance.fulfilled]: (state, { payload: { records, pagination: { totalPages, totalCount } } }) => {
            state.loading = false
            state.usersBalance = records
            state.totalPage = totalPages
            state.totalCount = totalCount
        },
        [getUsersBalance.rejected]: (state) => {
            state.loading = false
        },
    },
})

export const { clearSearchedUsersBalance } = usersBalanceSlice.actions
export default usersBalanceSlice.reducer
