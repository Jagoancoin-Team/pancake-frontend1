import { ChainId } from '@pancakeswap/chains'
import { chainlinkOracleCAKE } from '@pancakeswap/prediction'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { chainlinkOracleABI } from 'config/abi/chainlinkOracle'
import { FAST_INTERVAL } from 'config/constants'
import { CAKE_PRICE_COINGECKO_API_URL } from 'config/constants/endpoints'
import { publicClient } from 'utils/wagmi'
import { formatUnits } from 'viem'

// for migration to bignumber.js to avoid breaking changes
export const useCakePrice = ({ enabled = true } = {}) => {
  const { data } = useQuery<BigNumber, Error>({
    queryKey: ['cakePrice'],
    queryFn: async () => new BigNumber(await getCakePriceDs()),
    staleTime: FAST_INTERVAL,
    refetchInterval: FAST_INTERVAL,
    enabled,
  })
  return data ?? BIG_ZERO
}

export const getCakePriceFromOracle = async () => {
  const data = await publicClient({ chainId: ChainId.BSC }).readContract({
    abi: chainlinkOracleABI,
    address: chainlinkOracleCAKE[ChainId.BSC],
    functionName: 'latestAnswer',
  })

  return formatUnits(data, 8)
}

// Define the function to fetch and return the priceUsd as a BigNumber
export const getCakePriceDs = async () => {
  try {
    const response = await fetch(CAKE_PRICE_COINGECKO_API_URL)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()

    // Extract the priceUsd from the API response
    const priceUsd = data['dynasty-coin']?.usd

    // Check if priceUsd is valid
    if (priceUsd === undefined) {
      throw new Error('Price not found')
    }

    // Convert priceUsd to a BigNumber
    const priceBigNumber = new BigNumber(priceUsd)

    // Format to three decimal places
    return priceBigNumber.toFixed(3)
  } catch (error) {
    console.error('Failed to fetch priceUsd:', error)
    return BIG_ZERO.toFixed(3) // Return a BigNumber with value 0 in case of error, formatted to three decimal places
  }
}
