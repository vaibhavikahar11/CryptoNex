import api from "@/Api/api";
import * as types from "./ActionTypes";

// Action Creators
export const getUserWallet = (jwt) => async (dispatch) => {
  dispatch({ type: types.GET_USER_WALLET_REQUEST });

  try {
    const response = await api.get("/api/wallet", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    dispatch({
      type: types.GET_USER_WALLET_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: types.GET_USER_WALLET_FAILURE,
      error: error.message,
    });
  }
};

export const getWalletTransactions =
  ({ jwt }) =>
  async (dispatch) => {
    dispatch({ type: types.GET_WALLET_TRANSACTION_REQUEST });

    try {
      const response = await api.get("/api/wallet/transactions", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      dispatch({
        type: types.GET_WALLET_TRANSACTION_SUCCESS,
        payload: response.data,
      });
      console.log("wallet transaction", response.data);
    } catch (error) {
      console.log(error);
      dispatch({
        type: types.GET_WALLET_TRANSACTION_FAILURE,
        error: error.message,
      });
    }
  };

export const depositMoney =
  ({ jwt, orderId, paymentId,navigate }) =>
  async (dispatch) => {
    dispatch({ type: types.DEPOSIT_MONEY_REQUEST });

    try {
      const response = await api.put(`/api/wallet/deposit`, null, {
        params: {
          order_id: orderId,
          payment_id: paymentId,
        },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      dispatch({
        type: types.DEPOSIT_MONEY_SUCCESS,
        payload: response.data,
      });
      navigate("/wallet")
      console.log(response.data);
    } catch (error) {
      console.error(error);
      dispatch({
        type: types.DEPOSIT_MONEY_FAILURE,
        error: error.message,
      });
    }
  };

export const paymentHandler =
  ({ jwt, amount, paymentMethod }) =>
  async (dispatch) => {
    dispatch({ type: types.DEPOSIT_MONEY_REQUEST });

    try {
      const response = await api.post(
        `/api/payment/${paymentMethod}/amount/${amount}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (paymentMethod === "RAZORPAY") {
        // Open Razorpay Checkout modal with UPI QR enabled
        // Use values from backend PaymentResponse (created via Razorpay Orders API)
        const options = {
          key: response.data.razorpay_key,
          amount: response.data.razorpay_amount,
          currency: response.data.razorpay_currency,
          name: response.data.razorpay_name,
          description: response.data.razorpay_description,
          image: "/Cnex.png",
          order_id: response.data.razorpay_order_id, // CRITICAL: required for UPI QR block to render
          // Standard Razorpay checkout UI handles UPI natively and prominently
          handler: function (paymentResult) {
            // Payment successful — deposit to wallet using internal DB order ID
            dispatch(
              depositMoney({
                jwt,
                orderId: response.data.payment_order_id, // Must be the internal Long ID, not the string Razorpay order ID
                paymentId: paymentResult.razorpay_payment_id,
                navigate: (path) => (window.location.href = path),
              })
            );
          },
          prefill: {
            email: response.data.razorpay_prefill_email || "",
            contact: "",
          },
          theme: {
            color: "#F5A623",
          },
          modal: {
            ondismiss: function () {
              dispatch({ type: types.DEPOSIT_MONEY_FAILURE, error: "Payment cancelled" });
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

        dispatch({ type: types.DEPOSIT_MONEY_SUCCESS, payload: response.data });
      } else {
        // Stripe — redirect as before
        window.location.href = response.data.payment_url;
        dispatch({ type: types.DEPOSIT_MONEY_SUCCESS, payload: response.data });
      }
    } catch (error) {
      console.log("error", error);
      dispatch({
        type: types.DEPOSIT_MONEY_FAILURE,
        error: error.message,
      });
    }
  };

export const transferMoney =
  ({ jwt, walletId, reqData }) =>
  async (dispatch) => {
    dispatch({ type: types.TRANSFER_MONEY_REQUEST });

    try {
      const response = await api.put(
        `/api/wallet/${walletId}/transfer`,
        reqData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      dispatch({
        type: types.TRANSFER_MONEY_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: types.TRANSFER_MONEY_FAILURE,
        error: error.message,
      });
    }
  };
