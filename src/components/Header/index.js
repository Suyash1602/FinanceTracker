import React, { useEffect } from "react";
import "./style.css";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import userImg from "../../assets/user.svg";

function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading]);

  const logoutFun = () => {
    try {
      signOut(auth)
        .then(() => {
          //Sign-out successful
          toast.success("Logout success.");
          navigate("/");
        })
        .catch((error) => {
          toast.error(error.message);
          //an error happened
        });
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="navbar">
      <p className="logo">
        Finance-Tracker.{" "}
        <span style={{ fontSize: "10px", fontWeight: 300 }}>by suyash</span>
      </p>
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <img
            src={user.photoURL ? user.photoURL : userImg}
            style={{ borderRadius: "50%", height: "1.5rem", width: "1.5rem" }}
          />
          <p className="logo link" onClick={logoutFun}>
            Logout
          </p>
        </div>
      )}
    </div>
  );
}

export default Header;
