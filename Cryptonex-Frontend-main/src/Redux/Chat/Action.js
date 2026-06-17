/* eslint-disable no-unused-vars */
import axios from "axios";
import {
  CHAT_BOT_FAILURE,
  CHAT_BOT_REQUEST,
  CHAT_BOT_SUCCESS,
} from "./ActionTypes";
import { API_BASE_URL } from "@/Api/api";

export const sendMessage = ({ prompt, jwt }) => async (dispatch) => {
  dispatch({
    type: CHAT_BOT_REQUEST,
    payload: { prompt, role: "user" },
  });

  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/chat/bot`, // ✅ Spring Boot backend directly (works in production)
      { prompt }, // ✅ matches PromptBody.getPrompt()
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30s — Gemini can be slow
      }
    );

    // Spring Boot /chat/bot returns the raw Gemini JSON string
    // Parse it to extract the text
    let responseMessage = "I can't process that request. Please ask something related to crypto price, volume, etc.";
    try {
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text && text.trim() !== "") {
        responseMessage = text.trim();
      }
    } catch {
      // If data is already a plain string response, use it directly
      if (typeof data === "string" && data.trim()) {
        responseMessage = data.trim();
      }
    }

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
