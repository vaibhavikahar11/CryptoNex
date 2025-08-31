import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import TreadingHistory from "./TreadingHistory";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserAssets } from "@/Redux/Assets/Action";
import { getUserWallet } from "@/Redux/Wallet/Action";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// ----- Static Data for Top 50 Coins -----
const staticCoins = [
  { id: "btc", name: "Bitcoin", price: 84193, image: "https://w7.pngwing.com/pngs/145/494/png-transparent-gold-colored-bitcoin-coin-bitcoin-cryptocurrency-monero-initial-coin-offering-bitcoin-medal-gold-metal-thumbnail.png" },
  { id: "eth", name: "Ethereum", price: 1931.46, image: "https://www.citypng.com/public/uploads/preview/ethereum-eth-round-logo-icon-png-701751694969815akblwl2552.png" },
  { id: "bnb", name: "Binance Coin", price: 612.50, image: "https://w7.pngwing.com/pngs/803/494/png-transparent-binance-coin-sign-icon-shiny-golden-symmetric-design.png" },
  { id: "ada", name: "Cardano", price: 0.768, image: "https://cdn4.iconfinder.com/data/icons/crypto-currency-and-coin-2/256/cardano_ada-1024.png" },
  { id: "doge", name: "Dogecoin", price: 0.1748, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTf2HxwuBXfjRHOAOGPrbyeJenImodJp68tow&s" },
  { id: "xrp", name: "XRP", price: 2.399, image: "https://cdn-icons-png.flaticon.com/512/4821/4821657.png" },
  { id: "dot", name: "Polkadot", price: 4.3620, image: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png" },
  { id: "sol", name: "Solana", price: 134.63, image: "https://cdn.iconscout.com/icon/premium/png-256-thumb/solana-8544144-7002700.png" },
  { id: "avax", name: "Avalanche", price: 18.55, image: "https://cryptologos.cc/logos/avalanche-avax-logo.png" },
  { id: "link", name: "Chainlink", price: 14.05, image: "https://w7.pngwing.com/pngs/670/373/png-transparent-chainlink-crypto-chainlink-coin-chainlink-logo-chainlink-sign-chainlink-symbol-chainlink-3d-icon.png" },
  { id: "ltc", name: "Litecoin", price: 91.22, image: "https://cryptologos.cc/logos/litecoin-ltc-logo.png" },
  { id: "bch", name: "Bitcoin Cash", price: 345.4, image: "https://static.vecteezy.com/system/resources/previews/011/222/802/original/bitcoin-cash-bch-badge-crypto-3d-rendering-png.png " },
  { id: "algo", name: "Algorand", price: 0.1993, image: "https://png.pngtree.com/png-clipart/20230818/original/pngtree-isolated-algorand-algo-coin-icon-on-a-white-background-vector-picture-image_11030585.png" },
  { id: "xlm", name: "Stellar", price: 7.24, image: "https://static.vecteezy.com/system/resources/previews/024/093/341/non_2x/stellar-xlm-glass-crypto-coin-3d-illustration-free-png.png" },
  { id: "vet", name: "VeChain", price: 0.025, image: "https://static.vecteezy.com/system/resources/previews/024/093/489/large_2x/vechain-vet-glass-crypto-coin-3d-illustration-free-png.png" },
  { id: "trx", name: "TRON", price: 0.320, image: "https://static.vecteezy.com/system/resources/previews/024/093/380/non_2x/tron-trx-glass-crypto-coin-3d-illustration-free-png.png " },
  { id: "xmr", name: "Monero", price: 211.05, image: "https://static.vecteezy.com/system/resources/previews/024/093/120/non_2x/monero-xmr-glass-crypto-coin-3d-illustration-free-png.png" },
  { id: "eos", name: "EOS", price: 0.501, image: "https://static.vecteezy.com/system/resources/previews/024/092/843/non_2x/eos-glass-crypto-coin-3d-illustration-free-png.png" },
  { id: "xtz", name: "Tezos", price: 2.5, image: "https://static.vecteezy.com/system/resources/previews/024/093/412/original/tezos-xtz-glass-crypto-coin-3d-illustration-free-png.png" },
  { id: "atom", name: "Cosmos", price: 8, image: "https://static.vecteezy.com/system/resources/previews/024/092/789/non_2x/cosmos-atom-glass-crypto-coin-3d-illustration-free-png.png" },
  { id: "aave", name: "Aave", price: 90, image: "https://png.pngtree.com/png-clipart/20230816/original/pngtree-aave-token-symbol-cryptocurrency-logo-picture-image_7978846.png" },
  { id: "uni", name: "Uniswap", price: 6.145, image: "https://static.vecteezy.com/system/resources/previews/024/093/484/original/uniswap-uni-glass-crypto-coin-3d-illustration-free-png.png" },
  { id: "cake", name: "PancakeSwap", price: 20, image: "https://static.vecteezy.com/system/resources/previews/024/093/216/non_2x/pancakeswap-cake-glass-crypto-coin-3d-illustration-free-png.png" },
  { id: "neo", name: "NEO", price: 20, image: "https://cdn.pixabay.com/photo/2021/06/13/23/39/neo-6334556__340.png" },
  { id: "miota", name: "IOTA", price: 0.35, image: "https://static.vecteezy.com/system/resources/previews/024/092/970/non_2x/iota-miota-glass-crypto-coin-3d-illustration-free-png.png" },
  { id: "mkr", name: "Maker", price: 2500, image: "https://www.pngall.com/wp-content/uploads/10/Maker-Crypto-Logo-PNG-Pic.png" },
  { id: "comp", name: "Compound", price: 400, image: "https://static.vecteezy.com/system/resources/previews/024/092/773/non_2x/compound-comp-glass-crypto-coin-3d-illustration-free-png.png" },
  { id: "sushi", name: "SushiSwap", price: 10, image: "https://static.vecteezy.com/system/resources/previews/024/093/355/large_2x/sushiswap-sushi-glass-crypto-coin-3d-illustration-free-png.png" },
  { id: "egld", name: "Elrond", price: 40, image: "https://static.vecteezy.com/system/resources/previews/011/307/298/original/elrond-egld-badge-crypto-isolated-on-white-background-blockchain-technology-3d-rendering-free-png.png" },
  { id: "hbar", name: "Hedera Hashgraph", price: 0.25, image: "https://static.vecteezy.com/system/resources/previews/024/092/938/non_2x/hedera-hbar-glass-crypto-coin-3d-illustration-free-png.png" },
  { id: "fil", name: "Filecoin", price: 5, image: "https://www.pngall.com/wp-content/uploads/10/Filecoin-Crypto-Logo.png" },
  { id: "theta", name: "THETA", price: 7, image: "https://static.vecteezy.com/system/resources/previews/024/093/423/large_2x/theta-network-theta-glass-crypto-coin-3d-illustration-free-png.png" },
  { id: "zil", name: "Zilliqa", price: 0.1, image: "https://static.vecteezy.com/system/resources/previews/025/338/706/non_2x/zilliqa-zil-glass-crypto-coin-3d-illustration-free-png.png" },
  { id: "chz", name: "Chiliz", price: 0.4, image: "https://static.vecteezy.com/system/resources/previews/024/092/762/non_2x/chiliz-chz-glass-crypto-coin-3d-illustration-free-png.png" },
  { id: "enj", name: "Enjin Coin", price: 1.2, image: "https://static.vecteezy.com/system/resources/previews/024/092/853/original/enjin-coin-enj-glass-crypto-coin-3d-illustration-free-png.png" },
  { id: "waves", name: "Waves", price: 15, image: "https://static.vecteezy.com/system/resources/previews/024/093/506/non_2x/waves-glass-crypto-coin-3d-illustration-free-png.png" },
  { id: "btt", name: "BitTorrent", price: 0.005, image: "https://dougbelshaw.com/blog/wp-content/uploads/2020/03/bittorrent-logo-800x800.png" },
  { id: "ftm", name: "Fantom", price: 0.8, image: "https://cryptologos.cc/logos/fantom-ftm-logo.png" },
  { id: "one", name: "Harmony", price: 0.15, image: "https://static.vecteezy.com/system/resources/previews/024/092/936/non_2x/harmony-one-glass-crypto-coin-3d-illustration-free-png.png" },
  { id: "mana", name: "Decentraland", price: 2, image: "https://www.pngall.com/wp-content/uploads/10/Decentraland-Crypto-Logo-PNG-Cutout.png" },
  { id: "grt", name: "The Graph", price: 0.3, image: "https://static.vecteezy.com/system/resources/previews/024/093/415/original/the-graph-grt-glass-crypto-coin-3d-illustration-free-png.png" },
  { id: "snx", name: "Synthetix", price: 15, image: "https://static.vecteezy.com/system/resources/previews/025/338/705/original/synthetix-snx-glass-crypto-coin-3d-illustration-free-png.png" },
  { id: "cel", name: "Celsius", price: 4, image: "https://101blockchains.com/wp-content/uploads/2021/11/Celsius.png" },
  { id: "nexo", name: "Nexo", price: 1.5, image: "https://static.vecteezy.com/system/resources/previews/024/093/159/non_2x/nexo-glass-crypto-coin-3d-illustration-free-png.png" },
  { id: "okb", name: "OKB", price: 15, image: "https://static.vecteezy.com/system/resources/previews/024/093/165/original/okb-glass-crypto-coin-3d-illustration-free-png.png" },
  { id: "ht", name: "Huobi Token", price: 8, image: "https://static.vecteezy.com/system/resources/previews/024/092/963/original/huobi-token-ht-glass-crypto-coin-3d-illustration-free-png.png" },
  { id: "shib", name: "Shiba Inu", price: 0.00001, image: "https://static.vecteezy.com/system/resources/previews/011/307/328/original/shiba-inu-shib-badge-crypto-3d-rendering-free-png.png" },
  { id: "crv", name: "Curve DAO", price: 2, image: "https://cryptologos.cc/logos/curve-dao-token-crv-logo.png" },
  { id: "ar", name: "Arweave", price: 15, image: "https://static.vecteezy.com/system/resources/previews/024/092/627/original/arweave-ar-glass-crypto-coin-3d-illustration-free-png.png" },
  { id: "gala", name: "Gala", price: 0.05, image: "https://cdn3d.iconscout.com/3d/premium/thumb/gala-coin-7105850-5752949.png" },
];

const Portfolio = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState("portfolio");
  const { asset } = useSelector((store) => store);
  const { wallet } = useSelector((store) => store);
  const [recommendedPairs, setRecommendedPairs] = useState([]);
  const [fakeAssets, setFakeAssets] = useState([]);

  // Fetch assets and wallet on mount.
  useEffect(() => {
    dispatch(getUserAssets(localStorage.getItem("jwt")));
    dispatch(getUserWallet(localStorage.getItem("jwt")));
  }, [dispatch]);

  // Initialize fakeAssets once the assets are loaded.
  useEffect(() => {
    if (asset.userAssets && asset.userAssets.length > 0) {
      const initializedAssets = asset.userAssets.map((item) => ({
        ...item,
        simulatedPrice: item.coin.current_price,
      }));
      setFakeAssets(initializedAssets);
    }
  }, [asset.userAssets]);

  // Update simulated prices every 3 seconds.
  useEffect(() => {
    if (fakeAssets.length === 0) return;
    const interval = setInterval(() => {
      setFakeAssets((prevAssets) =>
        prevAssets.map((item) => {
          // Random fluctuation between -0.5% and +0.5%
          const randomFactor = (Math.random() - 0.5) / 100;
          const newPrice = item.simulatedPrice * (1 + randomFactor);
          return { ...item, simulatedPrice: newPrice };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [fakeAssets]);

  // Calculate estimated PnL based on simulated prices.
  const estimatedPNL =
    fakeAssets?.reduce((total, item) => {
      const pnl = item.quantity * (item.simulatedPrice - item.coin.current_price);
      return total + pnl;
    }, 0) || 0;

  // Recommendation Engine: Suggest coin pairs whose total static price is as close as possible to the wallet balance.
  useEffect(() => {
    if (wallet.userWallet && wallet.userWallet.balance) {
      const balance = wallet.userWallet.balance;
      const pairs = [];
      for (let i = 0; i < staticCoins.length; i++) {
        for (let j = i + 1; j < staticCoins.length; j++) {
          const coin1 = staticCoins[i];
          const coin2 = staticCoins[j];
          const total = coin1.price + coin2.price;
          if (total <= balance) {
            pairs.push({ coin1, coin2, total });
          }
        }
      }
      pairs.sort((a, b) => b.total - a.total);
      setRecommendedPairs(pairs.slice(0, 5));
    }
  }, [wallet]);

  const handleTabChange = (value) => {
    setCurrentTab(value);
  };

  return (
    <div className="px-10 py-5 mt-10">
      {/* Tab Selector */}
      <div className="pb-5 flex items-center gap-5">
        <Select onValueChange={handleTabChange} defaultValue="portfolio">
          <SelectTrigger className="w-[180px] py-[1.2rem]">
            <SelectValue placeholder="Select Portfolio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="portfolio">Portfolio</SelectItem>
            <SelectItem value="history">History</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {currentTab === "portfolio" ? (
        <>
          {/* Estimated PnL Card */}
          <Card className="mb-5">
            <CardHeader>
              <CardTitle>Estimated PnL </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={estimatedPNL >= 0 ? "text-green-500 text-xl" : "text-red-600 text-xl"}>
                ${estimatedPNL.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          {/* User Assets Table with simulated fluctuations */}
          <Table className="px-5 relative">
            <TableHeader className="py-9">
              <TableRow className="sticky top-0 left-0 right-0 bg-background">
                <TableHead className="py-3">Assets</TableHead>
                <TableHead>Simulated Price</TableHead>
                <TableHead>UNIT</TableHead>
                <TableHead>Change ($)</TableHead>
                <TableHead>Change (%)</TableHead>
                <TableHead className="text-right">Simulated Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fakeAssets?.map((item) => {
                const originalPrice = item.coin.current_price;
                const simulatedPrice = item.simulatedPrice;
                const changeValue = simulatedPrice - originalPrice;
                const changePercentage = (changeValue / originalPrice) * 100;
                return (
                  <TableRow
                    key={item.id}
                    onClick={() => navigate(`/market/${item.coin.id}`)}
                  >
                    <TableCell className="font-medium flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={item.coin.image} alt={item.coin.symbol} />
                      </Avatar>
                      <span>{item.coin.name}</span>
                    </TableCell>
                    <TableCell>${simulatedPrice.toFixed(2)}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className={changeValue < 0 ? "text-red-600 font-bold" : "text-green-500 font-bold"}>
                      {changeValue.toFixed(2)}
                    </TableCell>
                    <TableCell className={changePercentage < 0 ? "text-red-600 font-bold" : "text-green-500 font-bold"}>
                      {changePercentage.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">
                      ${(simulatedPrice * item.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Recommended Coin Pairs Section */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-5">Recommended Coin Pairs</h2>
            {recommendedPairs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {recommendedPairs.map((pair, index) => (
                  <Card key={index} className="p-5">
                    <CardHeader>
                      <CardTitle className="text-xl">
                        {pair.coin1.name} + {pair.coin2.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Total Price: ${pair.total.toFixed(2)}</p>
                      <div className="flex items-center mt-3 gap-3">
                        <Avatar>
                          <AvatarImage src={pair.coin1.image} alt={pair.coin1.name} />
                        </Avatar>
                        <Avatar>
                          <AvatarImage src={pair.coin2.image} alt={pair.coin2.name} />
                        </Avatar>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No coin pairs can be recommended within your wallet balance.
              </p>
            )}
          </div>
        </>
      ) : (
        <TreadingHistory />
      )}
    </div>
  );
};

export default Portfolio;
