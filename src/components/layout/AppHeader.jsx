import { Layout, Select, Space, Button, Modal, Drawer} from 'antd';
import { useCrypto } from '../../context/crypto-contex';
import { useState, useEffect } from 'react';
import CoinInfoModal from '../CoinInfoModal';
import AddAssetForm from '../AddAssetForm';

const headerStyle = {
  width: '100%',
  textAlign: 'center',
  height: 60,
  padding: '1rem',
  display: 'flex',
  // backgroundColor: '#fff',
  justifyContent: 'space-between',
  alignItems: 'center',
};

export default function AppHeader() {
  const [select, setSelect] = useState(false);
  const [coin, setCoin] = useState(null);
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(true);
  const { crypto } = useCrypto();

  useEffect (() => {
    const keypress = (event) => {
      if(event.key === '/') {
        setSelect((prev) => !prev);
      }
    }
    document.addEventListener('keypress', keypress)
    return () => document.removeEventListener('keypress', keypress)
  }, [])

  function handleSelect(value) {
    console.log(value)
    setCoin(crypto.find((c) => c.id === value));
    setModal(true);
  }

  return (
  <Layout.Header style={headerStyle}>
    <Select
      style={{
        width: '30%',
      }}
      open={select}
      onSelect={handleSelect}
      onClick={() => setSelect((prev) => !prev)}
      value="press / to open"
      options={crypto.map((coin) =>({
        label: coin.name,
        value: coin.id,
        icon: coin.icon,
      }))}
      optionRender={(option) => (
        <Space>
          <img 
            style={{width: 20}} 
            src={option.data.icon} 
            alt={option.data.label} 
          />  {' '}
          {option.data.label}
        </Space>
      )}
    />

    <Button type="primary" onClick={() => setDrawer(true)}>Add Asset</Button>

    <Modal 
      open={modal} 
      onCancel={() => setModal(false)}
      footer={null}
    >
      <CoinInfoModal coin={coin} />
    </Modal>

    <Drawer  
      width={'40%'} 
      title="Add Asset" 
      onClose={() => setDrawer(false)} 
      open={drawer}
      destroyOnClose
    >
        <AddAssetForm />
      </Drawer>
  </Layout.Header>)
}