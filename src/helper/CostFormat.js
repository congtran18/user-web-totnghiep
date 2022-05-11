const CostFormat = (cost) => {
    var costlength;
    if ((cost.length / 3 - parseInt(cost.length / 3)) > 0) {
        costlength = parseInt(cost.length / 3);
    } else {
        costlength = parseInt(cost.length / 3) - 1;
    }
    for (let i = 1; i <= costlength; i++) {
        cost = [cost.slice(0, ((-3 * i) - (i - 1))), ".", cost.slice((-3 * i) - (i - 1))].join('');
    }
    return cost;
}

export default CostFormat
