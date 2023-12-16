import AlertId from "./AlertId";
import { useState } from "react";
// import fire from "../config/config";
import scrollTo from "../utils/scrollTo";
import styles from "../assets/form.module.css";

import { canisterId, createActor } from "../declarations/backend";
import { toast, ToastContainer } from 'react-toastify';
// import "react-toastify/dist/ReactToastify.css";

export default function SignInForm({ isSubmit, onSubmit, identity }) {
   const [idVote, setIdVote] = useState("");
   const [maxVote, setMaxVote] = useState(0);
   const [fullName, setFullName] = useState("");
   const [voteDesc, setVoteDesc] = useState("");
   const [isNotif, setIsNotif] = useState(false);
   const [voteTitle, setVoteTitle] = useState("");
   const [subjectOneName, setSubjectOneName] = useState("");
   const [subjectTwoName, setSubjectTwoName] = useState("");

   async function submitForm(event) {
      event.preventDefault();
      onSubmit(true);

      var actor = createActor(canisterId, {
         agentOptions: {
            identity,
         },
      });

      var resp = await actor.addVoting(fullName.trim(), voteTitle.trim(), voteDesc.trim(), subjectOneName.trim(), subjectTwoName.trim(), parseInt(maxVote));
      if (resp.statusCode == BigInt(200)) {
         setMaxVote(0);
         setFullName("");
         setVoteDesc("");
         onSubmit(false);
         setVoteTitle("");
         setIsNotif(true);
         setIdVote(resp.msg);
         setSubjectOneName("");
         setSubjectTwoName("");
         scrollTo(999, 0);
         toast.success('Created a Polling Successfully. ID: ' + resp.msg, {
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
         onSubmit(false);
         toast.error('Connect Wallet to Add a Polling.', {
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

      // fire
      //    .firestore()
      //    .collection("votes")
      //    .add({
      //       peoplesVoted: [],
      //       totalVotesSubjectOne: 0,
      //       totalVotesSubjectTwo: 0,
      //       createdAt: `${new Date()}`,
      //       maxVote: parseInt(maxVote),
      //       fullName: fullName.trim(),
      //       voteDesc: voteDesc.trim(),
      //       voteTitle: voteTitle.trim(),
      //       subjectOneName: subjectOneName.trim(),
      //       subjectTwoName: subjectTwoName.trim(),
      //    })
      //    .then((data) => {
      //       setMaxVote(0);
      //       setFullName("");
      //       setVoteDesc("");
      //       onSubmit(false);
      //       setVoteTitle("");
      //       setIsNotif(true);
      //       setIdVote(data.id);
      //       setSubjectOneName("");
      //       setSubjectTwoName("");
      //       scrollTo(999, 0);
      //    });
   }

   return (
      <div className={styles.container}>
         {isNotif === true && <AlertId voteId={idVote} />}

         <form
            autoComplete="off"
            spellCheck="false"
            onSubmit={submitForm}
            className={styles.form}
         >
            <div className={styles.input}>
               <label htmlFor="yourName" className={styles.input__label}>
                  Who is this *
               </label>

               <input
                  required
                  type="text"
                  id="yourName"
                  value={fullName}
                  placeholder="your name"
                  disabled={isSubmit === true}
                  className={styles.input__input}
                  onChange={(e) => setFullName(e.target.value)}
               />
            </div>

            <div className={styles.input}>
               <label htmlFor="title" className={styles.input__label}>
                  Title *
               </label>

               <input
                  required
                  id="title"
                  type="text"
                  value={voteTitle}
                  placeholder="title"
                  disabled={isSubmit === true}
                  className={styles.input__input}
                  onChange={(e) => setVoteTitle(e.target.value)}
               />
            </div>

            <div className={styles.input}>
               <label htmlFor="maxVote" className={styles.input__label}>
                  Maximum votes
               </label>

               <input
                  min="0"
                  id="maxVote"
                  type="number"
                  value={maxVote}
                  placeholder="maximum votes"
                  disabled={isSubmit === true}
                  className={styles.input__input}
                  onChange={(e) => setMaxVote(e.target.value)}
               />
            </div>

            <div className={styles.input}>
               <label htmlFor="subjectOne" className={styles.input__label}>
                  Subject one *
               </label>

               <input
                  type="text"
                  id="subjectOne"
                  value={subjectOneName}
                  disabled={isSubmit === true}
                  placeholder="subject one name"
                  className={styles.input__input}
                  onChange={(e) => setSubjectOneName(e.target.value)}
               />
            </div>

            <div className={styles.input}>
               <label htmlFor="subjectTwo" className={styles.input__label}>
                  Subject two *
               </label>

               <input
                  id="subjectTwo"
                  value={subjectTwoName}
                  disabled={isSubmit === true}
                  placeholder="subject two name"
                  className={styles.input__input}
                  onChange={(e) => setSubjectTwoName(e.target.value)}
               />
            </div>

            <div className={styles.input}>
               <label htmlFor="desc" className={styles.input__label}>
                  Detail description *
               </label>

               <textarea
                  id="desc"
                  cols="30"
                  rows="14"
                  required
                  value={voteDesc}
                  disabled={isSubmit === true}
                  placeholder="voting description"
                  className={styles.input__textarea}
                  onChange={(e) => setVoteDesc(e.target.value)}
               ></textarea>
            </div>

            <button disabled={isSubmit === true} className={styles.submit__btn}>
               {isSubmit === true ? "Loading" : "Create"}
            </button>
         </form>
      </div>
   );
}
