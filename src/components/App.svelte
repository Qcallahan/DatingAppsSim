<main>
  <div class="banner">
    <h2>Why Dating Apps Suck</h2>
  </div>
  
  <div class="text">
    <p>Have you ever felt like you're stranded in a parched desert, thirsting for even a drop of attention on dating apps, while others seem to be swimming in an ocean of saltwater, overwhelmed by a flood of unsuitable suitors?</p>
    
    <p>For some, the well of potential matches runs dry, leaving them parched for even the slightest acknowledgment. Meanwhile, others find themselves drowning in an endless deluge of attention, though much of it proves to be anything but refreshing.</p>
    
    <p>In this website, we will show that even with minimal assumptions about the user base, the fundamental nature of these dating apps leads to many of their users suffering these very fates.</p>
  </div>

  <h2 class="reason-title">Reason 1: Too Many Men</h2>
  
  <div class="text">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vestibulum tellus non nunc condimentum, in rutrum metus aliquam. Donec vitae dolor ac magna aliquet vestibulum.</p>
    
    <p>Vivamus et enim ut lectus aliquam sodales. Integer sit amet tortor nec lectus congue congue. Ut ut tortor eget mauris venenatis aliquam.</p>
  </div>

  <h2 class="reason-title">Reason 2: Overload And Desperation</h2>

  <div class="text">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vestibulum tellus non nunc condimentum, in rutrum metus aliquam. Donec vitae dolor ac magna aliquet vestibulum.</p>
    
    <p>Vivamus et enim ut lectus aliquam sodales. Integer sit amet tortor nec lectus congue congue. Ut ut tortor eget mauris venenatis aliquam.</p>
  </div>

  <h2 class="reason-title">Reason 3: Attractiveness</h2>
  
  <div class="text">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vestibulum tellus non nunc condimentum, in rutrum metus aliquam. Donec vitae dolor ac magna aliquet vestibulum.</p>
    
    <p>Vivamus et enim ut lectus aliquam sodales. Integer sit amet tortor nec lectus congue congue. Ut ut tortor eget mauris venenatis aliquam.</p>
  </div>

  <h2 class="reason-title">Reason 4: The ELO System</h2>

  <div class="text">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vestibulum tellus non nunc condimentum, in rutrum metus aliquam. Donec vitae dolor ac magna aliquet vestibulum.</p>
    
    <p>Vivamus et enim ut lectus aliquam sodales. Integer sit amet tortor nec lectus congue congue. Ut ut tortor eget mauris venenatis aliquam.</p>
  </div>

  <h2 class="reason-title"> The Math Behind Optimal Matchmaking </h2>

  <div class="text">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vestibulum tellus non nunc condimentum, in rutrum metus aliquam. Donec vitae dolor ac magna aliquet vestibulum.</p>
    
    <p>Vivamus et enim ut lectus aliquam sodales. Integer sit amet tortor nec lectus congue congue. Ut ut tortor eget mauris venenatis aliquam.</p>
  </div>

  <div class="text">
    <b>For graders, this is a visulization we are working on of the Gale-Shapley algorithm, we will make simpler visulizations to work up to this but this is the rough draft of the final more complicated one (it may not make much sense if you are not familiar with the algorithm, which is why we want to work up to it, and probably add more labels to this one)</b>
  </div>

  <div id="container" style="display: flex; justify-content: center; align-items: center;">
  <div id="table-container">
    <button on:click={iterate}>Iterate</button>
    <button on:click={reset}>Generate Random Preferences</button>
    
    <!-- SVG for circles and lines -->
    <svg width="300" height="300">
      <!-- Circles for proposers -->
      <g transform="translate(50, 0)">
        <circle cx="0" cy="20" r="10" fill="blue" />
        <circle cx="0" cy="60" r="10" fill="blue" />
        <circle cx="0" cy="100" r="10" fill="blue" />
        <circle cx="0" cy="140" r="10" fill="blue" />
        <circle cx="0" cy="180" r="10" fill="blue" />
        <circle cx="0" cy="220" r="10" fill="blue" />
        <circle cx="0" cy="260" r="10" fill="blue" />
        <text x="-5" y="25" fill="white" text-anchor="middle">0</text>
        <text x="-5" y="65" fill="white" text-anchor="middle">1</text>
        <text x="-5" y="105" fill="white" text-anchor="middle">2</text>
        <text x="-5" y="145" fill="white" text-anchor="middle">3</text>
        <text x="-5" y="185" fill="white" text-anchor="middle">4</text>
        <text x="-5" y="225" fill="white" text-anchor="middle">5</text>
        <text x="-5" y="265" fill="white" text-anchor="middle">6</text>
      </g>

      <!-- Circles for requesters -->
      <g transform="translate(150, 0)">
        <circle cx="0" cy="20" r="10" fill="green" />
        <circle cx="0" cy="60" r="10" fill="green" />
        <circle cx="0" cy="100" r="10" fill="green" />
        <circle cx="0" cy="140" r="10" fill="green" />
        <circle cx="0" cy="180" r="10" fill="green" />
        <circle cx="0" cy="220" r="10" fill="green" />
        <circle cx="0" cy="260" r="10" fill="green" />
        <text x="-5" y="25" fill="white" text-anchor="middle">0</text>
        <text x="-5" y="65" fill="white" text-anchor="middle">1</text>
        <text x="-5" y="105" fill="white" text-anchor="middle">2</text>
        <text x="-5" y="145" fill="white" text-anchor="middle">3</text>
        <text x="-5" y="185" fill="white" text-anchor="middle">4</text>
        <text x="-5" y="225" fill="white" text-anchor="middle">5</text>
        <text x="-5" y="265" fill="white" text-anchor="middle">6</text>
      </g>
      <!-- Lines connecting requesters to proposers -->
      <g transform="translate(50, 0)">
        {#each gs.requesterMatch as match, index}
          {#if match !== undefined}
            <line x1="0" y1={(20 + index * 40)} x2="100" y2={(20 + match * 40)} stroke="black" />
          {:else}
            <!-- Invisible line for undefined matches -->
            <line x1="0" y1="0" x2="0" y2="0" style="stroke: none;" />
          {/if}
        {/each}
      </g>
    </svg>
  </div>
</div>


</main>


<style>
  /* Existing CSS */
  .banner {
    background-color: #A74B62;
    color: #FFE1E8; 
    padding: 20px;
    text-align: center;
    font-family: Arial, sans-serif;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .banner h2 {
    font-size: 36px;
    margin: 0;
  }
  
  .text {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
    line-height: 1.6;
    font-family: Arial, sans-serif;
    font-size: 16px;
  }
  
  .text p {
    margin-bottom: 20px;
  }
  
  .reason-title {
    font-size: 28px;
    text-align: center;
    margin-top: 40px;
    color: #A74B62;
  }

  table {
    border-collapse: collapse;
    width: 50%;
    margin: 0 auto;
  }
  th, td {
    border: 1px solid black;
    padding: 8px;
    text-align: center;
  }

  #table-container {
    margin: 20px auto;
    width: 50%;
  }
  
</style>

<script>
class GS {
    //A nxn matrix where each row is the requester preference of that proposer from [best -> worst]
    #proposers = null
    //A nxn matrix where each row is an array indexed by proposer containing the resquester's ranking
    //of that proposer from 0 - n, where n is most prefered.  i.e the 4th element of requester 3's
    //row is how requester 3 ranks proposer 4
    #requesters = null
    //A 1xn array holding how deep in the requester's preference we are in (bookkeeping only)
    #proposerIndex = null
    //Shows the current requester for proposer i
    #proposerMatch = null
    //Shows the current proposer for requester i
    #requesterMatch = null
    //Round # for the sake of iterations
    #round = 0
    //A hash for requesters and the offers they got that round
    #offers = null
    constructor(numElements) {
        //Generate template data
        this.n = numElements
        this.#proposers = Array(this.n)
        this.#requesters = Array(this.n)
        this.#proposerIndex = Array(this.n)
        this.#proposerMatch = Array(this.n)
        this.#requesterMatch = Array(this.n)
        this.#offers = this.buildHash(this.n)

        this.reset()
    }

    iterate() {
        this.#round++

        this.#offers = this.buildHash(this.n)

        //Every proposer makes an offer to the requester highest on its list
        for (let proposer = 0; proposer < this.n; proposer++) {
            if (this.#proposerMatch[proposer] == null) {
                this.#offers[this.#proposers[proposer][this.#proposerIndex[proposer]]].push(proposer)
                this.#proposerIndex[proposer]++
            }
        }

        //Every requester accepts the greatest offer if its better than its current position
        for (let requester = 0; requester < this.n; requester++) {
            //console.log('requester: ' + requester)
            if (this.#offers[requester].length > 0) {
                let currentOffer = this.#requesterMatch[requester]
                let startingOffer = currentOffer != null ? currentOffer : -1
                let maxOffer = startingOffer
                let rank = startingOffer != -1 ? this.#requesters[requester][currentOffer] : -1
                for (let offerIndex = 0; offerIndex < this.#offers[requester].length; offerIndex++) {
                    if (rank < this.requesters[requester][this.#offers[requester][offerIndex]]) {
                        maxOffer = this.#offers[requester][offerIndex]
                        rank = this.requesters[requester][this.#offers[requester][offerIndex]]
                    }
                }

                if (maxOffer == startingOffer) {
                    continue
                }

                if (startingOffer != -1) {
                    this.#proposerMatch[this.#requesterMatch[requester]] = null
                }

                this.#proposerMatch[maxOffer] = requester
                this.#requesterMatch[requester] = maxOffer
            }
        }

        
    }

    reset() {
        this.#proposers = Array(this.n)
        this.#requesters = Array(this.n)
        this.#proposerIndex = Array(this.n)
        this.#proposerMatch = Array(this.n)
        this.#requesterMatch = Array(this.n)
        this.#offers = this.buildHash(this.n)
        this.#round = 0

        let arr = this.buildArray(this.n)
        this.#proposerIndex = this.#proposerIndex.fill(0)

        //Generate proposer matrix      
        for (let i = 0; i < this.n; i++) {
            arr = this.shuffleArray(arr)
            this.#proposers[i] = arr.slice()
        }

        //Generate requester matrix
        for (let i = 0; i < this.n; i++) {
            arr = this.shuffleArray(arr)
            this.#requesters[i] = arr.slice()
        }
    }

    buildHash(n) {
        let arr = Array(n)
        for (let i = 0; i < n; i++) {
            arr[i] = Array()
        }
        return arr
    }

    buildArray(n) {
        let arr = Array(n)
        for (let i = 0; i < n; i++) {
            arr[i] = i
        }
        return arr
    }

    //Fisher-Yates Shuffle
    shuffleArray(arr) {
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


    get proposers() {
        return this.#proposers
    }

    get requesters() {
        return this.#requesters
    }

    get proposerIndex() {
        return this.#proposerIndex
    }

    get proposerMatch() {
        return this.#proposerMatch
    }

    get requesterMatch() {
        return this.#requesterMatch
    }

    get round() {
        return this.#round
    }

    get offers() {
        return this.#offers
    }
}

//Create the godel-Shapley object
//hard coding to 7 element for now but in the future we will probably want to allow the user to change this
let gs = new GS(7)
console.log(gs.proposers)
console.log(gs.requesters)
//gs.iterate()
console.log(gs.requesterMatch)


import { onMount } from 'svelte';

onMount(() => {
    const tableContainer = document.getElementById('table-container');

    // Table for proposers preferences
    const proposersTable = createTableElement('Proposers Preferences', gs.proposers);
    tableContainer.appendChild(proposersTable);

    // Table for requesters preferences
    const requestersTable = createTableElement('Requesters Preferences', gs.requesters);
    tableContainer.appendChild(requestersTable);
});

//create the tables at runtime
//may need to restructure later if we let user dynamically change number of people
function createTableElement(captionText, data) {
    const table = document.createElement('table');
    const tableBody = document.createElement('tbody');

    data.forEach(rowData => {
        const row = document.createElement('tr');

        rowData.forEach(cellData => {
            const cell = document.createElement('td');
            cell.textContent = cellData;
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });

    table.appendChild(tableBody);

    // Adding caption
    const caption = document.createElement('caption');
    caption.textContent = captionText;
    table.appendChild(caption);

    return table;
}

//Do 1 step of Gale-Shapley
function iterate() {
    gs.iterate();
    
    // Redraw lines
    const lines = document.querySelectorAll('line');
    lines.forEach((line, index) => {
      const match = gs.requesterMatch[index];
      if (match !== undefined) {
        line.setAttribute('x1', '0');
        line.setAttribute('y1', (20 + index * 40).toString());
        line.setAttribute('x2', '100');
        line.setAttribute('y2', (20 + match * 40).toString());
        line.style.stroke = 'black'; // Make the line visible if match is defined
      } else {
        line.style.stroke = 'none'; // Hide the line if match is undefined
      }
    });

    // Change cell colors in proposers table
    const proposersTable = document.querySelector('#table-container table');
    const proposersRows = proposersTable.querySelectorAll('tr');
    proposersRows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td');
      cells.forEach((cell, cellIndex) => {
        if (cellIndex === gs.proposerIndex[rowIndex] - 1) {
          cell.style.backgroundColor = 'yellow'; // Change cell color
        } else {
          cell.style.backgroundColor = ''; // Reset cell color
        }
      });
    });

    // Change cell colors in requesters table
    const requestersTable = document.querySelectorAll('#table-container table')[1];
    const requestersRows = requestersTable.querySelectorAll('tr');
    requestersRows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td');
      const matchIndex = gs.requesterMatch[rowIndex];
      cells.forEach((cell, cellIndex) => {
        if (matchIndex !== undefined && cell.textContent.trim() === matchIndex.toString()) {
          cell.style.backgroundColor = 'yellow'; // Change cell color
        } else {
          cell.style.backgroundColor = ''; // Reset cell color
        }
      });
    });
}

//Randomize the tables and reset Gale-Shapley
function reset() {
    gs.reset();

    // Reset lines
    const lines = document.querySelectorAll('line');
    lines.forEach(line => {
        line.style.stroke = '';
    });

    // Update proposers table
    const proposersTable = document.querySelector('#table-container table');
    updateTable(proposersTable, 'Proposers Preferences', gs.proposers);

    // Update requesters table
    const requestersTable = document.querySelectorAll('#table-container table')[1];
    updateTable(requestersTable, 'Requesters Preferences', gs.requesters);
}

//This function is called by restet to change the numbers in the tables
function updateTable(table, captionText, data) {
    const tableBody = table.querySelector('tbody');
    tableBody.innerHTML = '';

    data.forEach(rowData => {
        const row = document.createElement('tr');

        rowData.forEach(cellData => {
            const cell = document.createElement('td');
            cell.textContent = cellData;
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });

    // Update caption
    const caption = table.querySelector('caption');
    caption.textContent = captionText;
}

</script>