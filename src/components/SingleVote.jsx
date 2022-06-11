
import moment from 'moment'

const SingleVote = ({ vote }) => {
    return (
        <div className='pt-4 px-5 pb-2 mb-2 border-b-2'>
            <div className='flex justify-between'>
                <div className='font-bold text-md' >{vote.user_vote.fullName}</div>
                <div className='text-slate-400 text-md'>{moment(new Date(vote.createdAt)).format('DD/MM/YYYY, h:mm:ss a')}</div>
            </div>
            <div>
                <ul class="flex justify-start my-1">
                    {[...Array(vote.rating)].map((x, index) => (
                        <>
                            <li>
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="star" class="w-4 text-yellow-500 mr-1" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                    <path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path>
                                </svg>
                            </li>
                        </>
                    ))}
                    {[...Array(5 - vote.rating)].map((x, index) => (
                        <>
                            <li>
                                <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="star" class="w-4 text-yellow-500" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                    <path fill="currentColor" d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z"></path>
                                </svg>
                            </li>
                        </>
                    ))}
                </ul>
            </div >
            <div className='text-sm'>{vote.comment}</div>
        </div >
    );
}

export default SingleVote;
