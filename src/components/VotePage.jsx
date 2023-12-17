import { Helmet } from 'react-helmet';
import { Link } from "react-router-dom";
import Time from "../utils/date";
// import fire from "../../config/config";
import { useEffect, useState } from "react";
import scrollTo from "../utils/scrollTo";
import Spinner from "./Spinner";
import styles from "../assets/vote.module.css";
import not_found from "../assets/not-found.module.css";

import stylesff from "../assets/home.module.css";



import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


import { backend } from "../declarations/backend";
import { AuthClient } from "@dfinity/auth-client";
import { canisterId, createActor } from "../declarations/backend";
import { Principal } from "@dfinity/principal";

export default function VotePage({ }) {
   const [vote, setVote] = useState("");
   const [isLoading, setIsLoading] = useState(true);
   const [isUserAllow, setIsUserAllow] = useState(true);
   const [isVoteExist, setIsVoteExist] = useState(true);
   const [percentSubjectOne, setPercentSubjectOne] = useState(0);
   const [percentSubjectTwo, setPercentSubjectTwo] = useState(0);
   const [identity, SetIdentity] = useState(null);


   function redirect(path, params) {
      const myUrlWithParams = new URL(window.location.origin + path);
      if (params) {
         for (let key in params) {
            myUrlWithParams.searchParams.append(key, encodeURIComponent(params[key]));
         }
      }
      window.location.href = myUrlWithParams.href;
   }

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
               window.location.reload();
            },
         });
      }
   }

   useEffect(() => {
      async function init() {
         var authClient = await AuthClient.create();
         if (await authClient.isAuthenticated()) {
            SetIdentity(await authClient.getIdentity());
         } else {
            setIsVoteExist(false);
            setIsUserAllow(false);
            setIsLoading(false);
            var url = new URL(window.location.href);
            if (url.searchParams.has('msg')) {
               toast.success(decodeURIComponent(url.searchParams.get('msg')), {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
               });
            }
            toast.error("Connect Wallet to Vote.", {
               position: "top-right",
               autoClose: 5000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
               theme: "light",
            });
         }
      }
      init();
   }, []);

   useEffect(() => {
      async function getVoteDetails() {
         try {
            var actor = createActor(canisterId, {
               agentOptions: {
                  identity,
               },
            });
            var url = new URL(window.location.href);
            var resp = await actor.getVoting(BigInt(parseInt(url.searchParams.get('id'))));
            console.log(resp);
            if (resp.statusCode == BigInt(200)) {
               var userPrincipal = resp.caller;
               var votex = {}
               votex.totalVotesSubjectOne = resp.voting[0].votes.s1.length;
               votex.totalVotesSubjectTwo = resp.voting[0].votes.s2.length;
               votex.maxVote = resp.voting[0].max_votes;
               votex.voteTitle = resp.voting[0].title;
               votex.subjectOneName = resp.voting[0].s1;
               votex.subjectTwoName = resp.voting[0].s2;
               votex.voteDesc = resp.voting[0].description;
               votex.fullName = resp.voting[0].name;
               votex.createdAt = Number(resp.voting[0].createdAt) / 1000000;
               setVote(votex);
               for (var i = 0; i < resp.voting[0].votes.s1.length; i++) {
                  resp.voting[0].votes.s1[i] = resp.voting[0].votes.s1[i].toString();
               }
               for (var i = 0; i < resp.voting[0].votes.s2.length; i++) {
                  resp.voting[0].votes.s2[i] = resp.voting[0].votes.s2[i].toString();
               }
               if (resp.voting[0].votes.s1.includes(userPrincipal.toString()) === true || resp.voting[0].votes.s2.includes(userPrincipal.toString()) === true) {
                  setIsUserAllow(false);
               }
               if (votex.maxVote > 0) {
                  if (
                     votex.totalVotesSubjectOne === votex.maxVote ||
                     votex.totalVotesSubjectTwo === votex.maxVote
                  ) {
                     setIsUserAllow(false);
                  }
               }
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
               setIsVoteExist(false);
            }
            setTimeout(() => {
               setIsLoading(false);
            }, 300);
            var url = new URL(window.location.href);
            if (url.searchParams.has('msg')) {
               toast.success(decodeURIComponent(url.searchParams.get('msg')), {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
               });
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
         }
      }
      if (identity !== null) {
         getVoteDetails()
      }

   }, [identity])

   useEffect(() => {
      setPercentSubjectOne(
         Math.floor(
            (100 / (vote.totalVotesSubjectOne + vote.totalVotesSubjectTwo)) *
            vote.totalVotesSubjectOne
         ) || 0
      );

      setPercentSubjectTwo(
         Math.floor(
            (100 / (vote.totalVotesSubjectOne + vote.totalVotesSubjectTwo)) *
            vote.totalVotesSubjectTwo
         ) || 0
      );

      if (vote.maxVote > 0) {
         if (
            vote.totalVotesSubjectOne === vote.maxVote ||
            vote.totalVotesSubjectTwo === vote.maxVote
         ) {
            setIsUserAllow(true);
         }
      }
   }, [vote]);

   async function votingSubject(subject) {
      try {
         var actor = createActor(canisterId, {
            agentOptions: {
               identity,
            },
         });
         var url = new URL(window.location.href);
         var resp = await actor.vote(BigInt(parseInt(url.searchParams.get('id'))), subject);
         if (resp.statusCode == BigInt(200)) {
            var url = new URL(window.location.href);
            redirect(url.pathname + url.search, { msg: "Voted Successfully." })
            toast.success('Voted Successfully.', {
               position: "top-right",
               autoClose: 5000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
               theme: "light",
            });
            setIsUserAllow(false);
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
      }
   }

   if (isLoading === true) {
      return <Spinner />;
   }

   return (
      <>
         <Helmet>
            <title>Pilih | Voting</title>
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

         {isVoteExist === true && (
            <div className={styles.home}>
               <Link to="/">
                  <a className={styles.home__link}>
                     <svg
                        width="26px"
                        height="26px"
                        fill="#000000"
                        viewBox="0 0 24 24"
                        style={{ marginRight: "10px" }}
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                     </svg>{" "}
                     Home
                  </a>
               </Link>
               <button
                  onClick={() => handleConnect()}
                  className={stylesff.header_button__create}
                  style={{
                     cursor: "pointer",
                     marginTop: "32px"
                  }}
               >
                  {identity === null ? (
                     <><svg xmlns="http://www.w3.org/2000/svg" height="26px" width="26px" fill="#00000" className={styles.icon} viewBox="0 0 640 512"><path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" /></svg>
                        Connect </>) : (
                     <><svg xmlns="http://www.w3.org/2000/svg" height="26px" width="26px" fill="#00000" className={styles.icon} viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L489.3 358.2l90.5-90.5c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114l-96 96-31.9-25C430.9 239.6 420.1 175.1 377 132c-52.2-52.3-134.5-56.2-191.3-11.7L38.8 5.1zM239 162c30.1-14.9 67.7-9.9 92.8 15.3c20 20 27.5 48.3 21.7 74.5L239 162zM116.6 187.9L60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5l61.8-61.8-50.6-39.9zM220.9 270c-2.1 39.8 12.2 80.1 42.2 110c38.9 38.9 94.4 51 143.6 36.3L220.9 270z" /></svg>
                        Disconnect</>
                  )}
               </button>
            </div>
         )}

         <div className={styles.container}>
            {isVoteExist === false ? (
               <div className={not_found.container}>
                  <h1 className={not_found.title}>Vote Not Found</h1>

                  <Link to="/">
                     <a className={not_found.home}>Home</a>
                  </Link>

                  <button
                     onClick={() => handleConnect()}
                     className={stylesff.header_button__create}
                     style={{
                        cursor: "pointer",
                        marginTop: "46px"
                     }}
                  >
                     {identity === null ? (
                        <><svg xmlns="http://www.w3.org/2000/svg" height="26px" width="26px" fill="#00000" className={styles.icon} viewBox="0 0 640 512"><path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" /></svg>
                           Connect </>) : (
                        <><svg xmlns="http://www.w3.org/2000/svg" height="26px" width="26px" fill="#00000" className={styles.icon} viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L489.3 358.2l90.5-90.5c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114l-96 96-31.9-25C430.9 239.6 420.1 175.1 377 132c-52.2-52.3-134.5-56.2-191.3-11.7L38.8 5.1zM239 162c30.1-14.9 67.7-9.9 92.8 15.3c20 20 27.5 48.3 21.7 74.5L239 162zM116.6 187.9L60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5l61.8-61.8-50.6-39.9zM220.9 270c-2.1 39.8 12.2 80.1 42.2 110c38.9 38.9 94.4 51 143.6 36.3L220.9 270z" /></svg>
                           Disconnect</>
                     )}
                  </button>
               </div>
            ) : (
               <>


                  <h1 className={styles.vote__title}>{vote.voteTitle}</h1>

                  {/* Subject Two */}
                  <div className={styles.vote__subject}>
                     <h2>{vote.subjectOneName}</h2>

                     <span>
                        {vote.maxVote > 0
                           ? `${vote.totalVotesSubjectOne} / ${vote.maxVote}`
                           : vote.totalVotesSubjectOne}{" "}
                        votes
                     </span>
                  </div>

                  <div className={styles.vote_progress__container_one}>
                     <div
                        className={styles.vote__subject_progress}
                        style={{ width: `${percentSubjectOne}%` }}
                     ></div>
                  </div>

                  {/* Subject Two */}
                  <div className={styles.vote__subject}>
                     <h2>{vote.subjectTwoName}</h2>

                     <span>
                        {vote.maxVote > 0
                           ? `${vote.totalVotesSubjectTwo} / ${vote.maxVote}`
                           : vote.totalVotesSubjectTwo}{" "}
                        votes
                     </span>
                  </div>

                  <div className={styles.vote_progress__container_two}>
                     <div
                        className={styles.vote__subject_progress}
                        style={{ width: `${percentSubjectTwo}%` }}
                     ></div>
                  </div>

                  {isUserAllow === true && (
                     <div className={styles.vote__buttons}>
                        <button
                           className={styles.vote__submit_btn}
                           onClick={() => votingSubject(vote.subjectOneName)}
                        >
                           <svg
                              width="26px"
                              height="26px"
                              fill="#000000"
                              viewBox="0 0 24 24"
                              style={{ marginRight: "10px" }}
                              xmlns="http://www.w3.org/2000/svg"
                           >
                              <path d="M0 0h24v24H0V0z" fill="none" />
                              <path d="M18 13h-.68l-2 2h1.91L19 17H5l1.78-2h2.05l-2-2H6l-3 3v4c0 1.1.89 2 1.99 2H19c1.1 0 2-.89 2-2v-4l-3-3zm-1-5.05l-4.95 4.95-3.54-3.54 4.95-4.95L17 7.95zm-4.24-5.66L6.39 8.66c-.39.39-.39 1.02 0 1.41l4.95 4.95c.39.39 1.02.39 1.41 0l6.36-6.36c.39-.39.39-1.02 0-1.41L14.16 2.3c-.38-.4-1.01-.4-1.4-.01z" />
                           </svg>
                           {vote.subjectOneName}
                        </button>

                        <button
                           className={styles.vote__submit_btn}
                           onClick={() => votingSubject(vote.subjectTwoName)}
                        >
                           <svg
                              width="26px"
                              height="26px"
                              fill="#000000"
                              viewBox="0 0 24 24"
                              style={{ marginRight: "10px" }}
                              xmlns="http://www.w3.org/2000/svg"
                           >
                              <path d="M0 0h24v24H0V0z" fill="none" />
                              <path d="M18 13h-.68l-2 2h1.91L19 17H5l1.78-2h2.05l-2-2H6l-3 3v4c0 1.1.89 2 1.99 2H19c1.1 0 2-.89 2-2v-4l-3-3zm-1-5.05l-4.95 4.95-3.54-3.54 4.95-4.95L17 7.95zm-4.24-5.66L6.39 8.66c-.39.39-.39 1.02 0 1.41l4.95 4.95c.39.39 1.02.39 1.41 0l6.36-6.36c.39-.39.39-1.02 0-1.41L14.16 2.3c-.38-.4-1.01-.4-1.4-.01z" />
                           </svg>
                           {vote.subjectTwoName}
                        </button>
                     </div>
                  )}

                  <details className={styles.vote__details}>
                     <summary
                        className={styles.vote__show_details}
                        onClick={() => scrollTo(0, 500)}
                     >
                        <svg
                           width="26px"
                           height="26px"
                           fill="#000000"
                           viewBox="0 0 24 24"
                           style={{ marginRight: "12px" }}
                           xmlns="http://www.w3.org/2000/svg"
                        >
                           <path d="M0 0h24v24H0z" fill="none" />
                           <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                        </svg>
                        Voting details
                     </summary>

                     <p className={styles.vote__desc_details}>
                        {vote.voteDesc}
                     </p>

                     <p className={styles.vote__by}>
                        <svg
                           width="28px"
                           height="28px"
                           fill="#000000"
                           viewBox="0 0 24 24"
                           style={{ marginRight: "15px" }}
                           xmlns="http://www.w3.org/2000/svg"
                        >
                           <path d="M0 0h24v24H0V0z" fill="none" />
                           <circle cx="15.5" cy="9.5" r="1.5" />
                           <circle cx="8.5" cy="9.5" r="1.5" />
                           <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-5-6c.78 2.34 2.72 4 5 4s4.22-1.66 5-4H7z" />
                        </svg>
                        Created by {vote.fullName}
                     </p>

                     <p className={styles.vote__date}>
                        <svg
                           width="28px"
                           height="28px"
                           fill="#000000"
                           viewBox="0 0 24 24"
                           style={{ marginRight: "15px" }}
                           xmlns="http://www.w3.org/2000/svg"
                        >
                           <path d="M0 0h24v24H0z" fill="none" />
                           <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                           <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                        </svg>
                        {new Time(vote.createdAt).getNormalRt()}
                     </p>
                  </details>
               </>
            )}
         </div>
      </>
   );
}
