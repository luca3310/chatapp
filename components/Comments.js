import { auth } from "../lib/firebase";
import { doc, getFirestore, deleteDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Comments({ posts }) {
  return posts
    ? posts.map((post) => <PostItem post={post} key={post.createdAt} />)
    : null;
}

function PostItem({ post }) {
  const [user] = useAuthState(auth);
  return (
    <div className="flex gap-4 text-[#545B5A]">
      <img
        src={post.photo}
        className="w-10 h-10 rounded-full"
        alt="profilePicture"
      />
      <div>
        <h2 className="font-bold">@{post.displayName}</h2>
        <p className="break-words w-[50vw]">{post.content}</p>
        {!user ? null : auth.currentUser.uid === post.uid ? (
          <div className="flex justify-end w-[100%] pr-4">
            <button
              className="text-red-500 hover:opacity-100 transition-all opacity-50 rounded p-1"
              id={post.id}
              onClick={(e) => {
                const docRef = doc(getFirestore(), "posts", e.target.id);
                deleteDoc(docRef);
              }}
            >
              delete
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
