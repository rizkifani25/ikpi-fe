const fileBaseUrl = `${process.env.PUBLIC_URL}/assets/dashboard/`;

const VideoWrapper = ({ source }) => {
  return (
    <>
      <video controls width="100%" height="720px" src={`${fileBaseUrl}${source}`}>
        <source src={`${fileBaseUrl}${source}`} type="video/mp4"></source>
      </video>
    </>
  );
};

export default VideoWrapper;
