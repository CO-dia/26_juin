export default function FullSizeVideo() {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <video
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        style={{
          pointerEvents: "none",
        }}
      >
        <source src="/Heni.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
