// Fisher-Yates Shuffle algorithm
export function shuffle(list) {
    let internalList = [...list];
    for (let i = internalList.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        [internalList[i], internalList[j]] = [internalList[j], internalList[i]];
    }
    return internalList;
}