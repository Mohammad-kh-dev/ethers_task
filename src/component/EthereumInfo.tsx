// src/components/EthereumInfo.tsx
import React from 'react';
import useBlockAndUsdtBalance from '../hooks/BlockAndUsdtBalance';


interface EthereumInfoProps {}

const EthereumInfo: React.FC<EthereumInfoProps> = () => {
 const {blockNumber,usdtBalance ,Error1} = useBlockAndUsdtBalance();
  if(Error1 !== null ) {
        return <div>{Error1}</div>;
  }
  return (
    
    <div>
      <p>Latest Block Number: {blockNumber !== null ? blockNumber : 'Loading...'}</p>
      <p>USDT Balance: {usdtBalance !== null ? usdtBalance.toString() : 'Loading...'}</p>
    </div>
  );
};

export default EthereumInfo;
