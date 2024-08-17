const sum = function(a, b) {
    return a + b;
}
sum(2, 8);

console.log(sum(1,1));

const sums = [3, 4, 756 ,56,654,23,5465,6546,456,34,344,3778,0,123,457,4556];

const fourCountySums = sums.filter(sum => {
    return sum > 2000;
});

console.log(fourCountySums);


