import { useState } from "react";
import styles from "../assets/alert.module.css";

export default function AlertId({ voteId }) {
   const [isCopied, setIsCopied] = useState(false);

   async function clipBoardVoteId() {
      setIsCopied(true);
      await navigator.clipboard.writeText(voteId);

      setTimeout(() => {
         setIsCopied(false);
      }, 700);
   }

   return (
      <>
         <div className={styles.alert}>
            <p className={styles.alert__message}>
               Your vote ID <span style={{ marginLeft: "4px" }}>:</span>
               <span style={{ marginLeft: "4px" }}>{voteId}</span>
            </p>

            <span className={styles.alert__copy} onClick={clipBoardVoteId}>
               {isCopied === true ? "copied" : "copy"}
            </span>
         </div>

         <div className={styles.copy__btn} onClick={clipBoardVoteId}>
            {isCopied === true ? "copied" : "copy"}
         </div>
      </>
   );
}
