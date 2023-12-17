import { useState } from "react";
// import fire from "../config/config";
// import { useRouter } from "next/router";
import AlertMessage from "./AlertMessage";
import styles from "../assets/form.module.css";

import { canisterId, createActor } from "../declarations/backend";
import { toast, ToastContainer } from 'react-toastify';

export default function VoteInput({ isSubmit, onSubmit, identity }) {
   // const router = useRouter();
   const [idVote, setIdVote] = useState("");
   const [isNotif, setIsNotif] = useState(false);

   function redirect(path, params) {
      const myUrlWithParams = new URL(window.location.origin + path);
      if (params) {
         for (let key in params) {
            myUrlWithParams.searchParams.append(key, encodeURIComponent(params[key]));
         }
      }
      window.location.href = myUrlWithParams.href;
   }

   async function submitForm(event) {
      event.preventDefault();
      onSubmit(true);

      var actor = createActor(canisterId, {
         agentOptions: {
            identity,
         },
      });

      try {
         try{
            var num = BigInt(parseInt(idVote.trim()));
         }catch(error){
            toast.error("Invalid Id, Only Numbers are Accepted", {
               position: "top-right",
               autoClose: 5000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
               theme: "light",
            });
            setIsNotif(true);
            onSubmit(false);
            return
         }
         var resp = await actor.getVoting(BigInt(parseInt(idVote.trim())));
         if (resp.statusCode == BigInt(200)) {
            redirect("/vote", { id: parseInt(idVote.trim()) });
         } else {
            toast.error(resp.msg, {
               position: "top-right",
               autoClose: 5000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
               theme: "light",
            });
            setIsNotif(true);
            onSubmit(false);
         }
      } catch (error) {
         // Code to handle the exception
         console.error('An error occurred:', error.message);
         toast.error('An error occurred:' + error.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
         });
         onSubmit(false);
      }

      // fire
      //    .firestore()
      //    .collection("votes")
      //    .doc(idVote.trim())
      //    .get()
      //    .then((querySnapshot) => {
      //       if (querySnapshot.exists === true) {
      //          router.push(`/vote/${idVote.trim()}`);
      //       }

      //       if (querySnapshot.exists === false) {
      //          onSubmit(false);
      //          setIsNotif(true);
      //       }
      //    })
      //    .catch((err) => {
      //       throw new Error(err.message);
      //    });
   }

   return (
      <div className={styles.container}>
         {isNotif === true && <AlertMessage message="Voting not found" />}

         <form className={styles.form} onSubmit={submitForm}>
            <div className={styles.input}>
               <label htmlFor="voteid" className={styles.input__label}>
                  Voting ID *
               </label>

               <input
                  required
                  id="voteid"
                  type="text"
                  value={idVote}
                  autoComplete="off"
                  spellCheck="false"
                  placeholder="voting ID"
                  disabled={isSubmit === true}
                  className={styles.input__input}
                  onChange={(e) => setIdVote(e.target.value)}
               />
            </div>

            <button disabled={isSubmit === true} className={styles.submit__btn}>
               {isSubmit === true ? "Loading" : "Join"}
            </button>
         </form>
      </div>
   );
}
