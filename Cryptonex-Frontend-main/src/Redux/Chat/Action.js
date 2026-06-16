/* eslint-disable no-unused-vars */
import axios from "axios";
import {
  CHAT_BOT_FAILURE,
  CHAT_BOT_REQUEST,
  CHAT_BOT_SUCCESS,
} from "./ActionTypes";

export const sendMessage = ({ prompt, jwt }) => async (dispatch) => {
  dispatch({
    type: CHAT_BOT_REQUEST,
    payload: { prompt, role: "user" },
  });

  try {
    const { data } = await axios.post(
      "http://localhost:3000/chat", // Local bot via gateway
      { message: prompt },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        timeout: 15000, // 15s — Gemini can be slow
      }
    );

    // Use data.reply from Express.js response
    const responseMessage =
      data.reply && data.reply.trim() !== ""
        ? data.reply
        : "I can't process that request. Please ask something related to crypto price, volume, etc.";

    dispatch({
      type: CHAT_BOT_SUCCESS,
      payload: { ans: responseMessage, role: "model" },
    });

    console.log("Received response:", responseMessage);
  } catch (error) {
    dispatch({
      type: CHAT_BOT_FAILURE,
      payload: "Unable to process your request at the moment. Please try again.",
    });

    console.error("Chatbot error:", error);
  }
};
