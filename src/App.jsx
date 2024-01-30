import AppLayout from './components/layout/AppLayout';
import { CryptoContextProvider } from './context/crypto-contex';


export default function App() {
  
  return  (
    <CryptoContextProvider>
      <AppLayout />
    </CryptoContextProvider>
  )
}
