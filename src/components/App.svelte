<script>
  class GS {
    //A nxn matrix where each row is the requester preference of that proposer from [best -> worst]
    #proposers = null;
    //A nxn matrix where each row is an array indexed by proposer containing the resquester's ranking
    //of that proposer from 0 - n, where n is most prefered.  i.e the 4th element of requester 3's
    //row is how requester 3 ranks proposer 4
    #requesters = null;
    //A 1xn array holding how deep in the proposer's preference we are in (bookkeeping only)
    #proposerIndex = null;
    //A 1xn array holding how deep in the requester's preference we are in (bookkeeping only)
    #requesterIndex = null;
    //Shows the current requester for proposer i
    #proposerMatch = null;
    //Shows the current proposer for requester i
    #requesterMatch = null;
    //Round # for the sake of iterations
    #round = 0;
    //A hash for requesters and the offers they got that round
    #offers = null;
    constructor(numElements, numPropose = -1) {
      //Generate template data
      if (numPropose == -1) {
        numPropose = numElements;
      }
      this.p = numPropose;
      this.n = numElements;
      this.reset();
    }

    #randomArray = null;

    iterate() {
      this.#round++;

      this.#offers = this.buildHash(this.n);

      let picked = this.#randomArray;

      if (this.p != this.n) {
        this.#randomArray = this.shuffleArray(this.#randomArray);
        picked = this.#randomArray.slice(0, this.p);
      }

      //Every proposer makes an offer to the requester highest on its list
      for (let proposer = 0; proposer < this.n; proposer++) {
        if (
          this.#proposerMatch[proposer] == null &&
          picked.includes(proposer)
        ) {
          this.#offers[
            this.#proposers[proposer][this.#proposerIndex[proposer]]
          ].push(proposer);
          this.#proposerIndex[proposer]++;
        }
      }

      //Every requester accepts the greatest offer if its better than its current position
      for (let requester = 0; requester < this.n; requester++) {
        //console.log('requester: ' + requester)
        if (this.#offers[requester].length > 0) {
          let currentOffer = this.#requesterMatch[requester];
          let startingOffer = currentOffer != null ? currentOffer : -1;
          let maxOffer = startingOffer;
          let rank =
            startingOffer != -1
              ? this.#requesters[requester][currentOffer]
              : -1;
          for (
            let offerIndex = 0;
            offerIndex < this.#offers[requester].length;
            offerIndex++
          ) {
            if (
              rank <
              this.#requesters[requester][this.#offers[requester][offerIndex]]
            ) {
              maxOffer = this.#offers[requester][offerIndex];
              rank =
                this.#requesters[requester][
                  this.#offers[requester][offerIndex]
                ];
            }
          }

          if (maxOffer == startingOffer) {
            continue;
          }

          if (startingOffer != -1) {
            this.#proposerMatch[this.#requesterMatch[requester]] = null;
          }

          this.#requesterIndex[requester] = this.n - 1 - maxOffer;
          this.#proposerMatch[maxOffer] = requester;
          this.#requesterMatch[requester] = maxOffer;
        }
      }
    }

    reset() {
      this.#proposers = Array(this.n);
      this.#requesters = Array(this.n);
      this.#proposerIndex = Array(this.n);
      this.#requesterIndex = Array(this.n);
      this.#proposerMatch = Array(this.n);
      this.#requesterMatch = Array(this.n);
      this.#offers = this.buildHash(this.n);
      this.#round = 0;
      this.#randomArray = this.buildArray(this.n);

      let arr = this.buildArray(this.n);
      this.#proposerIndex = this.#proposerIndex.fill(0);
      this.#requesterIndex = this.#requesterIndex.fill(0);

      //Generate proposer matrix
      for (let i = 0; i < this.n; i++) {
        arr = this.shuffleArray(arr);
        this.#proposers[i] = arr.slice();
      }

      //Generate requester matrix
      for (let i = 0; i < this.n; i++) {
        arr = this.shuffleArray(arr);
        this.#requesters[i] = arr.slice();
      }
    }

    buildHash(n) {
      let arr = Array(n);
      for (let i = 0; i < n; i++) {
        arr[i] = Array();
      }
      return arr;
    }

    buildArray(n) {
      let arr = Array(n);
      for (let i = 0; i < n; i++) {
        arr[i] = i;
      }
      return arr;
    }

    //Fisher-Yates Shuffle
    shuffleArray(arr) {
      let currentIndex = arr.length - 1;
      let randomIndex = 0;
      let temp = 0;
      while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        temp = arr[randomIndex];
        arr[randomIndex] = arr[currentIndex];
        arr[currentIndex] = temp;
        currentIndex--;
      }

      return arr;
    }

    get proposers() {
      return this.#proposers;
    }

    get requesters() {
      let n = this.#requesters.length;
      let output = Array(n);
      for (let i = 0; i < n; i++) {
        output[i] = Array(n);
        for (let j = 0; j < n; j++) {
          output[i][this.#requesters[i][j]] = j;
        }
        output[i] = output[i].reverse();
      }

      return output;

      //return this.#requesters
    }

    set proposers(p) {
      this.#proposers = p;
    }

    set requesters(r) {
      this.#requesters = r;
    }

    get proposerIndex() {
      return this.#proposerIndex;
    }

    get requesterIndex() {
      return this.#requesterIndex;
    }

    get proposerMatch() {
      return this.#proposerMatch;
    }

    get requesterMatch() {
      return this.#requesterMatch;
    }

    get round() {
      return this.#round;
    }

    get offers() {
      return this.#offers;
    }

    set numPropose(num) {
      if (0 >= num || this.n < num) {
        return;
      }
      this.p = num;
    }

    get numPropose() {
      return this.p;
    }
  }

  //Create the godel-Shapley object
  //hard coding to 7 element for now but in the future we will probably want to allow the user to change this
  let gs = new GS(7);
  // gs.proposers = [
  //     [2, 0, 3, 1],
  //     [3,2,1,0],
  //     [0,3,2,1],
  //     [2,0,1,3],
  // ]
  // gs.requesters = [
  // [3,1,2,0],
  // [1,2,0,3],
  // [0,1,3,2],
  // [1,2,0,3]
  // ]

  //gs.iterate()

  import { onMount } from "svelte";
  import * as d3 from "d3";

  let xScale, yScale;

  let data = [
    { color: "Women", averageLikes: 0, color2: "pink" },
    { color: "Men", averageLikes: 0, color2: "#7597E7" },
  ];

  let matchData = [
    { color: "Women", averageMatches: 0, color2: "pink" },
    { color: "Men", averageMatches: 0, color2: "#7597E7" },
  ];

  onMount(() => {
    const tableContainer = document.getElementById("table-container");

    // Table for proposers preferences
    const proposersTable = createTableElement(
      "Proposers Preferences\n⟵Preferred",
      gs.proposers
    );
    tableContainer.appendChild(proposersTable);

    // Table for requesters preferences
    const requestersTable = createTableElement(
      "Requesters Preferences\n⟵Preferred",
      gs.requesters
    );
    tableContainer.appendChild(requestersTable);

    updateCircles();

    createChart();
    createChart();
    createChartMatches();
    createChartMatches();
  });

  //create the tables at runtime
  //may need to restructure later if we let user dynamically change number of people
  function createTableElement(captionText, data) {
    const table = document.createElement("table");
    const tableBody = document.createElement("tbody");

    let i = 0;
    data.forEach((rowData) => {
      const row = document.createElement("tr");

      const cell = document.createElement("td");
      cell.textContent = `${i}: `;
      row.appendChild(cell);
      i++;

      rowData.forEach((cellData) => {
        const cell = document.createElement("td");
        cell.textContent = cellData;
        row.appendChild(cell);
      });

      tableBody.appendChild(row);
    });

    table.appendChild(tableBody);

    // Adding caption
    const caption = document.createElement("caption");
    caption.textContent = captionText;
    table.appendChild(caption);

    return table;
  }

  //Do 1 step of Gale-Shapley
  function iterate() {
    gs.iterate();

    // Redraw lines
    const lines = document.querySelectorAll("line");
    lines.forEach((line, index) => {
      const match = gs.requesterMatch[index];
      if (match !== undefined) {
        line.setAttribute("x1", "0");
        line.setAttribute("y1", (20 + index * 40).toString());
        line.setAttribute("x2", "100");
        line.setAttribute("y2", (20 + match * 40).toString());
        line.style.stroke = "black"; // Make the line visible if match is defined
      } else {
        line.style.stroke = "none"; // Hide the line if match is undefined
      }
    });

    // Change cell colors in proposers table
    const proposersTable = document.querySelector("#table-container table");
    const proposersRows = proposersTable.querySelectorAll("tr");
    proposersRows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll("td");
      cells.forEach((cell, cellIndex) => {
        if (cellIndex === gs.proposerIndex[rowIndex]) {
          cell.style.backgroundColor = "yellow"; // Change cell color
        } else {
          cell.style.backgroundColor = ""; // Reset cell color
        }
      });
    });

    // Change cell colors in requesters table
    const requestersTable = document.querySelectorAll(
      "#table-container table"
    )[1];
    const requestersRows = requestersTable.querySelectorAll("tr");
    requestersRows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll("td");
      const matchIndex = gs.requesterMatch[rowIndex];
      cells.forEach((cell, cellIndex) => {
        if (
          matchIndex !== undefined &&
          cell.textContent.trim() === matchIndex.toString()
        ) {
          cell.style.backgroundColor = "yellow"; // Change cell color
        } else {
          cell.style.backgroundColor = ""; // Reset cell color
        }
      });
    });
  }

  //Randomize the tables and reset Gale-Shapley
  function reset() {
    gs.reset();

    // Reset lines
    const lines = document.querySelectorAll("line");
    lines.forEach((line) => {
      line.style.stroke = "";
    });

    // Update proposers table
    const proposersTable = document.querySelector("#table-container table");
    updateTable(
      proposersTable,
      "Proposers Preferences\n⟵Preferred",
      gs.proposers
    );

    // Update requesters table
    const requestersTable = document.querySelectorAll(
      "#table-container table"
    )[1];
    updateTable(
      requestersTable,
      "Requesters Preferences\n⟵Preferred",
      gs.requesters
    );
  }

  //This function is called by reset to change the numbers in the tables
  function updateTable(table, captionText, data) {
    const tableBody = table.querySelector("tbody");
    tableBody.innerHTML = "";

    let i = 0;

    data.forEach((rowData) => {
      const row = document.createElement("tr");

      const cell = document.createElement("td");
      cell.textContent = `${i}: `;
      row.appendChild(cell);
      i++;

      rowData.forEach((cellData) => {
        const cell = document.createElement("td");
        cell.textContent = cellData;
        row.appendChild(cell);
      });

      tableBody.appendChild(row);
    });

    // Update caption
    const caption = table.querySelector("caption");
    caption.textContent = captionText;
  }

  //CODE FOR MATCHING SIM VISUALS

  let malePercentage = 50;

  function updateCircles() {
    const numCircles = 100;
    const blueCircles = Math.round((malePercentage / 100) * numCircles);
    const redCircles = numCircles - blueCircles;

    const svgContainer = document.querySelector("#svgContainer");
    const circlesGroup = document.querySelector("#circlesGroup");
    const linesGroup = document.querySelector("#linesGroup");
    const circleRadius = 18;
    const circleSpacing = 60;
    const canvasWidth = parseInt(svgContainer.getAttribute("width"));
    const canvasHeight = parseInt(svgContainer.getAttribute("height"));
    const startX = (canvasWidth - 10 * circleSpacing) / 2;
    const startY = (canvasHeight - 10 * circleSpacing) / 2;

    // Clear previous content
    circlesGroup.innerHTML = "";
    linesGroup.innerHTML = "";

    // Define percentages for attractiveness
    const topPercentagePink = 0.25;
    const topPercentageBlue = 0.15;

    // Calculate the number of top circles for blue and pink colors
    const topBlueCircles = Math.round(topPercentageBlue * blueCircles);
    const topPinkCircles = Math.round(
      topPercentagePink * redCircles + blueCircles
    );

    // Create circles
    for (let i = 0; i < numCircles; i++) {
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      const x = startX + (i % 10) * circleSpacing;
      const y = startY + Math.floor(i / 10) * circleSpacing;
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("r", circleRadius);
      circle.setAttribute("fill", i < blueCircles ? "#7597E7" : "pink");
      circle.setAttribute("stroke", "none");
      circle.setAttribute("shape-rendering", "geometricPrecision");

      // Set attractiveness attribute
      let attractiveness;
      if (circle.getAttribute("fill") === "#7597E7") {
        attractiveness = i < topBlueCircles ? "top" : "average";
      } else {
        attractiveness = i < topPinkCircles ? "top" : "average";
      }
      circle.setAttribute("data-attractiveness", attractiveness);

      // Set stroke for top attractiveness circles
      if (attractiveness === "top") {
        circle.setAttribute("stroke", "black"); // Set outline color
        circle.setAttribute("stroke-width", "2"); // Set outline width
      }

      // Generate unique ID for the circle
      circle.setAttribute("id", "circle" + i);

      circlesGroup.appendChild(circle);
    }
  }

  function simulate() {
    const svgContainer = document.getElementById("svgContainer");
    const linesGroup = document.querySelector("#linesGroup");
    const blueCircles = document.querySelectorAll('circle[fill="#7597E7"]');
    const pinkCircles = document.querySelectorAll('circle[fill="pink"]');
    const totalLines = blueCircles.length * 10 + pinkCircles.length * 10; // Total number of lines to be drawn

    let linesDrawn = 0; // Counter to track the number of lines drawn

    // Group for text elements associated with blue circles
    const textGroupBlue = document.getElementById("textGroupBlue");

    // Group for text elements associated with pink circles
    const textGroupPink = document.getElementById("textGroupPink");

    // Function to draw lines with delay
    let averageLikesPink = 0;
    let averageLikesBlue = 0;
    let totalPinkLikes = 0;
    let totalBlueLikes = 0;
    // Define an object to keep track of likes for each circle
    const likesMap = {};

    let averageMatchesPink = 0;
    let averageMatchesBlue = 0;
    let totalMatches = 0;

    // Function to handle likes and check for matches
    function handleLike(fromCircle, toCircle) {
      // Check if the 'toCircle' exists in the likes of the 'fromCircle'
      if (likesMap[toCircle.id] && likesMap[toCircle.id].has(fromCircle.id)) {
        console.log("MATCH!");
        totalMatches++;
        averageMatchesBlue = totalMatches / blueCircles.length;
        averageMatchesPink = totalMatches / pinkCircles.length;
      }
      console.log(matchData);
    }

    // Modify the existing code inside the drawLinesWithDelay function to handle likes and matches
    function drawLinesWithDelay(circles, color, textGroup) {
      let delay = 0;
      circles.forEach((circle) => {
        setTimeout(() => {
          linesGroup.innerHTML = "";
          const x1 = parseInt(circle.getAttribute("cx"));
          const y1 = parseInt(circle.getAttribute("cy"));
          const targetCircles = color === "#7597E7" ? pinkCircles : blueCircles;
          const circlesAlreadyTargeted = new Set(); // Keep track of circles already targeted

          // Add the current circle to the likes map if it doesn't exist
          if (!likesMap[circle.id]) {
            likesMap[circle.id] = new Set();
          }

          for (let i = 0; i < 20; i++) {
            let randomIndex;
            do {
              randomIndex = Math.floor(Math.random() * targetCircles.length);
            } while (circlesAlreadyTargeted.has(randomIndex)); // Ensure the same circle is not targeted multiple times
            const targetCircle = targetCircles[randomIndex];
            circlesAlreadyTargeted.add(randomIndex); // Add the index to the set of targeted circles
            const x2 = parseInt(targetCircle.getAttribute("cx"));
            const y2 = parseInt(targetCircle.getAttribute("cy"));

            // Create line
            const line = createLine(
              x1,
              y1,
              x2,
              y2,
              color,
              targetCircle.getAttribute("data-attractiveness")
            );

            if (line.getAttribute("stroke") === "red") {
              // Increment like count for the target circle if the line is red
              let likeCount =
                parseInt(targetCircle.getAttribute("data-like-count")) || 0;
              likeCount++;
              targetCircle.setAttribute("data-like-count", likeCount);

              // Update average likes and total likes based on circle color
              if (color === "#7597E7") {
                totalPinkLikes++;
                averageLikesPink = totalPinkLikes / pinkCircles.length;
              } else {
                totalBlueLikes++;
                averageLikesBlue = totalBlueLikes / blueCircles.length;
              }
              // Add the liked circle to the likes map of the current circle
              likesMap[circle.id].add(targetCircle.id);

              // Check for a match
              handleLike(circle, targetCircle);

              updateAverages(
                averageLikesPink,
                averageLikesBlue,
                averageMatchesPink,
                averageMatchesBlue
              );
            }
            linesGroup.appendChild(line);
            linesDrawn++; // Increment the lines counter
          }

          // Check if all lines have been drawn
          if (linesDrawn === totalLines) {
            // Clear all lines after all drawing operations are complete
            // if we don't do this there is always one set of lines left
            setTimeout(() => {
              linesGroup.innerHTML = "";
            }, delay + 10); // Adjusted delay here
          }

          // Display like count on the target circles
          targetCircles.forEach((targetCircle) => {
            const likeCount =
              parseInt(targetCircle.getAttribute("data-like-count")) || 0;
            let textId = targetCircle.getAttribute("data-text-id"); // Get the ID of the existing text element

            if (textId) {
              const existingText = document.getElementById(textId);
              if (existingText && existingText.parentNode === textGroup) {
                existingText.remove();
              }
            }

            // Create new text element
            const yOffset = 30;

            // Create new text element
            const text = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "text"
            );
            text.setAttribute("x", parseInt(targetCircle.getAttribute("cx")));
            text.setAttribute(
              "y",
              parseInt(targetCircle.getAttribute("cy")) + yOffset
            ); // Add yOffset to move text below circle
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("alignment-baseline", "middle");
            text.setAttribute("font-size", "16px");
            text.textContent = likeCount;

            // Generate a unique ID for the text element and associate it with the circle
            textId = `text-${targetCircle.id}-${color}`;
            text.setAttribute("id", textId);
            targetCircle.setAttribute("data-text-id", textId);

            textGroup.appendChild(text); // Append text to text group
          });
        }, delay);
        delay += 10; // Adjust this value for the delay between each circle
      });
    }

    // Draw lines from blue circles to pink circles
    drawLinesWithDelay(blueCircles, "#7597E7", textGroupBlue);

    // Draw lines from pink circles to blue circles after all blue lines are drawn
    setTimeout(() => {
      drawLinesWithDelay(pinkCircles, "pink", textGroupPink);
    }, blueCircles.length * 10);
  }

  function createLine(x1, y1, x2, y2, fromColor, toAttractiveness) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);

    let redProbability;

    if (fromColor === "pink") {
      // Probability for drawing red line from pink to blue
      if (toAttractiveness === "top") {
        redProbability = 0.48; // Adjust probability for top attraction
      } else {
        redProbability = 0.0847; // Adjust probability for average attraction
      }
    } else if (fromColor === "#7597E7") {
      // Probability for drawing red line from blue to pink
      if (toAttractiveness === "top") {
        redProbability = 0.928; // Adjust probability for top attraction
      } else {
        redProbability = 0.3093; // Adjust probability for average attraction
      }
    }

    const isRed = Math.random() <= redProbability;
    const color = isRed ? "red" : "black";
    const opacity = isRed ? 0.7 : 0.6; // Adjust opacity values as needed

    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", "2");

    // Set the opacity based on color
    line.setAttribute("stroke-opacity", opacity);

    return line;
  }

  function createChart() {
    const svgWidth = 400; // Width of the SVG container
    const svgHeight = 300; // Height of the SVG container
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    // Select existing SVG element if it exists
    let svg = d3.select("#chart-container svg");

    // If SVG doesn't exist, create a new one
    if (svg.empty()) {
      svg = d3
        .select("#chart-container")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    } else {
      // Clear existing chart elements
      svg.selectAll("*").remove();
    }

    // Create scales
    xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.color))
      .range([0, width])
      .padding(0.1);
    yScale = d3.scaleLinear().domain([0, 45]).range([height, 0]); // Adjusted to go from 0 to 10

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    // Add Y axis
    svg.append("g").call(d3.axisLeft(yScale));

    // Add bars
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.color))
      .attr("y", (d) => yScale(d.averageLikes))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d.averageLikes))
      .attr("fill", (d) => d.color2)
      .each(function (d) {
        // Append text above bars
        svg
          .append("text")
          .attr("class", "bar-label")
          .attr("x", xScale(d.color) + xScale.bandwidth() / 2)
          .attr("y", yScale(d.averageLikes) - 5)
          .attr("text-anchor", "middle")
          .text(d.averageLikes);
      });
  }

  function createChartMatches() {
    const svgWidth = 400; // Width of the SVG container
    const svgHeight = 300; // Height of the SVG container
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    // Select existing SVG element if it exists
    let svg = d3.select("#chart-container2 svg");

    // If SVG doesn't exist, create a new one
    if (svg.empty()) {
      svg = d3
        .select("#chart-container2")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    } else {
      // Clear existing chart elements
      svg.selectAll("*").remove();
    }

    // Create scales
    xScale = d3
      .scaleBand()
      .domain(matchData.map((d) => d.color))
      .range([0, width])
      .padding(0.1);
    yScale = d3.scaleLinear().domain([0, 3]).range([height, 0]); // Adjusted to go from 0 to 10

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    // Add Y axis
    svg.append("g").call(d3.axisLeft(yScale));

    // Add bars
    svg
      .selectAll(".bar")
      .data(matchData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.color))
      .attr("y", (d) => yScale(d.averageMatches))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d.averageMatches))
      .attr("fill", (d) => d.color2)
      .each(function (d) {
        // Append text above bars
        svg
          .append("text")
          .attr("class", "bar-label")
          .attr("x", xScale(d.color) + xScale.bandwidth() / 2)
          .attr("y", yScale(d.averageMatches) - 5)
          .attr("text-anchor", "middle")
          .text(d.averageMatches);
      });
  }

  function updateChart() {
    // Create the new chart
    createChart();
    createChartMatches();
  }

  function updateAverages(
    averageLikesPink,
    averageLikesBlue,
    averageMatchesPink,
    averageMatchesBlue
  ) {
    data[0].averageLikes = averageLikesPink;
    data[1].averageLikes = averageLikesBlue;
    matchData[0].averageMatches = averageMatchesPink;
    matchData[1].averageMatches = averageMatchesBlue;
    updateChart();
  }
</script>

<main>
  <div class="banner">
    <h2>Why Dating Apps Suck</h2>
  </div>

  <div class="text">
    <p>
      Have you ever felt like you're stranded in a parched desert, thirsting for
      even a drop of attention on dating apps, while others seem to be swimming
      in an ocean of saltwater, overwhelmed by a flood of unsuitable suitors?
    </p>

    <p>
      For some, the well of potential matches runs dry, leaving them parched for
      even the slightest acknowledgment. Meanwhile, others find themselves
      drowning in an endless deluge of attention, though much of it proves to be
      anything but refreshing.
    </p>

    <p>
      In this website, we will show that even with minimal assumptions about the
      user base, the fundamental nature of these dating apps leads to many of
      their users suffering these very fates.
    </p>
  </div>

  <h2 class="reason-title">Reason 1: Too Many Men</h2>

  <div class="text">
    <p>
      In an ideal world a dating app would have a 50/50 ratio between the
      genders to maxmimize potential matches. Even if you had the abbility to
      perfectly pair up users into coupels with 100% succes, if 60% of your apps
      users are male and the other 40% female, then 20% of the overall userbase
      and 1/3 of men would be left unmatched. (For the the purposes of this
      website we will be talking about just hetrosexul monogemous couples)
    </p>

    <p>
      Sadly popular dating apps are actually much worse than even a 60-40 split:
    </p>

    <p></p>
    <table>
      <thead>
        <tr>
          <th>App</th>
          <th>Male (%)</th>
          <th>Female (%)</th>
          <th>Min Possible Unmatched (%)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Tinder</td>
          <td>78</td>
          <td>22</td>
          <td>56</td>
        </tr>
        <tr>
          <td>OKCupid</td>
          <td>74</td>
          <td>26</td>
          <td>48</td>
        </tr>
        <tr>
          <td>Bumble</td>
          <td>68</td>
          <td>32</td>
          <td>36</td>
        </tr>
        <tr>
          <td>Hinge</td>
          <td>65</td>
          <td>35</td>
          <td>30</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4" class="subscript"
            >*All statistics from the United States. **These stats are even
            worse in Europe, with tinder being 90% male</td
          >
        </tr>
      </tfoot>
    </table>

    <p>
      These minimum unmatched percentages are based on the asusmption that a
      dating app is able to create perfect pairs between all of it's user base,
      which is far from the truth. In reality users dedicate time to swipping on
      other users in the hopes of finding a match, and few of those matches turn
      into fullblown relationships
    </p>

    <p>
      So how do these gender desparitys effect the matches recived by the
      average user? We can aproximate the answer to this question by running a
      simulation. Lets assume for the sake of simplicity that we have 100 users
      and each user swipes on 10 people per day. For now we can also assume that
      users like other users 30% of the time (more on these exact statistics
      later).
    </p>
  </div>

  <table class="layout-table">
    <tr>
      <td>
        <div class="container">
          <svg id="svgContainer" width="700" height="700">
            <!-- Circles will be drawn here -->
            <g id="circlesGroup"></g>
            <!-- Lines will be drawn here -->
            <g id="linesGroup"></g>
            <!-- Text elements associated with blue circles -->
            <g id="textGroupBlue"></g>
            <!-- Text elements associated with pink circles -->
            <g id="textGroupPink"></g>
          </svg>
        </div>
      </td>
      <td>
        <div class="table-container">
          <table class="chart-table">
            <tr>
              <td>Average Likes</td>
              <td id="chart-container"></td>
            </tr>
            <tr>
              <td>Average Matches</td>
              <td id="chart-container2"></td>
            </tr>
          </table>
        </div>
      </td>
    </tr>
  </table>

  <div class="slider-container">
    <span class="slider-label">Percentage Male:</span>
    <input
      type="range"
      min="20"
      max="80"
      bind:value={malePercentage}
      class="slider"
      on:input={updateCircles}
    />
    <span>{malePercentage}%</span>
  </div>
  <button on:click={simulate}>Simulate</button>

  <h2 class="reason-title">Reason 2: Overload And Desperation</h2>

  <div class="text">
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vestibulum
      tellus non nunc condimentum, in rutrum metus aliquam. Donec vitae dolor ac
      magna aliquet vestibulum.
    </p>

    <p>
      Vivamus et enim ut lectus aliquam sodales. Integer sit amet tortor nec
      lectus congue congue. Ut ut tortor eget mauris venenatis aliquam.
    </p>
  </div>

  <h2 class="reason-title">Reason 3: Attractiveness</h2>

  <div class="text">
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vestibulum
      tellus non nunc condimentum, in rutrum metus aliquam. Donec vitae dolor ac
      magna aliquet vestibulum.
    </p>

    <p>
      Vivamus et enim ut lectus aliquam sodales. Integer sit amet tortor nec
      lectus congue congue. Ut ut tortor eget mauris venenatis aliquam.
    </p>
  </div>

  <h2 class="reason-title">Reason 4: The ELO System</h2>

  <div class="text">
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vestibulum
      tellus non nunc condimentum, in rutrum metus aliquam. Donec vitae dolor ac
      magna aliquet vestibulum.
    </p>

    <p>
      Vivamus et enim ut lectus aliquam sodales. Integer sit amet tortor nec
      lectus congue congue. Ut ut tortor eget mauris venenatis aliquam.
    </p>
  </div>

  <h2 class="reason-title">The Math Behind Optimal Matchmaking</h2>

  <div class="text">
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vestibulum
      tellus non nunc condimentum, in rutrum metus aliquam. Donec vitae dolor ac
      magna aliquet vestibulum.
    </p>

    <p>
      Vivamus et enim ut lectus aliquam sodales. Integer sit amet tortor nec
      lectus congue congue. Ut ut tortor eget mauris venenatis aliquam.
    </p>
  </div>

  <div class="text">
    <b
      >For graders, this is a visulization we are working on of the Gale-Shapley
      algorithm, we will make simpler visulizations to work up to this but this
      is the rough draft of the final more complicated one (it may not make much
      sense if you are not familiar with the algorithm, which is why we want to
      work up to it, and probably add more labels to this one)</b
    >
  </div>

  <div
    id="container"
    style="display: flex; justify-content: center; align-items: center;"
  >
    <div id="table-container">
      <button on:click={iterate}>Iterate</button>
      <button on:click={reset}>Generate Random Preferences</button>

      <!-- SVG for circles and lines -->
      <svg width="300" height="300">
        <!-- Circles for proposers -->
        <g transform="translate(50, 0)">
          <circle cx="0" cy="20" r="10" fill="dark blue" />
          <circle cx="0" cy="60" r="10" fill="dark blue" />
          <circle cx="0" cy="100" r="10" fill="dark blue" />
          <circle cx="0" cy="140" r="10" fill="dark blue" />
          <circle cx="0" cy="180" r="10" fill="dark blue" />
          <circle cx="0" cy="220" r="10" fill="dark blue" />
          <circle cx="0" cy="260" r="10" fill="dark blue" />
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
              <line
                x1="0"
                y1={20 + index * 40}
                x2="100"
                y2={20 + match * 40}
                stroke="black"
              />
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
  .banner {
    background-color: #a74b62;
    color: #ffe1e8;
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
    color: #a74b62;
  }

  table {
    border-collapse: collapse;
    width: 50%;
    margin: 0 auto;
  }
  th,
  td {
    border: 1px solid black;
    padding: 8px;
    text-align: center;
  }

  #table-container {
    margin: 20px auto;
    width: 50%;
  }

  .container {
    display: inline-block;
    vertical-align: top;
    justify-content: center;
    align-items: center;
    margin-bottom: -80px;
    margin-top: -20px;
  }
  .slider-container {
    display: flex;
    align-items: center;
    margin-top: -30px;
  }
  .slider-label {
    margin-right: 10px;
  }
  .slider {
    width: 550px;
  }

  .chart-table,
  .chart-table tr,
  .chart-table td {
    border: none;
    border-collapse: collapse;
  }

  .table-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* Align items at the start of the container */
    margin-top: 100px;
  }

  .layout-table {
    width: 100%;
    border-collapse: collapse; /* Merge the borders of cells */
    border-color: transparent; /* Set border color to transparent */
  }

  .layout-table td {
    border: none; /* Remove borders from table cells */
  }
</style>
