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
    };
    await setDoc(ref, data);
    reset({ content: "" });
  };

  return (
    <div className="flex flex-col gap-5 justify-center w-screen h-screen items-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <input
            type="text"
            {...register("content", {
              required: { value: true, message: "content is required" },
              disabled: !user,
            })}
            aria-invalid={errors.content ? "true" : "false"}
          />
          {errors.content && (
            <p className="text-white">{errors.content?.message}</p>
          )}
          <label>content</label>
        </fieldset>

        <button type="submit" disabled={!isDirty || !isValid}>
          Save Changes
        </button>
      </form>
      <Comments posts={technos} />
    </div>
  );
}
