export const averageRating = (arr) => {
    const { length } = arr;
    return arr.reduce((acc, val) => {
        return acc + (val.rating / length);
    }, 0);
}

export const percentRating = (arr) => {
    var tempResult = {}
    const { length } = arr;

    for (let { rating } of arr)
        tempResult[rating] = {
            rating,
            count: tempResult[rating] ? tempResult[rating].count + 1 : 1,
            percent: (tempResult[rating] ? tempResult[rating].count + 1 : 1)/length*100
        }

    let result = Object.values(tempResult)

    return result
}