

export const findObjectByKey = (array, key, value) => {
    for (var i = 0; i < array.length; i++) {
            if(array[i].variant._id === value){
                return i
            }
    }
    return null;
}