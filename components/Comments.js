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
    <div>
      <h2>{post.displayName}</h2>
      <p>{post.content}</p>
      {!user ? null : auth.currentUser.uid === post.uid ? (
        <button
          id={post.id}
          onClick={(e) => {
            const docRef = doc(getFirestore(), "posts", e.target.id);
            deleteDoc(docRef);
          }}
        >
          delete
        </button>
      ) : null}
    </div>
  );
}
