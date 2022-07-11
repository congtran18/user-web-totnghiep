import useSWRInfinite from 'swr/infinite'
import axios from "axios";

const fetcher = async (url) => await axios.get(url).then(res => res.data);
//session && session.user.email
export const usePaginateLessonMessage = (uid) => {
    //   if (!path) {
    //     throw new Error("Path is required")
    //   }
    const PAGE_LIMIT = 3

    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.data) return null

        // first page, we don't have `previousPageData`
        return `${process.env.NEXT_PUBLIC_DB_URL}/lessonMessage/${uid}?page=${pageIndex + 1}&limit=5`// SWR key
    }

    const { data, error, size, setSize } = useSWRInfinite(
        getKey,
        fetcher,
        {
            revalidateOnFocus: true
        }
    )

    const totalLessonMessages = data ? data[0].data[0].count.length > 0 && data[0].data[0].count[0].totalCount : 0

    // let lessonMessages = data ? [].concat(...data) : []

    let lessonMessages = []
    if (data) {
        for (let i = 0; i < data.length; i++) {
            lessonMessages = lessonMessages.concat(data[i].data[0].lessonMessage)
        }
    }

    const isLoading = !data && !error
    const isLoadingInitialData = isLoading
    const isLoadingMore =
        isLoadingInitialData ||
        (size > 0 && data && typeof data[size - 1] === "undefined")
    const isEmpty = data?.[0]?.length === 0
    const isReachingEnd =
        isEmpty || (data && data[data.length - 1].data[0].lessonMessage.length < PAGE_LIMIT)

    return { lessonMessages, totalLessonMessages, error, isLoading, isLoadingMore, size, setSize, isReachingEnd }
}