import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

const ClientRoom = ({ userNo, socket, setUsers, setUserNo }) => {
  // This useRef hook is used to store a reference to the image DOM element.
  const imgRef = useRef(null);

  useEffect(() => {
    // This useEffect hook sets up a listener for the "message" event on the socket.
    // When a "message" event is received, it displays a toast notification with the message data.
    socket.on("message", (data) => {
      toast.info(data.message);
    });
  }, []);

  useEffect(() => {
    // This useEffect hook sets up a listener for the "users" event on the socket.
    // When a "users" event is received, it updates the users and userNo state variables with the new data.
    socket.on("users", (data) => {
      setUsers(data);
      setUserNo(data.length);
    });
  }, []);

  useEffect(() => {
    // This useEffect hook sets up a listener for the "canvasImage" event on the socket.
    // When a "canvasImage" event is received, it updates the src attribute of the image element with the new data.
    socket.on("canvasImage", (data) => {
      imgRef.current.src = data;
    });
  }, []);

  // The render method returns the JSX that should be rendered by this component.
  // It includes a heading displaying the number of online users and an image element that will display the canvas image.
  return (
    <div className="container-fluid">
      <div className="row pb-2">
        <h1 className="display-5 pt-4 pb-3 text-center">
          React Drawing App - users online:{userNo}
        </h1>
      </div>
      <div className="row mt-5">
        <div
          className="col-md-8 overflow-hidden border border-dark px-0 mx-auto
          mt-3"
          style={{ height: "500px" }}
        >
          <img className="w-100 h-100" ref={imgRef} src="" alt="image" />
        </div>
      </div>
    </div>
  );
};

export default ClientRoom;
