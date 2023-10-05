import styles from "../styles/Home.module.css";
import React from "react";
import classNames from "classnames";

export default function WalletContent({NFT} : {NFT:string}) {
    // Check if NFT is undefined or not a valid string
    if (!NFT || typeof NFT !== 'string') {
        return <div></div>;
    }

    return (
        <div className={classNames(styles.centered)}>
            <img className={classNames(styles.centered, styles.fade)}
                src={NFT}
                height="500"
                alt="NFT Image"
            />
        </div>
    );
}