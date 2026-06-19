/* eslint-disable no-unused-vars */
import axios from "axios";
import {
  CHAT_BOT_FAILURE,
  CHAT_BOT_REQUEST,
  CHAT_BOT_SUCCESS,
} from "./ActionTypes";
import { CHATBOT_BASE_URL } from "@/Api/api";

export const sendMessage = ({ prompt, jwt }) => async (dispatch) => {
  dispatch({
    type: CHAT_BOT_REQUEST,
    payload: { prompt, role: "user" },
  });

  try {
    const { data } = await axios.post(
      `${CHATBOT_BASE_URL}/chat/bot`, // ✅ Node.js chatbot service on Render
      { message: prompt }, // ✅ Bot expects { message: ... }
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30s — Gemini can be slow
      }
    );

    // The Node.js bot returns { reply: "..." }
    const responseMessage =
      data?.reply ||
      "I can't process that request. Please ask something related to crypto price, volume, etc.";

    dispatch({
      type: CHAT_BOT_SUCCESS,
      payload: { ans: responseMessage, role: "model" },
    });

    console.log("Chatbot response:", responseMessage);
  } catch (error) {
    dispatch({
      type: CHAT_BOT_FAILURE,
      payload: "Unable to process your request at the moment. Please try again.",
    });

    console.error("Chatbot error:", error);
  }
};

