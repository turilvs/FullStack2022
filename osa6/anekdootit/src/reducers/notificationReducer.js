import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
      sendNotification(state, action) {
        console.log(action)
        const noti = action.payload;
        return noti;
        }
    }
})

let clear = null;

export const createNotification = (message) => {
    return async (dispatch) => {
      dispatch(sendNotification(message));
    
      if (clear !== null)  {
        clearTimeout(clear);
      }

      clear = setTimeout(() => dispatch(sendNotification(null)), 5000)
    }
  }

export const {sendNotification} = notificationSlice.actions
export default notificationSlice.reducer