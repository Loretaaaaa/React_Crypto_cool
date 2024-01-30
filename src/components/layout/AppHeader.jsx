import { Layout, Select, Space, Button, Modal } from 'antd';
import { useCrypto } from '../../context/crypto-contex';
import { useState, useEffect } from 'react';
import CoinInfoModal from '../CoinInfoModal';

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

    <Button type="primary">Add Asset</Button>

    <Modal 
      open={modal} 
      onCancel={() => setModal(false)}
      footer={null}
    >
      <CoinInfoModal coin={coin} />
    </Modal>
  </Layout.Header>)
}