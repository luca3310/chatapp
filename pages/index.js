import { auth } from "../lib/firebase";
import {
  collection,
  doc,
  getFirestore,
  setDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import Comments from "../components/Comments";
import { useState, useEffect } from "react";

export default function Home({ posts }) {
  const [technos, setTechnos] = useState([]);
  const firestore = getFirestore();
  const colRef = collection(firestore, "posts");

  useEffect(() => {
    onSnapshot(colRef, (snapshot) => {
      getTechnos(snapshot);
      console.log(snapshot);
    });
  }, []);
  function getTechnos(snapshot) {
    let result = [];
    snapshot.docs.forEach((doc) => {
      result = [...result, { ...doc.data() }];
    });
    setTechnos(result);
  }
  const [user] = useAuthState(auth);
  const {
    register,
    handleSubmit,
    formState,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
  });

  const { isValid, isDirty } = formState;

  const onSubmit = async ({ content }) => {
    const id = String(new Date());
    const ref = doc(getFirestore(), "posts", id);
    const uid = auth.currentUser.uid;
    const data = {
      id: id,
      uid,
      content: content,
      displayName: user.displayName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      photo: auth.currentUser.photoURL,
    };
    await setDoc(ref, data);
    reset({ content: "" });
  };

  return (
    <div className="flex flex-col gap-5 justify-center min-h-screen py-14 items-center bg-gradient-to-b from-[#C0DFD9] to-[#E9ECE6]">
      <form
        className="py-10 flex flex-col justify-center items-end rounded text-[#545B5A] w-1/2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="w-[100%]">
          <input
            placeholder="comment here..."
            className="w-[100%] bg-transparent border-b-2 focus:border-opacity-100 border-[#545B5A] border-opacity-30 outline-none"
            type="text"
            {...register("content", {
              required: { value: true, message: "content is required" },
              disabled: !user,
            })}
            aria-invalid={errors.content ? "true" : "false"}
          />
          {errors.content && (
            <p className="text-red-500">{errors.content?.message}</p>
          )}
        </fieldset>

        <button
          className="opacity-50 hover:opacity-100 hover:cursor-pointer"
          type="submit"
          disabled={!isDirty || !isValid}
        >
          Comment
        </button>
      </form>
      <div className="w-1/2 flex flex-col gap-10">
        <Comments posts={technos} />
      </div>
    </div>
  );
}
