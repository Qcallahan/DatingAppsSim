function shuffleArray(arr) {
    let currentIndex = arr.length - 1
    let randomIndex = 0
    let temp = 0
    while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        temp = arr[randomIndex]
        arr[randomIndex] = arr[currentIndex]
        arr[currentIndex] = temp
        currentIndex--
    }

    return arr
}

function countArray(n) {
    let arr = new Array(n)
    for (let i = 0; i < n; i++) {
        arr[i] = i
    }

    return arr
}

class DatingSim {
    NameRepo = new NameRepo()

    people = [
        [],
        []
    ]

    n = [0, 0]

    likes = null
    matches = null
    
    #swipesPerRound = 10
    get swipesPerRound() {
        return this.#swipesPerRound
    }
    set swipesPerRound(value) {
        this.#swipesPerRound = value 
    }
    #likesPerRound = 1
    get likesPerRound() {
        return this.#likesPerRound
    }
    set likesPerRound(value) {
        this.#likesPerRound = value
    }
    #fixedLike = -1
    get fixedLike() {
        return this.#fixedLike
    }
    set fixedLike(value) {
        this.#fixedLike = value
    }
    #lowerStandards = false
    get lowerStandards() {
        return this.#lowerStandards
    }
    set lowerStandards(value) {
        this.#lowerStandards = value
    }
    #doElo = false
    get doElo() {
        return this.#doElo
    }
    set doElo(value) {
        this.#doElo = value
    }

    //Returns an array indexed by target holding if the person in group send that target a like
    getSentLikes(group, person) {
        return this.likes[group][person]
    }

    //Returns a 2d array showing if [group0person][group1person] is matched (both like)
    getMatches() {
        return this.matches
    }

    constructor(num_group_0, num_group_1) {
        this.n[0] = num_group_0
        this.n[1] = num_group_1

        this.reset()
    }

    reset() {
        this.NameRepo = new NameRepo()
        this.people = [
            [],
            []
        ]
        this.matches = new Array(this.n[0])
        for (let i = 0; i < this.n[1]; i++) {
            this.matches[i] = new Array(this.n[1]).fill(false)
        }

        for (let i = 0; i < this.n[0]; i++) {
            let name = this.NameRepo.getName(0)
            this.people[0].push(new Person(0, name))
        }

        for (let i = 0; i < this.n[1]; i++) {
            let name = this.NameRepo.getName(1)
            this.people[1].push(new Person(1, name))
        }

        let g0_likes = []

        for (let i = 0; i < this.n[0]; i++) {
            g0_likes.push(new Array(this.n[0]).fill(0))
        }

        let g1_likes = []

        for (let i = 0; i < this.n[1]; i++) {
            g1_likes.push(new Array(this.n[1]).fill(0))
        }

        this.likes = [g0_likes, g1_likes]
    }

    //Runs an instance of the sim where every person sends up to likes_per_round likes 
    iterate() {
        for (let i = 0; i < this.n[0]; i++) {
            this.iteratePerson(0, i)
            this.iteratePerson(1, i)
        }
    }

    //Runs an iteration for a single person
    iteratePerson(group, id) {
        let num_likes = 0        
        let queue = this.#doElo ? this.getQueue(1 * !group) : shuffleArray(countArray(this.n[1 * !group]))
        for (let j = 0; j < this.n[1 * !group]; j++) {
            let liked = false
            if (this.fixedLike != -1) {
                if (Math.random() <= this.fixedLike) {
                    liked = this.sendLike(group, id, queue[j])
                } else {
                    this.people[1 * !group][j].elo--
                }
            } else if (this.people[group][id].ratePerson(this.people[1 * !group][queue[j]])) {                    
                liked = this.sendLike(group, id, queue[j])
            } else {
                this.people[1 * !group][j].elo--
            }

            num_likes += liked

            if (num_likes == this.likesPerRound) {
                break;
            }
            if (j >= this.swipesPerRound) {
                break;
            }
        }

        if (this.lowerStandards && num_likes < this.likesPerRound) {
            this.people[group][id].lowerStandards()
        }
    }

    //Method for a person to like another person and mark a match if it works
    sendLike(sender_group, sender_id, target_id) {
        if (this.likes[sender_group][sender_id][target_id] == 0) {
            this.likes[sender_group][sender_id][target_id] = 1

            this.people[1 * !sender_group][target_id].elo++

            if (this.likes[1 * !sender_group][target_id][sender_id]) {
                if (sender_group) {
                    this.matches[target_id][sender_id] = true
                } else {
                    this.matches[sender_id][target_id] = true
                }
                
            }
            return true
        } else {
            return false
        }
    }

    getQueue(group) {
        function compareElo(a, b) {
            return b.elo - a.elo 
        }

        let data = []

        for (let i = 0; i < this.n[group]; i++) {
            data.push({id: i, elo: this.people[group][i].elo})
        }

        data.sort(compareElo)

        let output = data.map((x) => x.id)

        return output
    }
    

}

class NameRepo {
    names = [
        //Group 0
        [
            'Bob',
            'Bob',
            'Bob',
            'Bob',
            'Bob',
            'Bob',
            'Bob',
            'Bob',
            'Bob',
            'Bob'
        ],
        //Group 1
        [
            'Alice',
            'Alice',
            'Alice',
            'Alice',
            'Alice',
            'Alice',
            'Alice',
            'Alice',
            'Alice',
            'Alice',
        ]
    ]
    constructor() {
        this.shuffle()
    }

    //Returns a name from the specified group
    getName(group) {
        if (this.names[group].size < 1) { 
            throw `Group ${group} out of names`
        }
        return this.names[group].pop()
    }

    //Adds a name to the specified group
    returnName(name, group) {
        this.names[group].push(name)
    }

    //Randomize the arrays
    shuffle() {
        this.names[0] = shuffleArray(this.names[0])
        this.names[1] = shuffleArray(this.names[1])
    }    
}

class Person {    
    #name = ''
    #group = -1
    #elo = 0
    #attractiveness = -1
    #pickiness = -1

    constructor(group, name, elo = 0, attractiveness = -1, pickiness = -1) {
        this.#group = group
        this.#name = name
        this.#elo = elo

        this.#attractiveness = attractiveness != -1 ? attractiveness : Math.floor(Math.random() * 10)
        this.#pickiness = pickiness != -1 ? pickiness : Math.floor(Math.random() * 10)
    }

    ratePerson(person) {
        return person.attractiveness >= this.#pickiness
    }

    lowerStandards() {
        this.#pickiness--
    }

    set name(name) {
        this.#name = name
    }

    get name() {
        return this.#name
    }

    set group(group) {
        this.#group = group
    }

    get group() {
        return this.#group
    }

    set elo(elo) {
        this.#elo = elo
    }

    get elo() {
        return this.#elo
    }

    set attractiveness(attractiveness) {
        this.#attractiveness = attractiveness
    }

    get attractiveness() {
        return this.#attractiveness
    }

    set pickiness(pickiness) {
        this.#pickiness = pickiness
    }

    get pickiness() {
        return this.#pickiness
    }
}

// DS = new DatingSim(7, 3)
// DS.likes_per_round = 3;
// DS.iterate();
// console.log(DS.getMatches());
// DS.iterate();
// console.log(DS.getMatches());
// DS.iterate();
// console.log(DS.getMatches());
// DS.iterate();
// console.log(DS.getMatches());
// DS.iterate();