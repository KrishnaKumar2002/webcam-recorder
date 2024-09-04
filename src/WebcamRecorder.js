// src/WebcamRecorder.js
import React, { useRef, useState } from 'react';
import RecordRTC from 'recordrtc';

const WebcamRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const videoRef = useRef(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    videoRef.current.srcObject = stream;

    const recorder = RecordRTC(stream, { type: 'video' });
    recorder.startRecording();
    setMediaRecorder(recorder);
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stopRecording(() => {
        const blob = mediaRecorder.getBlob();
        setVideoUrl(URL.createObjectURL(blob));
        setIsRecording(false);
      });
    }
  };

  const downloadVideo = () => {
    if (videoUrl) {
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = 'recorded-video.mp4';
      a.click();
    }
  };

  return (
    <div>
      <h1>Webcam Recorder</h1>
      <video ref={videoRef} autoPlay muted style={{ width: '100%' }}></video>
      <div>
        {!isRecording ? (
          <button onClick={startRecording}>Start Recording</button>
        ) : (
          <button onClick={stopRecording}>Stop Recording</button>
        )}
        {videoUrl && <button onClick={downloadVideo}>Download Video</button>}
      </div>
    </div>
  );
};

export default WebcamRecorder;
