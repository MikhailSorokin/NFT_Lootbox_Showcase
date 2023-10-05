import dotenv from "dotenv";
dotenv.config()

import type { NextPage } from "next";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";

import LoadingSpinner from '../components/LoadingSpinner';
import WalletContent from "../components/WalletContentComponent";

const randomContractAddr = "0xc84a908A29A7B10a9316cf0bcD32D8f0c0757729";

// Setup provider
import {ethers} from "ethers";

// File reading
import classNames from 'classnames';

const Home: NextPage = () => {

  // Account states
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [showInstallMessage, setShowInstallMessage] = useState(false);
  const [showAccountCreation, setAccountCreationMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Unknown error");
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const [canViewWallet, setViewWallet] = useState(false);

  // Animation state of images
  const [showAnimation, setShowAnimation] = useState(false);
  const [openBox, setIsOpened] = useState(false);
  const [loadState, setLoadState] = useState(false);

  // NFT states
  const [selectedNFT, setSelectedNFT] = useState("");
  const [getTotalSupply, setTotalSupply] = useState(0);
  const [getMaxSupply, setMaxSupply] = useState(0);

  // Utilities
  const randomContractABI = [
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "maxSupplyAmnt",
          "type": "uint8"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "message",
          "type": "string"
        }
      ],
      "name": "MintError",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "maxSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "onERC721Received",
      "outputs": [
        {
          "internalType": "bytes4",
          "name": "",
          "type": "bytes4"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "quantity",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "mintingCostInWei",
          "type": "uint256"
        }
      ],
      "name": "randomMint",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "_data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string[]",
          "name": "addresses",
          "type": "string[]"
        }
      ],
      "name": "setupIPFSMappings",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "tokenByIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "tokenOfOwnerByIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "walletOfOwner",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  /* ============================================ CONNECTION ========================================= */
  
  const clickConnectWallet = async () => {
    setIsButtonDisabled(true); // disable the button on click
    if (typeof window.ethereum !== "undefined") {
      // if MetaMask is installed
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        await provider.listAccounts().then(async (accounts) =>
        {
          if (accounts.length > 0)
          {
            console.log("Accounts: " + accounts);

            setSelectedAccount(accounts[0]); // set the selected account
            setShowAnimation(true);
          }
          else {
            console.log("Account is not created, need to make.")

            setAccountCreationMessage(true);

            // Request after showing up some information about it
            if (typeof window.ethereum != "undefined")
            {
              await window.ethereum.request({ method: 'eth_requestAccounts' })
            } 
          }
          
        }).then( () =>
        {
          switchNetwork();
        });

      } catch (error) {
        //console.error(error); // handle any errors
      }
    } else {
      setShowInstallMessage(true); // show the install message
    }
    setIsButtonDisabled(false); // re-enable the button
  }

  const handleDisconnect = () => {
    if (typeof window.ethereum !== "undefined") {
      setSelectedAccount(""); // reset the selected account in the state
    }
  };

  const switchNetwork = async() => {
      if (typeof window.ethereum !== "undefined")
      {
        // If the chainId property is not available, use the deprecated net_version method
        // First, create an instance of the provider
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);

        // To get the current network ID (chain ID), you can use the following code:
        const network = await provider.getNetwork();

        // targets Sepolia chain
        const targetNetworkId = "0xaa36a7";

        if (network.chainId != Number(targetNetworkId))
        {
          try {
    
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [
                {
                  chainId: targetNetworkId
                },
              ],
            });
            
            console.log("You have switched to the right network")

            setAccountCreationMessage(false);
            // refresh
            window.location.reload();
            
          } catch (switchError) {
            
            // The network has not been added to MetaMask
            
              console.log("Please add the Polygon network to MetaMask")
              try {
                
                // Check the current network ID
                await window.ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: targetNetworkId,
                      chainName: 'Sepolia Network',
                      rpcUrls: ['https://rpc2.sepolia.org']
                    }
                  ],
                });
              } catch(addError)
              {
                  console.error(addError);
              }
            
              console.error(switchError);
              console.error("Cannot switch to the network")
              setAccountCreationMessage(true);
              setSelectedAccount("");
              setShowErrorMessage(true);
              setErrorMessage(switchError as string);
          }
        }
        else {
          console.log("SAME NETWORK")
        }
    }
  }
  
  /* ======================================================================================== */

  const handleOpenBox = async () => {
    setIsOpened(true);
    setLoadState(true);
    handleChooseNFT();
  }

  useEffect(() => {
    setShowInstallMessage(typeof window.ethereum === "undefined"); // show the install message on page load if MetaMask is not detected
  }, []);

  const handleViewWallet = async () => {
    setViewWallet(true);
    viewWallet();
  }

  const viewWallet = async () => {
      // Connect to provider, get signer and then sign a transaction to mint the NFT
      if (selectedAccount != "")
      {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        if (provider)
        {
          try {
            const signer = provider.getSigner();
            const contract = new ethers.Contract(randomContractAddr, randomContractABI as any, signer);

            let totalSupply = await contract.balanceOf(selectedAccount);
            console.log(totalSupply);
            for (var i = 0; i < totalSupply; i++)
            {
              const tokenId = await contract.tokenOfOwnerByIndex(selectedAccount, i);

              // Call the contract's function to get the user's NFT
              const ipfsURL = await contract.tokenURI(tokenId);
    
              console.log(ipfsURL);
    
              const response = await fetch(ipfsURL);
              const metadata = await response.json();
              console.log(metadata);
                
              const imageURL = metadata.image.replace("://", "/");
              const urlImage = "https://gateway.pinata.cloud/" + imageURL;
    
              // Set the selected NFT
              setSelectedNFT(urlImage);
            }

            setLoadState(false);
          } 
          catch (error : any)
          {
            console.error(error);
            // Close again
            setIsOpened(false);
            setIsButtonDisabled(false);
            setShowErrorMessage(true);
  
            const code = error.code !== undefined ? error.code : 0;
  
            if (code.toString() == "ACTION_REJECTED")
            {
              console.log(code);
              setErrorMessage("You have rejected the transition. If you would like to mint a random NFT, please accept the transaction.");
            }
            else {
              setErrorMessage(error.reason);
            }
          }
  
        }
      }  
  }

  const handleChooseNFT = async () => {
    // Connect to provider, get signer and then sign a transaction to mint the NFT
    if (selectedAccount != "")
    {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      if (provider)
      {
        try {
          const signer = provider.getSigner();
          const contract = new ethers.Contract(randomContractAddr, randomContractABI as any, signer);
          // Convert Ether to wei
          const weiAmount = ethers.utils.parseEther("0.01");

          const tx = await contract.randomMint(1, weiAmount);
          // Wait for the transaction to be mined
          const receipt = await tx.wait();

          console.log(`NFT minted successfully.`);
          console.log(`Transaction Hash: ${tx.hash}`);

          // get the tokenId from the Transfer event
          // Decode the events emitted from the transaction receipt
          const event = contract.interface.parseLog(receipt.logs[0]);

          console.log(event.args);
          const tokenId = event.args.tokenId.toNumber();

          // Call the contract's function to get the user's NFT
          const ipfsURL = await contract.tokenURI(tokenId);

          console.log(ipfsURL);

          const response = await fetch(ipfsURL);
          const metadata = await response.json();
          console.log(metadata);

          const imageURL = metadata.image.replace("://", "/");
          const urlImage = "https://gateway.pinata.cloud/" + imageURL;

          // Set the selected NFT
          setSelectedNFT(urlImage);

          // Update!
          totalSupply();
          setLoadState(false);
        } 
        catch (error : any)
        {
          console.error(error);
          // Close again
          setIsOpened(false);
          setIsButtonDisabled(false);
          setShowErrorMessage(true);

          const code = error.code !== undefined ? error.code : 0;

          if (code.toString() == "ACTION_REJECTED")
          {
            console.log(code);
            setErrorMessage("You have rejected the transition. If you would like to mint a random NFT, please accept the transaction.");
          }
          else {
            setErrorMessage(error.reason);
          }
        }

      }
    }

  };

  const totalSupply = async () => {
    if (selectedAccount != "")
    {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      if (provider)
      {
        const contract = new ethers.Contract(randomContractAddr, randomContractABI as any, provider);

        let totalSupply = await contract.totalSupply();
        setTotalSupply(totalSupply.toNumber());
      }
    }
  }

  const maxSupply = async () => {
    if (selectedAccount != "")
    {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      if (provider)
      {
        const contract = new ethers.Contract(randomContractAddr, randomContractABI as any, provider);

        let maxSupply = await contract.maxSupply();
        setMaxSupply(maxSupply.toNumber());
      }
    }
  }

  totalSupply()
  maxSupply()

  return (
    <div className={styles.container}>
      <h1> Lootbox Generator! </h1>
      {selectedAccount ? (
        <div className={styles.centered}>
          <p>Selected Account: {selectedAccount}</p>
          { showAnimation && (
            <div className={styles.centered}>
              <img className={classNames(styles.fade)}
              src = {(!openBox || loadState) ? "assets/loot_crate_V1_crop.png" : "assets/loot_crate_open_V1_crop.png"}
              alt = "Animation"
              width={375}
              height={256}
              />
              <button className = {styles.mainButton} onClick={handleOpenBox} disabled={isButtonDisabled}>Generate a random NFT (can only be done once)</button>
            </div>            
          )}
          { openBox && (
            <div className={styles.nftBoxGrid}>
              <div className={classNames(styles.nftBox, styles.centered)}>
                {!loadState && <img className={classNames(styles.centered, styles.fade)}
                src = {selectedNFT}
                height="500" />}
                {
                  loadState && 
                    (<div>
                    <LoadingSpinner />
                  </div>)
                  /* */
                }

              </div>  
            </div>
          )}

          {getMaxSupply != 0 && <h1>Total NFTs minted: {getTotalSupply} / {getMaxSupply}</h1>}
          <button className = {styles.secondaryButton} onClick={handleDisconnect}>Disconnect Wallet</button>
          { canViewWallet && (
            <WalletContent NFT={selectedNFT} />
          )}
          {!canViewWallet && <button className = {styles.newButton} onClick={handleViewWallet}>View Wallet</button>}
          
          {showErrorMessage && (
            <div>
              <h3 color="red">{errorMessage}</h3>
            </div>
          )}

        </div>
      ) : (
        <button className={styles.mainButton} onClick={clickConnectWallet} disabled={isButtonDisabled}>
          Connect Wallet
        </button>
      )}
      {!selectedAccount && showAccountCreation && (
        <div>
          <p>You are not connected to this site! Open up your metamask wallet and look at the following instructions.</p>
          <div className={styles.horizontalBox}>
            <img src="assets/ConnectMetaMask.png" />
            <div className={styles.arrowContainer}>
              <div className = {styles.arrowRight}></div>
            </div>
            <img src="assets/ConnectMetaMask2.png" />
            <div className={styles.arrowContainer}>
              <div className = {styles.arrowRight}></div>
            </div>
            <img src="assets/ConnectMetaMask3.png" />
          </div>
        </div>
      )}
      {showInstallMessage && (
        <p>
          <a href="https://metamask.io/download/">Download MetaMask</a> for your browser today to connect your wallet and use our lootbox!
        </p>
      )}
    </div>
  );
};

export default Home;

export async function getStaticProps() {
  return {
    props: {
      title: 'MPLEX',
      description: 'TEST2'
    }
  }
}