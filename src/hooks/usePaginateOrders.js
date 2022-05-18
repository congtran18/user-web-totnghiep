import useSWRInfinite from 'swr/infinite'
import axios from "axios";
import { useRouter } from "next/router";

const fetcher = async (url) => await axios.get(url).then(res => res.data);
//session && session.user.email
export const usePaginateOrders = (email) => {
    //   if (!path) {
    //     throw new Error("Path is required")
    //   }
    const router = useRouter();
    const { sort } = router.query
    const PAGE_LIMIT = 3

    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.data) return null

        // first page, we don't have `previousPageData`
        return  `${process.env.NEXT_PUBLIC_DB_URL}/order/${email}?page=${pageIndex + 1}&limit=3&sort=${sort}`             // SWR key
    }

    const { data, error, size, setSize } = useSWRInfinite(
        getKey,
        fetcher
    )

    const totalOrders = data ? data[0].data.total : 0

    // let orders = data ? [].concat(...data) : []

    let orders = []
    if (data) {
        for (let i = 0; i < data.length; i++) {
            orders = orders.concat(data[i].data.order)
        }
    }

    const isLoading = !data && !error
    const isLoadingInitialData = isLoading
    const isLoadingMore =
        isLoadingInitialData ||
        (size > 0 && data && typeof data[size - 1] === "undefined")
    const isEmpty = data?.[0]?.length === 0
    const isReachingEnd =
        isEmpty || (data && data[data.length - 1].data.order.length < PAGE_LIMIT)

    return { orders, totalOrders, error, isLoading, isLoadingMore, size, setSize, isReachingEnd }
}