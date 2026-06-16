require("dotenv").config();
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const db = require("../db/db");

const router = express.Router();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ============================================
// API ENDPOINT CONFIGURATION
// ============================================
// In docker: use http://api-gateway:3000
// In localhost: use http://localhost:3000
// In production: use actual deployed URL
const SPRING_BOOT_URL = process.env.SPRING_BOOT_URL || "http://localhost:3000";

// Global in-memory object to hold conversation context
const conversationMemory = {};

// Updated updateConversationMemory function that resets inactivity timer per user.
function updateConversationMemory(userId, userMessage, botReply) {
  // Initialize conversation memory for the user if not already present.
  if (!conversationMemory[userId]) {
    conversationMemory[userId] = { history: [] };
  }

  // Add the new messages to the conversation history.
  conversationMemory[userId].history.push(`User: ${userMessage}`);
  conversationMemory[userId].history.push(`Bot: ${botReply}`);

  // Limit history to the most recent 20 entries.
  if (conversationMemory[userId].history.length > 20) {
    conversationMemory[userId].history =
      conversationMemory[userId].history.slice(-20);
  }

  // Clear any existing inactivity timer.
  if (conversationMemory[userId].inactivityTimer) {
    clearTimeout(conversationMemory[userId].inactivityTimer);
  }

  // Set a new inactivity timer to delete the conversation memory after 5 minutes.
  conversationMemory[userId].inactivityTimer = setTimeout(
    () => {
      delete conversationMemory[userId];
      console.log(
        `Conversation memory for user ${userId} deleted due to inactivity.`,
      );
    },
    5 * 60 * 1000,
  ); // 5 minutes in milliseconds
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Clean AI response
function cleanResponse(text) {
  return text
    .replace(/\n/g, " ")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Fetch crypto data from SQLite (used for price calculation)
async function getCryptoData(coinName) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT name, symbol, price, market_cap, volume_24h, change_24h, last_updated FROM crypto_prices WHERE LOWER(name) = ? OR LOWER(symbol) = ? ORDER BY last_updated DESC LIMIT 1",
      [coinName.toLowerCase(), coinName.toLowerCase()],
      (err, row) => {
        if (err) reject("Database error.");
        else resolve(row);
      },
    );
  });
}

// Fetch latest crypto news from SQLite
async function getLatestNews(limit = 5) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT title, url, source, published_at FROM crypto_news ORDER BY published_at DESC LIMIT ?",
      [limit],
      (err, rows) => {
        if (err) reject("Database error fetching news.");
        else resolve(rows);
      },
    );
  });
}

// Fetch user profile from Spring Boot
async function fetchUserProfile(authHeader) {
  try {
    const response = await axios.get(`${SPRING_BOOT_URL}/api/users/profile`, {
      headers: { Authorization: authHeader },
    });
    return response.data;
  } catch (error) {
    console.log("Profile Fetch Error:", error.message);
    return null;
  }
}

// Fetch user portfolio from Spring Boot
async function fetchUserPortfolio(authHeader) {
  try {
    const response = await axios.get(`${SPRING_BOOT_URL}/api/assets`, {
      headers: { Authorization: authHeader },
    });
    return response.data;
  } catch (error) {
    console.log("Portfolio Fetch Error:", error.message);
    return null;
  }
}

// Fetch order history from Spring Boot
async function fetchOrderHistory(authHeader) {
  try {
    const response = await axios.get(`${SPRING_BOOT_URL}/api/orders`, {
      headers: { Authorization: authHeader },
    });
    return response.data;
  } catch (error) {
    console.log("Order History Fetch Error:", error.message);
    return null;
  }
}

// Fetch user wallet from Spring Boot
async function fetchUserWallet(authHeader) {
  try {
    const response = await axios.get(`${SPRING_BOOT_URL}/api/wallet`, {
      headers: { Authorization: authHeader },
    });
    return response.data;
  } catch (error) {
    console.log("Wallet Fetch Error:", error.message);
    return null;
  }
}

// Fetch wallet transactions from Spring Boot
async function fetchWalletTransactions(authHeader) {
  try {
    const response = await axios.get(
      `${SPRING_BOOT_URL}/api/wallet/transactions`,
      {
        headers: { Authorization: authHeader },
      },
    );
    return response.data;
  } catch (error) {
    console.log("Transactions Fetch Error:", error.message);
    return null;
  }
}

// Known coin names and symbols — local keyword matching (no Gemini quota used)
const KNOWN_COINS = [
  "bitcoin","btc","ethereum","eth","tether","usdt","bnb","solana","sol",
  "usdc","xrp","ripple","dogecoin","doge","toncoin","ton","cardano","ada",
  "shiba","shib","avalanche","avax","polkadot","dot","chainlink","link",
  "bitcoin cash","bch","litecoin","ltc","uniswap","uni","polygon","matic",
  "dai","stellar","xlm","monero","xmr","cosmos","atom","okb","hedera",
  "hbar","internet computer","icp","filecoin","fil","aptos","apt",
  "arbitrum","arb","near","vechain","vet","optimism","op","injective","inj",
];

// Extract coin name from query using local keyword matching — no Gemini quota used
function extractCoinName(userQuery) {
  const q = userQuery.toLowerCase();
  // Check full names first (longest match wins)
  const sorted = [...KNOWN_COINS].sort((a, b) => b.length - a.length);
  for (const coin of sorted) {
    if (q.includes(coin)) return coin;
  }
  return null;
}

// Detect query intent via keyword matching — no Gemini quota used
function detectIntent(userQuery, coinName) {
  const q = userQuery.toLowerCase();
  if (q.includes("price") || q.includes("worth") || q.includes("cost") || q.includes("value")) return "price";
  if (q.includes("market cap") || q.includes("marketcap")) return "market_cap";
  if (q.includes("volume") || q.includes("trading volume")) return "volume";
  if (q.includes("change") || q.includes("24h") || q.includes("gain") || q.includes("loss") || q.includes("up") || q.includes("down")) return "change";
  return "general";
}

// Main chatbot route
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    const authHeader = req.headers.authorization;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const cleanMessage = message.toLowerCase().trim();
    // Identify user by auth header or IP
    const userId = authHeader || req.ip;
    if (!conversationMemory[userId]) {
      conversationMemory[userId] = { history: [] };
    } else if (!conversationMemory[userId].history) {
      conversationMemory[userId].history = [];
    }

    // Attempt to extract a coin name from the message; if none, use previous coin from memory
    let coinName = extractCoinName(cleanMessage);
    if (coinName) {
      conversationMemory[userId].lastCoin = coinName;
    } else if (conversationMemory[userId].lastCoin) {
      coinName = conversationMemory[userId].lastCoin;
    }

    // ------------------ News Query Branch ------------------
    if (
      cleanMessage.includes("news") ||
      cleanMessage.includes("headlines") ||
      cleanMessage.includes("latest news") ||
      cleanMessage.includes("market news")
    ) {
      const newsItems = await getLatestNews(5);
      if (newsItems && newsItems.length > 0) {
        let newsReply = "📰 **Latest Market News:**\n\n";
        newsItems.forEach((item) => {
          newsReply += `• [${item.title}](${item.url}) (Source: ${item.source})\n`;
        });
        updateConversationMemory(userId, cleanMessage, newsReply);
        return res.json({ reply: newsReply });
      } else {
        const reply = "No news available at the moment.";
        updateConversationMemory(userId, cleanMessage, reply);
        return res.json({ reply });
      }
    }
    // ---------------- End News Query Branch ----------------

    // ------------------ Recommendation Branch (Local Advisor) ------------------
    const isAdviceRequest = [
      "best share", "best coin", "what should i buy", "which coin should i buy", 
      "future investment", "recommend", "suggest", "which crypto", "what to buy",
      "which should i buy", "which coin", "invest in"
    ].some(kw => cleanMessage.includes(kw));

    if (isAdviceRequest) {
      let wallet = null;
      if (authHeader) {
        wallet = await fetchUserWallet(authHeader);
      }
      
      const balance = wallet ? wallet.balance : 0;
      
      return new Promise((resolve) => {
        db.all(
          "SELECT name, symbol, price, change_24h FROM crypto_prices ORDER BY change_24h DESC LIMIT 5",
          [],
          (err, rows) => {
            if (err || !rows || rows.length === 0) {
              const reply = "I couldn't fetch the latest market trends right now.";
              updateConversationMemory(userId, cleanMessage, reply);
              return resolve(res.json({ reply }));
            }

            let advice = `💡 **Investment Analysis & Recommendations:**\n\n`;
            if (wallet) {
              advice += `Your current wallet balance is **$${balance.toFixed(2)}**.\n\n`;
            } else {
              advice += `*(Login to see recommendations tailored to your wallet balance)*\n\n`;
            }

            advice += `Here are the top performing coins in the last 24 hours that you might consider for future investment:\n`;
            
            rows.forEach((coin) => {
              const affordable = wallet && balance >= coin.price;
              const affordableText = affordable ? " ✅ (You can afford a full coin)" : "";
              advice += `• **${coin.name} (${coin.symbol})**: $${coin.price.toFixed(2)} (Up ${coin.change_24h}%)${affordableText}\n`;
            });

            if (wallet && balance < 10) {
              advice += `\n*Since your balance is a bit low, you could consider fractional buying or topping up your wallet!*`;
            } else if (wallet) {
              advice += `\n*You have enough balance to start investing in these trending markets right now. Type "Buy [Coin Name]" to get started!*`;
            }

            updateConversationMemory(userId, cleanMessage, advice);
            resolve(res.json({ reply: advice }));
          }
        );
      });
    }
    // ---------------- End Recommendation Branch ----------------

    // ------------------ Buy/Sell Order Branch ------------------
    if (
      authHeader &&
      (cleanMessage.includes("buy") || cleanMessage.includes("sell"))
    ) {
      const orderType = cleanMessage.includes("buy") ? "BUY" : "SELL";

      // Extract order number from query (first number found)
      const amountMatch = cleanMessage.match(/(\d+(\.\d+)?)/);
      if (!amountMatch) {
        const reply = `Please specify the amount to ${orderType.toLowerCase()}.`;
        updateConversationMemory(userId, cleanMessage, reply);
        return res.json({ reply });
      }
      const parsedNumber = parseFloat(amountMatch[0]);

      // Determine if the user specified a dollar amount (if query contains "dollar", "usd", or "worth")
      const isDollar =
        cleanMessage.includes("dollar") ||
        cleanMessage.includes("usd") ||
        cleanMessage.includes("worth");

      // For BUY: if dollar amount, quantity = amount/price; if quantity is specified, quantity = parsedNumber
      // For SELL: assume the number means quantity directly
      let quantity;
      if (orderType === "BUY") {
        if (isDollar) {
          const cryptoData = await getCryptoData(coinName);
          if (!cryptoData) {
            const reply = `⚠️ Couldn't find data for ${coinName}`;
            updateConversationMemory(userId, cleanMessage, reply);
            return res.json({ reply });
          }
          quantity = parsedNumber / cryptoData.price;
        } else {
          quantity = parsedNumber;
        }
      } else {
        quantity = parsedNumber;
      }

      if (!coinName) {
        const reply = "Please specify which coin you want to trade.";
        updateConversationMemory(userId, cleanMessage, reply);
        return res.json({ reply });
      }

      // Get coin details for price calculation
      const cryptoData = await getCryptoData(coinName);
      if (!cryptoData) {
        const reply = `⚠️ Couldn't find data for ${coinName}`;
        updateConversationMemory(userId, cleanMessage, reply);
        return res.json({ reply });
      }

      // For BUY, validate wallet balance; for SELL, validate portfolio quantity
      if (orderType === "BUY") {
        const wallet = await fetchUserWallet(authHeader);
        if (!wallet) {
          const reply = "❌ Couldn't fetch wallet balance.";
          updateConversationMemory(userId, cleanMessage, reply);
          return res.json({ reply });
        }
        const cost = isDollar ? parsedNumber : quantity * cryptoData.price;
        if (cost > wallet.balance) {
          const reply = "Insufficient wallet balance to buy.";
          updateConversationMemory(userId, cleanMessage, reply);
          return res.json({ reply });
        }
      } else {
        // SELL
        const portfolio = await fetchUserPortfolio(authHeader);
        if (!portfolio) {
          const reply = "❌ Couldn't fetch your portfolio.";
          updateConversationMemory(userId, cleanMessage, reply);
          return res.json({ reply });
        }
        const assetFound = portfolio.find(
          (asset) =>
            asset.coin.name.toLowerCase() === coinName ||
            asset.coin.symbol.toLowerCase() === coinName,
        );
        if (!assetFound) {
          const reply = `You are not holding ${coinName}.`;
          updateConversationMemory(userId, cleanMessage, reply);
          return res.json({ reply });
        }
        if (assetFound.quantity < quantity) {
          const reply = "Insufficient quantity to sell.";
          updateConversationMemory(userId, cleanMessage, reply);
          return res.json({ reply });
        }
      }

      // Use the full coin name from the database (in lowercase) as coin id
      const coinId = cryptoData.name.toLowerCase();
      const orderData = {
        coinId,
        quantity: parseFloat(quantity.toFixed(8)),
        orderType,
      };

      try {
        const response = await axios.post(
          `${SPRING_BOOT_URL}/api/orders/pay`,
          orderData,
          { headers: { Authorization: authHeader } },
        );
        const reply = `Order placed successfully for ${orderType.toLowerCase()}ing ${cryptoData.name}.`;
        updateConversationMemory(userId, cleanMessage, reply);
        return res.json({ reply });
      } catch (error) {
        console.error("Order Error:", error.message);
        const reply =
          "❌ Failed to place the order. " +
          (error.response?.data?.error || error.message);
        updateConversationMemory(userId, cleanMessage, reply);
        return res.json({ reply });
      }
    }
    // ---------------- End Buy/Sell Branch ----------------

    // If coin is mentioned and query includes "holding", handle portfolio holding check
    if (
      coinName &&
      authHeader &&
      (cleanMessage.includes("holding") ||
        cleanMessage.includes("am i holding"))
    ) {
      const portfolio = await fetchUserPortfolio(authHeader);
      if (!portfolio) {
        const reply = "❌ Couldn't fetch your portfolio.";
        updateConversationMemory(userId, cleanMessage, reply);
        return res.json({ reply });
      }
      const assetFound = portfolio.find(
        (asset) =>
          asset.coin.name.toLowerCase() === coinName ||
          asset.coin.symbol.toLowerCase() === coinName,
      );
      if (assetFound) {
        const coinData = await getCryptoData(assetFound.coin.id);
        const value =
          coinData && coinData.price
            ? (assetFound.quantity * coinData.price).toFixed(2)
            : "N/A";
        const reply =
          `Yes, you are holding ${assetFound.quantity} ${assetFound.coin.name} (${assetFound.coin.symbol}).` +
          (value !== "N/A" ? ` Its current value is $${value}.` : "");
        updateConversationMemory(userId, cleanMessage, reply);
        return res.json({ reply });
      } else {
        const reply = `You are not holding ${coinName}.`;
        updateConversationMemory(userId, cleanMessage, reply);
        return res.json({ reply });
      }
    }

    // If a coin is mentioned, handle general crypto data queries (price, market cap, etc.)
    if (coinName) {
      const cryptoData = await getCryptoData(coinName);
      if (cryptoData) {
        const intent = detectIntent(cleanMessage, coinName);
        const responses = {
          price: `💰 Current price of ${cryptoData.name} (${cryptoData.symbol.toUpperCase()}) is $${cryptoData.price.toFixed(2)}`,
          market_cap: `📊 Market Cap: $${cryptoData.market_cap.toLocaleString()}`,
          volume: `💹 24h Volume: $${cryptoData.volume_24h.toLocaleString()}`,
          change: `📈 24h Change: ${cryptoData.change_24h}%`,
          general: null,
        };
        if (responses[intent]) {
          const reply = responses[intent];
          updateConversationMemory(userId, cleanMessage, reply);
          return res.json({ reply });
        }
      } else {
        const reply = `⚠️ Couldn't find data for ${coinName}`;
        updateConversationMemory(userId, cleanMessage, reply);
        return res.json({ reply });
      }
    }

    // Handle other authenticated queries (profile, portfolio, orders, wallet, transactions)
    if (authHeader) {
      if (cleanMessage.includes("my profile")) {
        const profile = await fetchUserProfile(authHeader);
        if (!profile) {
          const reply = "❌ Couldn't fetch your profile";
          updateConversationMemory(userId, cleanMessage, reply);
          return res.json({ reply });
        }
        const reply = `👤 Your Profile:
          Name: ${profile.fullName}
          Email: ${profile.email}
          Phone: ${profile.mobile || "Not provided"}
          Address: ${[profile.address, profile.city, profile.postcode, profile.country].filter(Boolean).join(", ")}
          DOB: ${profile.dob ? new Date(profile.dob).toISOString().split("T")[0] : "Not provided"}`
          .replace(/\s+/g, " ")
          .trim();
        updateConversationMemory(userId, cleanMessage, reply);
        return res.json({ reply });
      }

      if (cleanMessage.includes("my portfolio")) {
        const portfolio = await fetchUserPortfolio(authHeader);
        if (!portfolio) {
          const reply = "❌ Couldn't fetch your portfolio";
          updateConversationMemory(userId, cleanMessage, reply);
          return res.json({ reply });
        }
        const portfolioDetails = await Promise.all(
          portfolio.map(async (asset) => {
            const coinData = await getCryptoData(asset.coin.id);
            return `${asset.coin.name} (${asset.coin.symbol}): ${asset.quantity} @ $${coinData?.price || "N/A"}`;
          }),
        );
        const reply = `📦 Your Portfolio:\n${portfolioDetails.join("\n")}`;
        updateConversationMemory(userId, cleanMessage, reply);
        return res.json({ reply });
      }

      if (cleanMessage.includes("my orders")) {
        const orders = await fetchOrderHistory(authHeader);
        if (!orders) {
          const reply = "❌ Couldn't fetch your orders";
          updateConversationMemory(userId, cleanMessage, reply);
          return res.json({ reply });
        }
        const orderDetails = orders.map(
          (order) =>
            `${order.type.toUpperCase()} ${order.quantity} ${order.coin} @ $${order.price}`,
        );
        const reply = `📝 Order History:\n${orderDetails.join("\n")}`;
        updateConversationMemory(userId, cleanMessage, reply);
        return res.json({ reply });
      }

      if (cleanMessage.includes("wallet balance")) {
        const wallet = await fetchUserWallet(authHeader);
        if (!wallet) {
          const reply = "❌ Couldn't fetch wallet balance";
          updateConversationMemory(userId, cleanMessage, reply);
          return res.json({ reply });
        }
        const reply = `💰 Wallet Balance: $${wallet.balance.toFixed(2)}\nWallet ID: #FAVHJY${wallet.id}`;
        updateConversationMemory(userId, cleanMessage, reply);
        return res.json({ reply });
      }

      if (
        cleanMessage.includes("wallet history") ||
        cleanMessage.includes("wallet transactions")
      ) {
        const transactions = await fetchWalletTransactions(authHeader);
        if (!transactions) {
          const reply = "❌ Couldn't fetch transactions";
          updateConversationMemory(userId, cleanMessage, reply);
          return res.json({ reply });
        }
        const transactionList = transactions
          .slice(0, 5)
          .map(
            (t) =>
              `${t.date}: ${t.type} $${t.amount} (${t.purpose || "No description"})`,
          )
          .join("\n");
        const reply = `📝 Recent Transactions:\n${transactionList || "No transactions found"}`;
        updateConversationMemory(userId, cleanMessage, reply);
        return res.json({ reply });
      }
    }

    // General AI response branch with conversation history and verified data
    const contextParts = [];
    if (authHeader) {
      const [profile, portfolio, wallet, transactions] = await Promise.all([
        fetchUserProfile(authHeader),
        fetchUserPortfolio(authHeader),
        fetchUserWallet(authHeader),
        fetchWalletTransactions(authHeader),
      ]);
      if (profile) {
        contextParts.push(
          `👤 User Profile:\n- Name: ${profile.fullName}\n- Email: ${profile.email}\n- Phone: ${profile.mobile || "Not provided"}`,
        );
      }
      if (wallet) {
        contextParts.push(`💰 Wallet Balance: $${wallet.balance.toFixed(2)}`);
      }
      if (portfolio && portfolio.length > 0) {
        const portfolioDetails = await Promise.all(
          portfolio.map(async (asset) => {
            const coinData = await getCryptoData(asset.coin.id);
            const currentValue = coinData?.price
              ? (asset.quantity * coinData.price).toFixed(2)
              : "N/A";
            return `- ${asset.quantity} ${asset.coin.symbol} ($${currentValue}) @ $${coinData?.price?.toFixed(2) || "N/A"}`;
          }),
        );
        contextParts.push(
          `📦 Portfolio Holdings:\n${portfolioDetails.join("\n")}`,
        );
      }
      if (transactions && transactions.length > 0) {
        const transactionDetails = transactions
          .slice(0, 10)
          .map((t) => `- ${new Date(t.date).toISOString().split('T')[0]}: ${t.type} $${t.amount} (${t.purpose || "No description"})`)
          .join("\n");
        contextParts.push(`📝 Recent Wallet Transactions:\n${transactionDetails}`);
      }
    }

    const conversationHistory = conversationMemory[userId].history
      .slice(-10)
      .join("\n");
    const prompt = `You are a financial assistant with full access to the user's data.
Use the following conversation history to maintain context:
${conversationHistory}

Additionally, use the verified user data below:
${contextParts.join("\n\n")}

Current Query: "${cleanMessage}"
Provide a detailed, specific response using the available data.
For portfolio questions, list exact holdings with values.
For wallet questions, include exact amounts and recent transactions.`;

    try {
      const result = await model.generateContent(prompt);
      const reply = cleanResponse(result.response.text());
      updateConversationMemory(userId, cleanMessage, reply);
      return res.json({ reply });
    } catch (aiError) {
      // Gemini rate-limit or quota — return friendly fallback
      if (aiError.status === 429) {
        const fallback = "I'm currently at my AI usage limit. For specific coin prices, try asking: 'bitcoin price', 'ethereum price', etc. I can answer those instantly without AI!";
        updateConversationMemory(userId, cleanMessage, fallback);
        return res.json({ reply: fallback });
      }
      throw aiError; // Re-throw other errors
    }
  } catch (error) {
    console.error("Chat Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
