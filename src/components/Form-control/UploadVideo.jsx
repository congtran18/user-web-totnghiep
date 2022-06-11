/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-newline */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { saveFile, deleteFile } from 'features/storageSlice';
import { addStepOneUrl } from 'features/registerTutorSlice'
import { useDispatch, useSelector } from 'react-redux';
import ReactPlayer from 'react-player'
import { isFile } from 'helpers/validateFile'

function UploadVideo({ errors, name, register, videoSource, value, cache, label }) {

  const { stepOne } = useSelector(
    (state) => state.registerTutor
  );

  const { isLoading } = useSelector(
    (state) => state.storage
  );

  const imagePlaceholder = 'https://cdn.dribbble.com/users/2105902/screenshots/10857439/media/4602eb39dc6b0afb26ccfb35df782924.gif';
  const uploadImage = videoSource || imagePlaceholder;
  const [video, setVideo] = useState(null);
  const dispatch = useDispatch();

  const storageFile = async (file) => {
    var videoData = new FormData();
    videoData.append("file", file);
    const dataVideo = await dispatch(saveFile(videoData))
    dispatch(addStepOneUrl({ videoUrl: dataVideo.payload }))
    return dataVideo.payload
  }

  useEffect(() => {
    if (value && isFile(value[0])) {
      console.log("value[0]",value[0])
      setVideo(URL.createObjectURL(value[0]));
      if (cache === true) {
        //Xóa ảnh hiện tại khi up ảnh mới
        storageFile(value[0])
        if (stepOne.videoUrl) {
          //Lấy url id ảnh từ storage firebase
          const id = stepOne.videoUrl.split("/", 8)[7].split("?")[0]
          dispatch(deleteFile(id))
        }
      }
      return;
    }
    setVideo(null);
  }, [value]);

  return (
    <div className='mb-5'>
      <div className="flex justify-center">
        <div className="mb-1 w-full border-2 border-neutral-200 flex flex-col justify-center items-center pt-3 pb-5">
          <label className="inline-block text-gray-700 content-center">{label}</label>
          <div className="mb-4 ml-6">
            <ReactPlayer
              url={video || uploadImage}
              playing={true}
              controls={true}
              playIcon
              width='95%'
              height='100%'
            />
          </div>
          <div>
            <label htmlFor="formFile-video">
              <input
                {...register(name)}
                accept="video/*"
                type="file" id="formFile-video"
                name={name}
                className="hidden"
              />

              {!isLoading ? <div class="cursor-pointer bg-white text-gray-800 font-bold rounded border border-b-4 border-green-500 hover:border-green-600 hover:bg-green-500 hover:text-white shadow-md py-1 px-6 inline-flex items-center">
                <span class="mr-2">Chọn file</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-cloud-arrow-down-fill" viewBox="0 0 16 16"> <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 6.854-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708z" /> </svg>
              </div> :
                <button disabled type="button" class="py-2.5 px-5 mr-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center">
                  <svg role="status" class="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
                  </svg>
                  Loading...
                </button>
              }
            </label>
          </div>
        </div>
      </div>
      <p className="ml-3 text-[0.8rem] text-[#F44336] font-['Roboto', 'Helvetica', 'Arial', 'sans-serif']">{errors[name]?.message}</p>
    </div>
  );
}

UploadVideo.propTypes = {
  control: PropTypes.object,
  errors: PropTypes.object,
  register: PropTypes.any,
  value: PropTypes.any,

  name: PropTypes.string,
  videoSource: PropTypes.string,
  cache: PropTypes.bool
};

export default UploadVideo;
