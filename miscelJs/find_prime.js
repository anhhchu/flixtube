//  Find prime number

n = 10

nextPrime:
for (i = 2; i <= n; i++){
    for (j = 1; j <= Math.sqrt(i); j++) {
        if ( j != 1 && i%j == 0 ) {continue nextPrime}
    }
    alert(`Prime number: ${i}!`)
};
