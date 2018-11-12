'use strict';

function sortByName(friends) {
    friends.sort((friend1, friend2) => friend1.name > friend2.name ? 1 : -1);
}

function getBestFriends(friends) {
    return friends.filter(friend => friend.best);
}

function filterFriends(friends, filter) {
    return friends.filter(friend => filter.check(friend));
}

function checkForUniqueName(friendsObject, resultFriends) {
    return friendsObject.filter(name => resultFriends
        .every(resultFriend => resultFriend.name !== name));
}

function getNewNames(bestFriends, resultFriends) {
    return bestFriends.map(friend => checkForUniqueName(friend.friends, resultFriends))
        .reduce((resultArray, someArray) => resultArray.concat(someArray));

}

function getArrayOfObjectFriends(newNames, friends) {
    return newNames.map(name => friends
        .filter(obj => obj.name === name))
        .reduce((resultArray, someArray) => resultArray.concat(someArray));
}

function getResultFriends(friends, filter, maxLvl = Infinity) {
    sortByName(friends);
    let bestFriends = getBestFriends(friends);
    let resultFriends = bestFriends;
    while (maxLvl > 1) {
        const newNames = getNewNames(bestFriends, resultFriends);
        if (newNames.length === 0) {
            break;
        }
        bestFriends = getArrayOfObjectFriends(newNames, friends);
        if (bestFriends.length === 0) {
            break;
        }
        resultFriends = resultFriends.concat(bestFriends);
        maxLvl--;
    }

    return filterFriends(resultFriends, filter);
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError();
    }

    this.resultFriends = getResultFriends(friends, filter);

}

Iterator.prototype.done = function () {
    return this.resultFriends.length === 0;
};

Iterator.prototype.next = function () {
    if (!this.done()) {
        return this.resultFriends.shift();
    }

    return null;
};

LimitedIterator.prototype = Object.create(Iterator.prototype);

/**
 * Итератор по друзям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Number} maxLevel – максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel) {
    this.resultFriends = getResultFriends(friends, filter, maxLevel);
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.check = () => true;
}


MaleFilter.prototype = new Filter();
FemaleFilter.prototype = new Filter();

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */


function MaleFilter() {
    this.check = (friend) => friend.gender === 'male';
}


/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.check = (friend) => friend.gender === 'female';
}


exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
