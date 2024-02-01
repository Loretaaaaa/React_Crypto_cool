import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { fakeFetchCrypto, fetchAssets } from "../api";
import { percentDifference } from "../utils";

interface Asset {
  id: string;
  amount: number;
  price: number;
  date: Date;
  grow?: boolean;
  growPercent?: number;
  totalAmount?: number;
  totalProfit?: number;
  name?: string;
  icon?: string;
}

interface CryptoContextProps {
  assets: Asset[];
  crypto: Asset[]; // You might need to adjust this type based on the actual data structure
  loading: boolean;
  addAsset: (newAsset: Asset) => void;
}


const CryptoContext = createContext<CryptoContextProps>({
  assets: [],
  crypto: [],
  loading: false,
  addAsset: () => { }, // Placeholder function
});

interface CryptoContextProviderProps {
  children: ReactNode;
}

export function CryptoContextProvider({ children }: CryptoContextProviderProps) {
  const [loading, setLoading] = useState(false);
  const [crypto, setCrypto] = useState<Asset[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);

  function mapAssets(assets: Asset[], result: Asset[]): Asset[] {
    return assets.map((asset) => {
      const coin = result.find((c) => c.id === asset.id);
      return {
        grow: asset.price < coin.price, //boolean
        growPercent: percentDifference(asset.price, coin.price),
        totalAmount: asset.amount * coin.price,
        totalProfit: asset.amount * coin.price - asset.amount * asset.price,
        name: coin.name,
        ...asset,
      };
    });
  }

  useEffect(() => {
    async function preload() {
      setLoading(true);
      const response: { result?: Asset[] } = await fakeFetchCrypto();

      if (response.result) {
        const { result } = response;
        const assets = await fetchAssets();

        setAssets(mapAssets(assets as Asset[], result));
        setCrypto(result);
        setLoading(false);
      } else {
        console.error('The response does not contain the "result" property.');
        setLoading(false);
      }
    }

    preload();
  }, []);


  function addAsset(newAsset: Asset) {
    setAssets((prev) => mapAssets([...prev, newAsset], crypto));
  }

  return (
    <CryptoContext.Provider value={{ loading, crypto, assets, addAsset }}>
      {children}
    </CryptoContext.Provider>
  );
}

export default CryptoContext;

export function useCrypto() {
  return useContext(CryptoContext);
}
