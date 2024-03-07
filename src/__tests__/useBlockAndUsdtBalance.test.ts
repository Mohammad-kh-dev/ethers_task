import { renderHook } from '@testing-library/react';
import axios from 'axios';

import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { waitFor } from '@testing-library/react';
import useBlockAndUsdtBalance from '../hooks/BlockAndUsdtBalance';
jest.mock('axios');
jest.mock('ethers');

describe('useBlockAndUsdtBalance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches block number and USDT balance successfully', async () => {
    const mockBlockNumber = 12345;
    const mockBalance: string | never = '100.0';

    const mockedAxiosGet = axios.get as jest.MockedFunction<typeof axios.get>;
    mockedAxiosGet.mockResolvedValueOnce({
      status: 200,
      data: {
        result: 'abi',
      },
    });

    const mockBalanceOf = jest.fn()
    .mockResolvedValueOnce(mockBalance as never) // First call to balanceOf
    .mockResolvedValueOnce(mockBalance as never); 
    const mockProvider = {
      getBlockNumber: jest.fn().mockResolvedValueOnce(mockBlockNumber as never),
    };
    const mockJsonRpcProvider = jest.fn(() => mockProvider);

    jest.mock('formatUnits', () => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(jest.requireActual('formatUnits') as any),
      JsonRpcProvider: mockJsonRpcProvider,
      Contract: jest.fn(() => ({
        balanceOf: mockBalanceOf,
       
      })),
    }));

    const { result } = renderHook(() => useBlockAndUsdtBalance());
    await new Promise(resolve => setTimeout(resolve, 0));

    await waitFor(() => {
      expect(result.current.blockNumber).toEqual(mockBlockNumber);
    });
    expect(result.current.usdtBalance).toEqual(mockBalance);
    expect(result.current.Error1).toBeNull();
  });

  it('handles errors gracefully', async () => {
    const mockError = new Error('Test error');

    const mockedAxiosGet = axios.get as jest.MockedFunction<typeof axios.get>;
    mockedAxiosGet.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useBlockAndUsdtBalance());

    await waitFor(() => {
      // No need to call waitForNextUpdate() here
    });

    expect(result.current.blockNumber).toBeNull();
    expect(result.current.usdtBalance).toBeNull();
    expect(result.current.Error1).toEqual('Error fetching block number:' + mockError);
  });
});
