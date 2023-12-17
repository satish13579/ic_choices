// import Head from "next/head";
import { Helmet } from 'react-helmet';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import VoteForm from "./VoteForm";
import styles from "../assets/home.module.css";
import VoteInputId from "../components/VoteInputId";

import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


import { backend } from "../declarations/backend";
import { AuthClient } from "@dfinity/auth-client";
import { canisterId, createActor } from "../declarations/backend";
import { Principal } from "@dfinity/principal";

export default function Home() {
   const [isSubmit, setIsSubmit] = useState(false);
   const [statusInputId, setStatusInputId] = useState(false);
   const [statusVoteForm, setStatusVoteForm] = useState(false);
   const [identity, SetIdentity] = useState(null);

   function chooseForm(typeForm) {
      if (typeForm === "create") {
         if (statusVoteForm === true) {
            setStatusVoteForm(false);
         }

         if (statusVoteForm === false) {
            setStatusVoteForm(true);
            setStatusInputId(false);
         }
      }

      if (typeForm === "join") {
         if (statusInputId === true) {
            setStatusInputId(false);
         }

         if (statusInputId === false) {
            setStatusVoteForm(false);
            setStatusInputId(true);
         }
      }
   }

   useEffect(()=>{
      async function init(){
         var authClient = await AuthClient.create();
         if(await authClient.isAuthenticated()){
            SetIdentity(await authClient.getIdentity());
         }
      }
      init();
   },[])

   

   async function handleConnect() {
      var authClient = await AuthClient.create();
      if (identity !== null) {
         authClient.logout();
         SetIdentity(null);
         toast.info('Logged Out Successfully.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
      } else {
         authClient.login({
            maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
            identityProvider: process.env.DFX_NETWORK === "ic"
               ? "https://identity.ic0.app/#authorize"
               : `http://localhost:4943?canisterId=${process.env.CANISTER_ID_internet_identity}`,
            onSuccess: async () => {
               SetIdentity(await authClient.getIdentity());
               toast.success('Logged In Successfully.', {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
               });
            },
         });
      }
   }

   return (
      <>
         <Helmet>
            <title>📢 IC Choices</title>
            <meta
               name="viewport"
               content="width=device-width, initial-scale=1"
            />
            <meta charSet="utf-8" />
            <meta
               name="description"
               content="Web app for making a voting and make decisions in a decentrlized way with your friends"
            />

            {/* Open Graph */}
            <meta property="og:type" content="website" />
            <meta
               property="og:url"
               content="https://pilih.vercel.app"
               key="ogurl"
            />
            <meta property="og:site_name" content="📢 IC Choices" key="ogsitename" />
            <meta
               property="og:image"
               content="https://i.ibb.co/LR67Djy/logo.jpg"
               key="ogimage"
            />
            <meta
               property="og:image:secure_url"
               content="https://i.ibb.co/LR67Djy/logo.jpg"
               key="ogimagesecureurl"
            />
            <meta property="og:title" content="📢 IC Choices" key="ogtitle" />
            <meta
               property="og:description"
               content="Web app for making a voting and make decisions in a decentrlized way with your friends"
               key="ogdesc"
            />

            {/* twitter open graph */}
            <meta property="twitter:card" content="summary" />
            <meta
               property="twitter:image"
               content="https://i.ibb.co/LR67Djy/logo.jpg"
            />
            <meta property="twitter:site" content="@SatishCCY" />
         </Helmet>

         <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
         />

         <div className={styles.container}>
            <div className={styles.header}>
               <h1 className={styles.header__title}>
                  <span style={{ marginRight: "-14px" }}>📢</span> IC Choices
               </h1>
               <button
                  disabled={isSubmit === true}
                  onClick={() => handleConnect()}
                  className={styles.header_button__create}
                  style={{
                     cursor: isSubmit === true ? "default" : "pointer",
                  }}
               >
                  {identity === null ? (
                     <><svg xmlns="http://www.w3.org/2000/svg" height="26px" width="26px" fill="#00000" className={styles.icon} viewBox="0 0 640 512"><path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" /></svg>
                        Connect </>) : (
                     <><svg xmlns="http://www.w3.org/2000/svg" height="26px" width="26px" fill="#00000" className={styles.icon} viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L489.3 358.2l90.5-90.5c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114l-96 96-31.9-25C430.9 239.6 420.1 175.1 377 132c-52.2-52.3-134.5-56.2-191.3-11.7L38.8 5.1zM239 162c30.1-14.9 67.7-9.9 92.8 15.3c20 20 27.5 48.3 21.7 74.5L239 162zM116.6 187.9L60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5l61.8-61.8-50.6-39.9zM220.9 270c-2.1 39.8 12.2 80.1 42.2 110c38.9 38.9 94.4 51 143.6 36.3L220.9 270z" /></svg>
                        Disconnect</>
                  )}
               </button>

               <div className={styles.header_buttons}>
                  <button
                     disabled={isSubmit === true}
                     onClick={() => chooseForm("create")}
                     className={styles.header_button__create}
                     style={{
                        cursor: isSubmit === true ? "default" : "pointer",
                     }}
                  >
                     <svg
                        width="26px"
                        height="26px"
                        fill="#00000"
                        viewBox="0 0 24 24"
                        className={styles.icon}
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                     </svg>
                     Create voting
                  </button>

                  <button
                     disabled={isSubmit === true}
                     onClick={() => chooseForm("join")}
                     className={styles.header_button__join}
                     style={{
                        cursor: isSubmit === true ? "default" : "pointer",
                     }}
                  >
                     <svg
                        width="26px"
                        height="26px"
                        fill="#00000"
                        viewBox="0 0 24 24"
                        className={styles.icon}
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                     </svg>
                     Join voting
                  </button>
               </div>
            </div>

            {statusVoteForm === true && (
               <VoteForm isSubmit={isSubmit} onSubmit={setIsSubmit} identity={identity} />
            )}

            {statusInputId === true && (
               <VoteInputId isSubmit={isSubmit} onSubmit={setIsSubmit} identity={identity}/>
            )}

            <div className={styles.about}>
               <h1 className={styles.about__title}>
                  🤔 What the hell is this ??
               </h1>

               <div className={styles.about__section}>
                  <h1 className={styles.about__sub_title}>😀 😁</h1>
                  <p className={styles.about__sub_desc}>
                     Just web app to create voting and make decisions in decentralized way
                  </p>
               </div>

               <div className={styles.about__section}>
                  <h1 className={styles.about__sub_title}>👌</h1>
                  <p className={styles.about__sub_desc}>
                     Easy to use, just connect your internet identity
                  </p>
               </div>

               <div className={styles.about__section}>
                  <h1 className={styles.about__sub_title}>🔐</h1>
                  <p className={styles.about__sub_desc}>
                     If you want make a voting you should have unique voting ID
                     from who create the voting
                  </p>
               </div>

               <div className={styles.about__section}>
                  <h1 className={styles.about__sub_title}>👀</h1>
                  <p className={styles.about__sub_desc}>
                     Don't worry, All votes are 100% On Chain
                  </p>
               </div>
            </div>

            <footer className={styles.footer}>
               <a
                  rel="noopener"
                  target="_blank"
                  className={styles.footer__link}
                  href="https://twitter.com/SatishCCY"
               >
                  <svg
                     width="25"
                     height="25"
                     fill="#00000"
                     viewBox="0 0 24 24"
                     className={styles.icon}
                     xmlns="http://www.w3.org/2000/svg"
                  >
                     <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                  Twitter
               </a>

               <p className={styles.footer__desc}>
                  Built with jokes <span style={{ marginLeft: "6px" }}>🤪</span>
               </p>

               <Link to="/usage">
                  <a className={styles.footer__usage}>
                     <svg
                        width="25px"
                        height="25px"
                        fill="#000000"
                        viewBox="0 0 24 24"
                        className={styles.icon}
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
                     </svg>
                     Usage
                  </a>
               </Link>
            </footer>
         </div>
      </>
   );
}
