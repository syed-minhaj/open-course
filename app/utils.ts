
function CheckNumberIs2DecimalPlace(number: number) {
    number = number * 100;
    if(number % 1 != 0){
        return {err : "Number should be in 2 decimal"}
    }
    return {err : null};
}

export {CheckNumberIs2DecimalPlace};