import { useContext, useEffect, useRef, useState } from "react";
import {
  SvgMicOn,
  SvgMicOff,
  SvgShowVideo,
  SvgHideVideo,
  PhoneDown,
} from "../../assets/icons/icons";
import { socketContext } from "../../context/socketContext";
import PresenceAvatar from "../PresenceAvatar";

function Video({ type, currentFriend, setShowCall }) {
  const { socket, currentUser, infoCall } = useContext(socketContext);

  const peerConnection = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const stream = useRef(null);
  const hasRunRef = useRef(false);

  const [idVideo, setIdVideo] = useState(null);
  const [camera, setCamera] = useState(true);
  const [mic, setMic] = useState(true);
  const [cameraFriend, setCameraFriend] = useState(true);
  const [micFriend, setMicFriend] = useState(true);
  const [isCalling, setIsCalling] = useState(true);

  const handler = async (e) => {
    if (e.detail.data.message === "Send Offer") {
      receiveOffer(e.detail.data.data);
      setIsCalling(false);
    }
    if (e.detail.data.message === "Send Answer") {
      receiveAnswer(e.detail.data.data);
    }
    if (e.detail.data.message === "Ice Candidate") {
      addIceCandidate(e.detail.data.data);
    }
    if (e.detail.data.message === "Change Mic") {
      setMicFriend(e.detail.data.data);
    }
    if (e.detail.data.message === "Change Camera") {
      setCameraFriend(e.detail.data.data);
    }
    if (e.detail.data.message === "End Call") {
      endCall();
    }
  };

  useEffect(() => {
    setIdVideo(currentFriend.id);
    if (hasRunRef.current === false) {
      hasRunRef.current = true;
      initCallConnection();
    }
    document.addEventListener("WebSocketEvent", handler);
    return () => {
      if (!hasRunRef.current) {
        stream.current.getTracks().forEach((track) => track.stop());
        peerConnection.current?.close();
        peerConnection.current = null;
      }
      document.removeEventListener("WebSocketEvent", handler);
    };
  }, []);

  async function initCallConnection() {
    try {
      const configuration = {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      };
      peerConnection.current = new RTCPeerConnection(configuration);

      peerConnection.current.ontrack = (e) => {
        if (e.streams && e.streams[0]) {
          remoteVideoRef.current.srcObject = e.streams[0];
          remoteVideoRef.current.onloadedmetadata = () => {
            remoteVideoRef.current
              .play()
              .catch((err) => console.log("play error", err));
          };
        }
      };

      peerConnection.current.onicecandidate = (e) => {
        if (e.candidate) {
          socket.send(
            JSON.stringify({
              type: "Ice Candidate",
              to: currentFriend.id,
              candidate: e.candidate,
            })
          );
        }
      };

      peerConnection.current.oniceconnectionstatechange = () => {
        console.log(
          "ICE connection state:",
          peerConnection.current.iceConnectionState
        );

        if (peerConnection.current.iceConnectionState === "connected") {
          console.log("Kết nối WebRTC thành công!");
        }
      };

      // getUserMedia
      let typeCall = infoCall?.typeCall || type;
      stream.current = await navigator.mediaDevices.getUserMedia(
        typeCall === "voice"
          ? { video: false, audio: true }
          : { video: true, audio: true }
      );
      localVideoRef.current.srcObject = stream.current;

      if (typeCall === "video") {
        stream.current.getTracks().forEach((track) => {
          peerConnection.current.addTrack(track, stream.current);
        });
      } else {
        stream.current.getAudioTracks().forEach((track) => {
          peerConnection.current.addTrack(track, stream.current);
        });
      }

      localVideoRef.current.onloadedmetadata = () => {
        localVideoRef.current
          .play()
          .catch((err) => console.log("play error", err));
      };

      if (type === "voice") {
        setCamera(false);
        setCameraFriend(false);
      }

      if (infoCall) {
        AcceptCallConnection();
        if (infoCall.typeCall === "video") {
          setCamera(true);
          setCameraFriend(true);
        }
      }
    } catch (err) {
      console.log(`Lỗi: ${err}`);
    }
  }

  async function AcceptCallConnection() {
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.send(
      JSON.stringify({
        type: "Send Offer",
        to: currentFriend.id,
        offer: offer,
      })
    );
    setIsCalling(false);
    type === "video" && setCameraFriend(true);
  }

  async function receiveOffer(offer) {
    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(offer)
    );
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    socket.send(
      JSON.stringify({
        type: "Send Answer",
        to: currentFriend?.id,
        answer: answer,
      })
    );
  }

  async function receiveAnswer(answer) {
    const remoteDesc = new RTCSessionDescription(answer);
    await peerConnection.current.setRemoteDescription(remoteDesc);
  }

  async function addIceCandidate(candidate) {
    await peerConnection.current.addIceCandidate(
      new RTCIceCandidate(candidate)
    );
  }

  function endCall() {
    hasRunRef.current = false;
    setShowCall(false);
  }

  function handleMic() {
    const audioTrack = stream.current?.getAudioTracks()[0];
    if (audioTrack) {
      const value = !audioTrack.enabled;
      setMic(value);
      audioTrack.enabled = value;
      socket.send(
        JSON.stringify({
          type: "Change Mic",
          to: currentFriend.id,
          mic: value,
        })
      );
    }
  }

  async function handleCamera() {
    const videoTrack = stream.current?.getVideoTracks()[0];
    const value = !camera;
    setCamera(value);
    socket.send(
      JSON.stringify({
        type: "Change Camera",
        to: currentFriend?.id,
        camera: value,
      })
    );
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
    } else {
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      const videoTrack = videoStream.getVideoTracks()[0];
      stream.current.addTrack(videoTrack);
      peerConnection.current.addTrack(videoTrack, stream.current);
      AcceptCallConnection();
    }
  }

  return (
    <div
      className={`h-[191px] relative flex w-full justify-evenly mb-5 ${
        idVideo !== currentFriend.id && "hidden"
      }`}
    >
      <div className={`w-[45%] h-[100%] flex bg-slate-800 rounded-xl`}>
        <video
          ref={localVideoRef}
          className={`w-full h-full ${!camera && "hidden"}`}
        ></video>
        <div className={`w-44 h-44 m-auto ${camera && "hidden"}`}>
          <PresenceAvatar imgUrl={currentUser.current.avatarURL} />
        </div>
      </div>
      <div className={`w-[45%] h-[100%] flex bg-slate-800 rounded-xl relative`}>
        <div className="absolute top-2 left-2">
          {micFriend ? (
            <SvgMicOn width={15} height={15} />
          ) : (
            <SvgMicOff width={15} height={15} />
          )}
        </div>
        <video
          ref={remoteVideoRef}
          className={`w-full h-full ${!cameraFriend ? "hidden" : ""}`}
          autoPlay
          playsInline
        ></video>
        <div
          className={`relative w-44 h-44 m-auto ${cameraFriend && "hidden"}`}
        >
          <div
            className={`${
              isCalling &&
              "absolute animate-ping rounded-full bg-[#3f3f3f] w-full h-full"
            }`}
          ></div>
          <div className={`w-44 h-44 m-auto ${isCalling && "opacity-60"}`}>
            <PresenceAvatar imgUrl={currentFriend.avatarURL} />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 z-20 left-[50%] translate-x-[-50%] flex items-center justify-center">
        <div className="flex bg-[#131416] p-[10px] rounded-lg">
          {mic ? (
            <button
              onClick={() => handleMic()}
              className="w-[40px] h-[40px] flex items-center justify-center rounded-lg cursor-pointer hover:bg-gray-500"
            >
              <SvgMicOn width={20} height={20} />
            </button>
          ) : (
            <button
              onClick={() => handleMic()}
              className="bg-[#27181b] w-[40px] h-[40px] flex items-center justify-center rounded-lg cursor-pointer hover:bg-gray-500"
            >
              <SvgMicOff width={20} height={20} />
            </button>
          )}

          {camera ? (
            <button
              onClick={() => handleCamera()}
              className="bg-[#15211b] w-[40px] h-[40px] flex items-center justify-center rounded-lg cursor-pointer hover:bg-gray-500"
            >
              <SvgShowVideo width={20} height={20} />
            </button>
          ) : (
            <button
              onClick={() => handleCamera()}
              className="w-[40px] h-[40px] flex items-center justify-center rounded-lg cursor-pointer hover:bg-gray-500"
            >
              <SvgHideVideo width={20} height={20} />
            </button>
          )}
        </div>
        <button
          onClick={() => {
            endCall();
            socket.send(
              JSON.stringify({
                type: "End Call",
                to: currentFriend.id,
              })
            );
          }}
          className="bg-[#d6363f] ml-4 w-[65px] h-[58px] flex items-center justify-center rounded-2xl cursor-pointer hover:bg-[#a3222b]"
        >
          <PhoneDown width={20} height={20} />
        </button>
      </div>
    </div>
  );
}

export default Video;
