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


// code that we run
const grades = [10, 15, 5];

const sumsis = grades.reduce((total, current) => { 
    return total + current;
}, 0);

console.log(sumsis);