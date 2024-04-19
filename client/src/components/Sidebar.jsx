import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

const Sidebar = ({ users, user, socket }) => {

  const [chat, setChat] = useState([])
  const [text, setText] = useState("")
  // This useRef hook is used to store a reference to the sidebar DOM element.
  const sideBarRef = useRef(null);
// console.log(user,"hello")
  const openSideBar = () => {
    // This function is triggered when the "Users" button is clicked.
    // It sets the left style property of the sidebar to 0, effectively sliding it into view.
    sideBarRef.current.style.left = 0;
  };

  const closeSideBar = () => {
    // This function is triggered when the "Close" button is clicked.
    // It sets the left style property of the sidebar to -100%, effectively sliding it out of view.
    sideBarRef.current.style.left = -100 + "%";
  };

  useEffect(() => {
    socket.on("chat", (data) => {
      setChat([...chat, data])
    });

  })

  let sendChat = () => {
    setChat([...chat, { text: text, user: user.userName }])
    socket.emit("chat", { text: text, user: user.userName });
    setText("");
  }
  // The render method returns the JSX that should be rendered by this component.
  // It includes a "Users" button, a sidebar with a "Close" button, and a list of users.
  return (
    <>
      <button
        className="btn btn-dark btn-sm"
        onClick={openSideBar}
        style={{ position: "absolute", top: "5%", left: "5%" }}
      >
        Users
      </button>
      <div
        className="position-fixed pt-2 h-100 bg-dark"
        ref={sideBarRef}
        style={{
          width: "300px",
          left: "-100%",
          transition: "0.3s linear",
          zIndex: "9999",
        }}
      >
        <button
          className="btn btn-block border-0 form-control rounded-0 btn-light"
          onClick={closeSideBar}
        >
          Close
        </button>
        <div className="w-auto mt-5 p-1">


          <div className="w-[90%]  border  p-2">

            <div className=" flex flex-col w-full  p-2 text-right border-white" style={{height:"500px", overflowY:"auto"}}>
              {chat.map((ele,index) => {
                if (ele.user === user.userName)
                  return (<p key={index} className="flex flex-col text-start">
                    <span className="text-white">{ele.text}</span>
                    <br />
                    <span   style={{color:"orange"}}>{ele.user}</span>
                  </p>)
                else
                  return (<p key={index} className=" flex flex-col text-end">
                    <span className="text-white">{ele.text}</span>
                    <br/>
                    <span  style={{color:"orange"}} >{ele.user}</span>
                  </p>)
              })}
            </div>
            <div className="flex justify-center w-full mt-3">
              <input type="text" value={text} className="border border-white bg-black text-white" onChange={(e) => {
                setText(e.target.value)
              }} />
              <button className="text-black bg-white rounded" onClick={() => { sendChat() }}>send</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
