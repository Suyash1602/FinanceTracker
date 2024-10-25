import React, { useRef, useState } from "react";
import "./style.css";
import Input from "../Input";
import Button from "../Button";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db, provider } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";

function SignupSignin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginForm, setLoginForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const singupWithEmail = () => {
    setLoading(true);
    console.log("name", name);
    console.log("email", email);
    console.log("pass", password);
    console.log("confirmPass", confirmPassword);

    // Authenticate user or create new user using email & pass
    if (
      name !== "" &&
      email != "" &&
      password !== "" &&
      confirmPassword != ""
    ) {
      if (password == confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log("User>>>", user);
            toast.success("User Created!");
            setLoading(false);
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            // Create doc with user id as following id
            createDoc(user);
            navigate("/dashboard");
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
            // ..
          });
      } else {
        toast.error("Password & Confirm Password don't match!");
        setLoading(false);
      }
    } else {
      toast.error("All fields are necessary.");
      setLoading(false);
    }
  };

  const loginUsingEmail = () => {
    console.log("Email", email);
    console.log("Password", password);
    setLoading(true);
    if (email != "" && password != "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          toast.success("User Logged In!");
          console.log("User Logged in ", user);
          setLoading(false);
          navigate("/dashboard");
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setLoading(false);
          toast.error(errorMessage);
        });
    } else {
      toast.error("All fields are necessary!");
      setLoading(false);
    }
  };

  const createDoc = async (user) => {
    setLoading(true);
    //make sure doc with uId doesn't exist
    //create a doc.

    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const useData = await getDoc(userRef);
    if (!useData.exists()) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
        });
        toast.success("Doc created!");
        setLoading(false);
      } catch (e) {
        toast.error(e.message);
        setLoading(false);
      }
    } else {
      //   toast.error("Doc already exists.");
      setLoading(false);
    }
  };

  const googleAuth = () => {
    setLoading(true);
    try {
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          console.log("user>>", user);
          toast.success("User authenticated");
          createDoc(user);
          setLoading(false);
          navigate("/dashboard");
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        })
        .catch((error) => {
          setLoading(false);
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);

          // ...
        });
    } catch (e) {
      setLoading(false);
      toast.error(e.message);
    }
  };

  return (
    <>
      {loginForm ? (
        <div className="signup-wrapper">
          <h2 className="title">
            Login on{" "}
            <span style={{ color: "var(--theme)" }}>Finance-Tracker.</span>{" "}
          </h2>
          <form>
            <Input
              type="email"
              label={"Email Name"}
              state={email}
              setState={setEmail}
              placeholder={"johndoe@gmail.com"}
            />
            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"Example@123"}
            />
            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Login using email & password"}
              onClick={loginUsingEmail}
            />
            <p style={{ textAlign: "center", margin: 0 }}>or</p>
            <Button
              onClick={googleAuth}
              text={loading ? "Loading..." : "Login using Google"}
              blue={true}
            />
            <p
              className="p-login"
              style={{ cursor: "pointer" }}
              onClick={() => setLoginForm(!loginForm)}
            >
              Or Don't Have an Account? Click Here
            </p>
          </form>
        </div>
      ) : (
        <div className="signup-wrapper">
          <h2 className="title">
            Sign up on{" "}
            <span style={{ color: "var(--theme)" }}>Finance-Tracker.</span>{" "}
          </h2>
          <form>
            <Input
              label={"Full Name"}
              state={name}
              setState={setName}
              placeholder={"John Doe"}
            />
            <Input
              type="email"
              label={"Email Name"}
              state={email}
              setState={setEmail}
              placeholder={"johndoe@gmail.com"}
            />
            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"Example@123"}
            />
            <Input
              type="password"
              label={"Confirm Password"}
              state={confirmPassword}
              setState={setConfirmPassword}
              placeholder={"Example@123"}
            />
            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Signup using email & password"}
              onClick={singupWithEmail}
            />
            <p className="p-login">or</p>
            <Button
              onClick={googleAuth}
              text={loading ? "Loading..." : "Signup using Google"}
              blue={true}
            />
            <p
              className="p-login"
              style={{ cursor: "pointer" }}
              onClick={() => setLoginForm(!loginForm)}
            >
              Or Have an Account Alreayd? Click Here
            </p>
          </form>
        </div>
      )}
    </>
  );
}

export default SignupSignin;
