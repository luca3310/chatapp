import { auth, googleAuthProvider } from "../lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Navbar() {
  const [user] = useAuthState(auth);
  return (
    <nav className="fixed h-24 w-screen bg-black text-white flex justify-center items-center">
      <div className="w-5/6 flex justify-between items-center">
        <h1 className="text-3xl hover:cursor-pointer">BA</h1>
        {user ? <SignOutButton /> : <SignInButton />}
      </div>
    </nav>
  );
  function SignInButton() {
    const signInWithGoogle = async () => {
      await signInWithPopup(auth, googleAuthProvider);
      console.log(user);
    };

    return (
      <button className="text-lg" onClick={signInWithGoogle}>
        <img /> Sign in with Google
      </button>
    );
  }

  // Sign out button
  function SignOutButton() {
    const signOutWithGoogle = () => {
      signOut(auth);
      console.log(user);
    };
    return (
      <button className="text-lg" onClick={signOutWithGoogle}>
        Sign Out
      </button>
    );
  }
}
