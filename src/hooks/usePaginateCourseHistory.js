import useSWRInfinite from 'swr/infinite'
import axios from "axios";
import { useRouter } from "next/router";

const fetcher = async (url) => await axios.get(url).then(res => res.data);
//session && session.user.email
export const usePaginateCourseHistory = (uid) => {
    //   if (!path) {
    //     throw new Error("Path is required")
    //   }
    const router = useRouter();
    const { sort, realname } = router.query
    const PAGE_LIMIT = 3

    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.data) return null

        // first page, we don't have `previousPageData`
        return `${process.env.NEXT_PUBLIC_DB_URL}/videocall/${uid}?page=${pageIndex + 1}&limit=3&sort=${sort}`             // SWR key
    }

    const { data, error, size, setSize } = useSWRInfinite(
        getKey,
        fetcher,
        {
            revalidateOnFocus: true
        }
    )

    console.log("uid", uid)
    console.log("usePaginateCourseHistory", data && data[0].data[0].count)

    const totalVideocalls = data ? data[0].data[0].count.length > 0 && data[0].data[0].count[0].totalCount : 0

    // let videocalls = data ? [].concat(...data) : []

    let videocalls = []
    if (data) {
        for (let i = 0; i < data.length; i++) {
            videocalls = videocalls.concat(data[i].data[0].user_videocall)
        }
    }

    const isLoading = !data && !error
    const isLoadingInitialData = isLoading
    const isLoadingMore =
        isLoadingInitialData ||
        (size > 0 && data && typeof data[size - 1] === "undefined")
    const isEmpty = data?.[0]?.length === 0
    const isReachingEnd =
        isEmpty || (data && data[data.length - 1].data[0].user_videocall.length < PAGE_LIMIT)

    return { videocalls, totalVideocalls, error, isLoading, isLoadingMore, size, setSize, isReachingEnd }
}