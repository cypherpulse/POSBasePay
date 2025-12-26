import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useWatchContractEvent } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { POS_VAULT_ADDRESS, POS_VAULT_ABI, baseSepolia } from '@/config/contract';
import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';

// Read hooks
export function useContractBalance() {
  return useReadContract({
    address: POS_VAULT_ADDRESS,
    abi: POS_VAULT_ABI,
    functionName: 'getBalance',
  });
}

export function useContractOwner() {
  return useReadContract({
    address: POS_VAULT_ADDRESS,
    abi: POS_VAULT_ABI,
    functionName: 'owner',
  });
}

export function useContractPaused() {
  return useReadContract({
    address: POS_VAULT_ADDRESS,
    abi: POS_VAULT_ABI,
    functionName: 'paused',
  });
}

export function useMinDeposit() {
  return useReadContract({
    address: POS_VAULT_ADDRESS,
    abi: POS_VAULT_ABI,
    functionName: 'MIN_DEPOSIT',
  });
}

export function useProtocolFeeBps() {
  return useReadContract({
    address: POS_VAULT_ADDRESS,
    abi: POS_VAULT_ABI,
    functionName: 'PROTOCOL_FEE_BPS',
  });
}

export function useTreasury() {
  return useReadContract({
    address: POS_VAULT_ADDRESS,
    abi: POS_VAULT_ABI,
    functionName: 'TREASURY',
  });
}

export function useIsMerchant(address: `0x${string}` | undefined) {
  return useReadContract({
    address: POS_VAULT_ADDRESS,
    abi: POS_VAULT_ABI,
    functionName: 'isMerchant',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

// Role detection hook
export function useUserRole() {
  const { address, isConnected } = useAccount();
  const { data: owner } = useContractOwner();
  const { data: isMerchant } = useIsMerchant(address);

  const isOwner = isConnected && address && owner && address.toLowerCase() === owner.toLowerCase();
  const isMerchantUser = isConnected && (isMerchant === true || isOwner);

  return {
    isConnected,
    address,
    isOwner: !!isOwner,
    isMerchant: !!isMerchantUser,
    role: isOwner ? 'owner' : isMerchantUser ? 'merchant' : 'user',
  };
}

// Write hooks
export function useDeposit() {
  const { toast } = useToast();
  const { address } = useAccount();
  const { writeContractAsync, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const deposit = useCallback(async (amount: string) => {
    if (!address) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet',
        variant: 'destructive',
      });
      return;
    }
    try {
      const value = parseEther(amount);
      await writeContractAsync({
        address: POS_VAULT_ADDRESS,
        abi: POS_VAULT_ABI,
        functionName: 'deposit',
        value,
        account: address,
        chain: baseSepolia,
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.shortMessage || err?.message || 'Transaction failed',
        variant: 'destructive',
      });
    }
  }, [writeContractAsync, toast, address]);

  return { deposit, hash, isPending, isConfirming, isSuccess, error };
}

export function useWithdraw() {
  const { toast } = useToast();
  const { address } = useAccount();
  const { writeContractAsync, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const withdraw = useCallback(async (amount: string) => {
    if (!address) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet',
        variant: 'destructive',
      });
      return;
    }
    try {
      const value = parseEther(amount);
      await writeContractAsync({
        address: POS_VAULT_ADDRESS,
        abi: POS_VAULT_ABI,
        functionName: 'withdraw',
        args: [value],
        account: address,
        chain: baseSepolia,
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.shortMessage || err?.message || 'Transaction failed',
        variant: 'destructive',
      });
    }
  }, [writeContractAsync, toast, address]);

  return { withdraw, hash, isPending, isConfirming, isSuccess, error };
}

export function useAddMerchant() {
  const { toast } = useToast();
  const { address } = useAccount();
  const { writeContractAsync, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const addMerchant = useCallback(async (merchantAddress: `0x${string}`) => {
    if (!address) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet',
        variant: 'destructive',
      });
      return;
    }
    try {
      await writeContractAsync({
        address: POS_VAULT_ADDRESS,
        abi: POS_VAULT_ABI,
        functionName: 'addMerchant',
        args: [merchantAddress],
        account: address,
        chain: baseSepolia,
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.shortMessage || err?.message || 'Transaction failed',
        variant: 'destructive',
      });
    }
  }, [writeContractAsync, toast, address]);

  return { addMerchant, hash, isPending, isConfirming, isSuccess, error };
}

export function useRemoveMerchant() {
  const { toast } = useToast();
  const { address } = useAccount();
  const { writeContractAsync, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const removeMerchant = useCallback(async (merchantAddress: `0x${string}`) => {
    if (!address) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet',
        variant: 'destructive',
      });
      return;
    }
    try {
      await writeContractAsync({
        address: POS_VAULT_ADDRESS,
        abi: POS_VAULT_ABI,
        functionName: 'removeMerchant',
        args: [merchantAddress],
        account: address,
        chain: baseSepolia,
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.shortMessage || err?.message || 'Transaction failed',
        variant: 'destructive',
      });
    }
  }, [writeContractAsync, toast, address]);

  return { removeMerchant, hash, isPending, isConfirming, isSuccess, error };
}

export function usePauseContract() {
  const { toast } = useToast();
  const { address } = useAccount();
  const { writeContractAsync, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const pause = useCallback(async () => {
    if (!address) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet',
        variant: 'destructive',
      });
      return;
    }
    try {
      await writeContractAsync({
        address: POS_VAULT_ADDRESS,
        abi: POS_VAULT_ABI,
        functionName: 'pause',
        account: address,
        chain: baseSepolia,
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.shortMessage || err?.message || 'Transaction failed',
        variant: 'destructive',
      });
    }
  }, [writeContractAsync, toast, address]);

  return { pause, hash, isPending, isConfirming, isSuccess, error };
}

export function useUnpauseContract() {
  const { toast } = useToast();
  const { address } = useAccount();
  const { writeContractAsync, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const unpause = useCallback(async () => {
    if (!address) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet',
        variant: 'destructive',
      });
      return;
    }
    try {
      await writeContractAsync({
        address: POS_VAULT_ADDRESS,
        abi: POS_VAULT_ABI,
        functionName: 'unpause',
        account: address,
        chain: baseSepolia,
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.shortMessage || err?.message || 'Transaction failed',
        variant: 'destructive',
      });
    }
  }, [writeContractAsync, toast, address]);

  return { unpause, hash, isPending, isConfirming, isSuccess, error };
}

export function useEmergencyWithdraw() {
  const { toast } = useToast();
  const { address } = useAccount();
  const { writeContractAsync, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const emergencyWithdraw = useCallback(async (to: `0x${string}`, amount: string) => {
    if (!address) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet',
        variant: 'destructive',
      });
      return;
    }
    try {
      const value = parseEther(amount);
      await writeContractAsync({
        address: POS_VAULT_ADDRESS,
        abi: POS_VAULT_ABI,
        functionName: 'emergencyWithdraw',
        args: [to, value],
        account: address,
        chain: baseSepolia,
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.shortMessage || err?.message || 'Transaction failed',
        variant: 'destructive',
      });
    }
  }, [writeContractAsync, toast, address]);

  return { emergencyWithdraw, hash, isPending, isConfirming, isSuccess, error };
}

export function useTransferOwnership() {
  const { toast } = useToast();
  const { address } = useAccount();
  const { writeContractAsync, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const transferOwnership = useCallback(async (newOwner: `0x${string}`) => {
    if (!address) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet',
        variant: 'destructive',
      });
      return;
    }
    try {
      await writeContractAsync({
        address: POS_VAULT_ADDRESS,
        abi: POS_VAULT_ABI,
        functionName: 'transferOwnership',
        args: [newOwner],
        account: address,
        chain: baseSepolia,
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.shortMessage || err?.message || 'Transaction failed',
        variant: 'destructive',
      });
    }
  }, [writeContractAsync, toast, address]);

  return { transferOwnership, hash, isPending, isConfirming, isSuccess, error };
}

export function useRenounceOwnership() {
  const { toast } = useToast();
  const { address } = useAccount();
  const { writeContractAsync, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const renounceOwnership = useCallback(async () => {
    if (!address) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet',
        variant: 'destructive',
      });
      return;
    }
    try {
      await writeContractAsync({
        address: POS_VAULT_ADDRESS,
        abi: POS_VAULT_ABI,
        functionName: 'renounceOwnership',
        account: address,
        chain: baseSepolia,
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.shortMessage || err?.message || 'Transaction failed',
        variant: 'destructive',
      });
    }
  }, [writeContractAsync, toast, address]);

  return { renounceOwnership, hash, isPending, isConfirming, isSuccess, error };
}

// Event watchers
export function useContractEvents() {
  const { toast } = useToast();

  useWatchContractEvent({
    address: POS_VAULT_ADDRESS,
    abi: POS_VAULT_ABI,
    eventName: 'Deposit',
    onLogs(logs) {
      logs.forEach((log) => {
        const amount = formatEther(log.args.amount || 0n);
        toast({
          title: '💰 Deposit Received',
          description: `${amount} ETH deposited`,
        });
      });
    },
  });

  useWatchContractEvent({
    address: POS_VAULT_ADDRESS,
    abi: POS_VAULT_ABI,
    eventName: 'Withdrawal',
    onLogs(logs) {
      logs.forEach((log) => {
        const amount = formatEther(log.args.amountReceived || 0n);
        const fee = formatEther(log.args.feeTaken || 0n);
        toast({
          title: '💸 Withdrawal Processed',
          description: `${amount} ETH withdrawn (${fee} ETH fee)`,
        });
      });
    },
  });

  useWatchContractEvent({
    address: POS_VAULT_ADDRESS,
    abi: POS_VAULT_ABI,
    eventName: 'MerchantAdded',
    onLogs(logs) {
      logs.forEach((log) => {
        const merchant = log.args.merchant;
        toast({
          title: '✅ Merchant Added',
          description: `${merchant?.slice(0, 6)}...${merchant?.slice(-4)}`,
        });
      });
    },
  });

  useWatchContractEvent({
    address: POS_VAULT_ADDRESS,
    abi: POS_VAULT_ABI,
    eventName: 'MerchantRemoved',
    onLogs(logs) {
      logs.forEach((log) => {
        const merchant = log.args.merchant;
        toast({
          title: '❌ Merchant Removed',
          description: `${merchant?.slice(0, 6)}...${merchant?.slice(-4)}`,
        });
      });
    },
  });

  useWatchContractEvent({
    address: POS_VAULT_ADDRESS,
    abi: POS_VAULT_ABI,
    eventName: 'Paused',
    onLogs() {
      toast({
        title: '⏸️ Contract Paused',
        description: 'All operations are temporarily suspended',
        variant: 'destructive',
      });
    },
  });

  useWatchContractEvent({
    address: POS_VAULT_ADDRESS,
    abi: POS_VAULT_ABI,
    eventName: 'Unpaused',
    onLogs() {
      toast({
        title: '▶️ Contract Resumed',
        description: 'Operations are now active',
      });
    },
  });

  useWatchContractEvent({
    address: POS_VAULT_ADDRESS,
    abi: POS_VAULT_ABI,
    eventName: 'OwnershipTransferred',
    onLogs(logs) {
      logs.forEach((log) => {
        const newOwner = log.args.newOwner;
        toast({
          title: '👑 Ownership Transferred',
          description: `New owner: ${newOwner?.slice(0, 6)}...${newOwner?.slice(-4)}`,
        });
      });
    },
  });

  useWatchContractEvent({
    address: POS_VAULT_ADDRESS,
    abi: POS_VAULT_ABI,
    eventName: 'EmergencyWithdrawal',
    onLogs(logs) {
      logs.forEach((log) => {
        const amount = formatEther(log.args.amount || 0n);
        toast({
          title: '🚨 Emergency Withdrawal',
          description: `${amount} ETH withdrawn`,
          variant: 'destructive',
        });
      });
    },
  });
}
