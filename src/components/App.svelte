<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";

  let slider1;
  let slider2;
  let slider3;
  let slider4;
  let slider5;
  let slider6;
  let slider7;

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
    updateCircles(1);

    createChart(1);
    createChart(1);
    createChartMatches(1);
    createChartMatches(1);

    updateCircles(2);

    createChart(2);
    createChart(2);
    createChartMatches(2);
    createChartMatches(2);

    updateCircles(3);

    createChart(3);
    createChart(3);
    createChartMatches(3);
    createChartMatches(3);

    updateCircles(4);

    createChart(4);
    createChart(4);
    createChartMatches(4);
    createChartMatches(4);
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

  let malePercentage = [50, 50, 50, 65, 65];
  let simulationRunning = [false, false, false, false, false];
  let mTopLikeRate = [1, 0.3, 0.3, 46, 46];
  let mAverageLikeRate = [1, 0.3, 0.3, 46, 46];
  let wToplikeRate = [1, 0.3, 0.3, 14, 14];
  let wAverageLikeRate = [1, 0.3, 0.3, 14, 14];
  function updateCircles(instanceNumber) {
    const numCircles = 100;
    const blueCircles = Math.round(
      (malePercentage[instanceNumber] / 100) * numCircles
    );
    const redCircles = numCircles - blueCircles;

    const svgContainers = document.querySelectorAll(
      ".layout-table .container svg"
    );
    const circlesGroups = document.querySelectorAll(
      ".layout-table #circlesGroup"
    );
    const linesGroups = document.querySelectorAll(".layout-table #linesGroup");
    const circleRadius = 18;
    const circleSpacing = 60;

    // Ensure instanceNumber is within valid range
    if (instanceNumber < 1 || instanceNumber > svgContainers.length) {
      console.error("Invalid instance number provided.");
      return;
    }

    const svgContainer = svgContainers[instanceNumber - 1];
    const circlesGroup = circlesGroups[instanceNumber - 1];
    const linesGroup = linesGroups[instanceNumber - 1];
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
      if (instanceNumber > 3) {
        if (attractiveness === "top") {
          circle.setAttribute("stroke", "black"); // Set outline color
          circle.setAttribute("stroke-width", "2"); // Set outline width
        }
      }

      // Generate unique ID for the circle
      circle.setAttribute("id", "circle" + i);

      circlesGroup.appendChild(circle);
    }
  }

  function simulate(
    index,
    ptbt,
    ptba,
    btpt,
    btpa,
    fast = false,
    elementsToDisable = []
  ) {
    if (simulationRunning[index - 1]) {
      return; // If simulation is already running, return early
    }
    simulationRunning[index - 1] = true;

    elementsToDisable.forEach((element) => {
      element.disabled = true;
    });

    let waitTime = 100;
    if (fast === true) {
      waitTime = 15;
    }

    const containers = document.querySelectorAll(".layout-table");
    const container = containers[index - 1]; // Adjusting for 1-based indexing

    const svgContainer = container.querySelector(".container svg");
    const linesGroup = container.querySelector("#linesGroup");
    const blueCircles = container.querySelectorAll('circle[fill="#7597E7"]');
    const pinkCircles = container.querySelectorAll('circle[fill="pink"]');
    const totalLines = blueCircles.length * 20 + pinkCircles.length * 20; // Total number of lines to be drawn
    let linesDrawn = 0; // Counter to track the number of lines drawn

    // Group for text elements associated with blue circles
    const textGroupBlue = container.querySelector("#textGroupBlue");
    textGroupBlue.innerHTML = "";

    // Group for text elements associated with pink circles
    const textGroupPink = container.querySelector("#textGroupPink");
    textGroupPink.innerHTML = "";

    blueCircles.forEach((targetCircle) => {
      targetCircle.setAttribute("data-like-count", "0");
    });
    pinkCircles.forEach((targetCircle) => {
      targetCircle.setAttribute("data-like-count", "0");
    });

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
        totalMatches++;
        averageMatchesBlue = totalMatches / blueCircles.length;
        averageMatchesPink = totalMatches / pinkCircles.length;
      }
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

          //console.log(textGroupBlue.querySelectorAll("text").length);

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
              targetCircle.getAttribute("data-attractiveness"),
              ptbt,
              ptba,
              btpt,
              btpa
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
                averageMatchesBlue,
                index
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
              simulationRunning[index - 1] = false;
              elementsToDisable.forEach((element) => {
                element.disabled = false;
              });
            }, waitTime); // Adjusted delay here
          }

          // Display like count on the target circles
          targetCircles.forEach((targetCircle) => {
            const likeCount =
              parseInt(targetCircle.getAttribute("data-like-count")) || 0;
            let textId = targetCircle.getAttribute("data-text-id"); // Get the ID of the existing text element

            if (textId) {
              // Get the existing text element within the specific container
              const existingText = container.querySelector(`[id="${textId}"]`);
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
        delay += waitTime; // Adjust this value for the delay between each circle
      });
    }

    // Draw lines from blue circles to pink circles
    drawLinesWithDelay(blueCircles, "#7597E7", textGroupBlue);

    // Draw lines from pink circles to blue circles after all blue lines are drawn
    setTimeout(() => {
      drawLinesWithDelay(pinkCircles, "pink", textGroupPink);
    }, blueCircles.length * waitTime);
  }

  function createLine(
    x1,
    y1,
    x2,
    y2,
    fromColor,
    toAttractiveness,
    ptbt,
    ptba,
    btpt,
    btpa
  ) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);

    let redProbability;

    if (fromColor === "pink") {
      // Probability for drawing red line from pink to blue
      if (toAttractiveness === "top") {
        redProbability = ptbt; // Adjust probability for top attraction
      } else {
        redProbability = ptba; // Adjust probability for average attraction
      }
    } else if (fromColor === "#7597E7") {
      // Probability for drawing red line from blue to pink
      if (toAttractiveness === "top") {
        redProbability = btpt; // Adjust probability for top attraction
      } else {
        redProbability = btpa; // Adjust probability for average attraction
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

  function createChart(index) {
    const containers = document.querySelectorAll(".layout-table");
    const container = containers[index - 1]; // Adjusting for 1-based indexing

    const svgWidth = 400; // Width of the SVG container
    const svgHeight = 300; // Height of the SVG container
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    // Select existing SVG element if it exists
    let svg = d3.select(container.querySelector("#chart-container svg"));

    // If SVG doesn't exist, create a new one
    if (svg.empty()) {
      svg = d3
        .select(container.querySelector("#chart-container"))
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
    yScale = d3.scaleLinear().domain([0, 55]).range([height, 0]); // Adjusted to go from 0 to 10

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
          .text(d.averageLikes.toFixed(2));
      });
  }

  function createChartMatches(index) {
    const containers = document.querySelectorAll(".layout-table");
    const container = containers[index - 1]; // Adjusting for 1-based indexing

    const svgWidth = 400; // Width of the SVG container
    const svgHeight = 300; // Height of the SVG container
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    // Select existing SVG element if it exists
    let svg = d3.select(container.querySelector("#chart-container2 svg"));

    // If SVG doesn't exist, create a new one
    if (svg.empty()) {
      svg = d3
        .select(container.querySelector("#chart-container2"))
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
    yScale = d3.scaleLinear().domain([0, 9]).range([height, 0]); // Adjusted to go from 0 to 10

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
          .text(d.averageMatches.toFixed(2));
      });
  }

  function updateChart(index) {
    //Update the charts
    createChart(index);
    createChartMatches(index);
  }

  function updateAverages(
    averageLikesPink,
    averageLikesBlue,
    averageMatchesPink,
    averageMatchesBlue,
    index
  ) {
    data[0].averageLikes = averageLikesPink;
    data[1].averageLikes = averageLikesBlue;
    matchData[0].averageMatches = averageMatchesPink;
    matchData[1].averageMatches = averageMatchesBlue;
    updateChart(index);
  }
</script>

<main>
  <div class="banner">
    <h2>Why Dating Apps Suck</h2>
  </div>

  <div class="text">
    <p>
      Imagine this: a man stranded in a desert. He desperately searches for
      water- crossing far and wide. No matter how far he travels, all he finds
      is sand, the endless desert almost mocking him. He trudges on with the
      hope of salvation- a promised oasis, whispered of in his fevered dreams
      and glimpsed upon in the cruel mirages of the desert. He grows weaker,
      every motion he makes becoming heavier as the futility of his mission
      chips away at his very being.
    </p>

    <p>
      Now imagine a woman lost at sea- she is at the mercy of the unrelenting
      waves, the horizon taunting her. She won’t last long at this rate, she
      needs water. The water surrounding her calls to her, like a siren drawing
      in men at sea, promising to fulfill her needs and save her. She resists,
      knowing that deep in her soul the water is but a toxic concoction of the
      elements that would only bring forth more thirst.
    </p>

    <p>
      Both of these scenarios are opposites, but the same problem remains: they
      want water, yet they can not get it. The man for lack of any water around,
      and the woman surrounded by water that is undrinkable. Both the man and
      the women lay awake at night and wonder:
    </p>
  </div>

  <h2 class="reason-title">Why Are Dating Apps So Bad?</h2>

  <div class="text">
    <p>
      In this website, we will use statistics and simulation to investigate how
      both men and women generally have a bad experience with dating apps.
      Taking things one statistic at a time we will move from an idealistic
      simulation to something closely resembling the modern dating app today for
      real users.
    </p>

    <p>
      A quick disclaimer before we get into things, here we only focus on
      heterosexual relationships due to it being what most available data is on.
    </p>

    <p>
      Let's start with a simple unmodified simulation, if you press the simulate
      button below you will be able to see the users of our simulated dating app
      swiping on each other one at a time. Each user will swipe on 20 random
      users of the opposite gender liking 30% of them, a red line indicating a
      like. Underneath each user you will see the total number of likes they
      have received displayed as text. Try hitting the simulate button now to
      check it out.
    </p>
  </div>

  <div style="display: flex; justify-content: center;">
    <div
      style="position: relative; z-index: 1; margin-bottom: -50px; text-align: center;"
    >
      <button
        style="padding: 10px 20px; font-size: 16px;"
        on:click={() => simulate(1, 0.3, 0.3, 0.3, 0.3)}>Simulate</button
      >
    </div>
    <div
      style="position: relative; z-index: 1; margin-bottom: -50px; text-align: center;"
    >
      <button
        style="padding: 10px 20px; font-size: 16px;"
        on:click={() => simulate(1, 0.3, 0.3, 0.3, 0.3, true)}
        >Fast Simulate</button
      >
    </div>
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

  <div class="text">
    <p>
      You should see that men and women get roughly the same average number of
      likes, plus or minus some random variance, and exactly the same number of
      average matches. Now that you understand the simulation let's get to
      showing the common ways these numbers get skewed.
    </p>
  </div>

  <h2 class="reason-title">
    Reason 1: There Are Plenty Of Fish In the Sea, But Most Of Them Are Men
  </h2>

  <div class="text">
    <p>
      Let's start by assuming that we are in a perfect world where we have an
      algorithm that is able to exactly pair all of our users into ideal
      matches. If we have 50 men and 50 women everything is golden, just use our
      magic algorithm and call it a day. But what if we have 60 men and 40
      women? We can pair the 40 women with 40 of the men, but afterwards we
      would still have 20 men left over. No matter what we do there is no way to
      leave this scenario with everyone in a happy relationship, even with the
      most perfect possible algorithm.
    </p>

    <p>
      (This is of course assuming monogamy, if you are down for polyamory then
      you can work with any gender ratio you want)
    </p>

    <p>
      Unfortunately most, if not all, mainstream dating apps have a much worse
      gender ratio than the hypothetical 60:40 we just discussed. In this table
      we display a few popular dating apps, as well as their percentage of men
      and women, and the “min possible unmatched %” which is the percentage of
      people that would be left unmatched assuming a perfect pairing algorithm.
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
      Of course we do not actually have a perfect pairing algorithm. In
      actuality, each user will swipe on many other users liking a small portion
      of them, and users will only be matched if they like each other mutually.
      Even after matching, chances of that match developing into a full blown
      relationship is low.
    </p>

    <p>
      So how do these gender disparities affect the likes and matches received
      by the average user? Explore the answer in the simulation below. It is the
      same as the one above, but this time you are given access to a slider that
      changes the gender ratio of the app. Try running simulations with the
      ratios from some of the common apps, or any other ratio you want to give a
      try.
    </p>
  </div>

  <div style="display: flex; justify-content: center;">
    <div
      style="position: relative; z-index: 1; margin-bottom: -50px; text-align: center;"
    >
      <button
        style="padding: 10px 20px; font-size: 16px;"
        on:click={() => simulate(2, 0.3, 0.3, 0.3, 0.3, false, [slider1])}
        >Simulate</button
      >
    </div>
    <div
      style="position: relative; z-index: 1; margin-bottom: -50px; text-align: center;"
    >
      <button
        style="padding: 10px 20px; font-size: 16px;"
        on:click={() => simulate(2, 0.3, 0.3, 0.3, 0.3, true, [slider1])}
        >Fast Simulate</button
      >
    </div>
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

  <div class="sliders-wrapper">
    <div class="slider-container">
      <span class="slider-label">Percentage Male:</span>
      <input
        type="range"
        min="20"
        max="80"
        bind:value={malePercentage[2]}
        bind:this={slider1}
        class="slider"
        on:input={() => updateCircles(2)}
      />
      <span>{malePercentage[2]}%</span>
    </div>
  </div>

  <div class="text">
    <p>
      You will likely notice that unlike before, the average matches are not
      exactly the same, for a match to exist, one man and one woman need to like
      each other, meaning the total number of matches is the same for each
      gender. For example, if 40 matches happen then the total matches for men
      and women must both be 40. However, if there are 80 men and 20 women, then
      the average woman will have 2 matches and the average man just ½ a match,
      since those matches are distributed over different numbers of people.
    </p>

    <p>
      The second thing to notice is that we are already seeing some decent skew
      in terms of average likes. Even using Hinge’s ratio of 65% male, which is
      the best of the ones listed, we see that women on average receive over 3x
      as many likes as men.
    </p>
  </div>

  <h2 class="reason-title">Reason 2: Overload And Desperation</h2>

  <div class="text">
    <p>
      Some articles claim women tend to be more selective due to many men
      lacking essential emotional and communicative skills needed to build a
      relationship, such as <a
        href="https://www.psychologytoday.com/ca/blog/the-state-our-unions/202208/whats-behind-the-rise-lonely-single-men"
        target="_blank">this article</a
      > from Psychology Today on what is behind the rise of lonely single men.
    </p>

    <p>
      Some claim it is due to the fact that culturally men are pursuers and
      women are the pursued, one study found that when the roles are reversed,
      men get much pickier and women much less picky, you can read more at <a
        href="https://www.smithsonianmag.com/smart-news/men-are-just-as-picky-as-women-about-who-theyd-dateif-theyre-the-ones-being-pursued-180947850/"
        target="_blank">this article</a
      > from the Smithsonian Magazine.
    </p>

    <p>
      Others claim it is just a matter of evolution, since choosing a partner
      has higher stakes for women, who are capped at having 1 child every 9
      months, and are likely to be expected to dedicate a great amount of
      resources to raising that child, such as <a
        href="https://www.independent.co.uk/life-style/love-sex/women-men-dating-websites-picky-australia-study-a8418886.html"
        target="_blank">this Independent article</a
      > discussing an Australian study.
    </p>

    <p>
      Whatever you believe, on dating apps there is an overwhelming number of
      men. This means that women are incentivized to be selective about who they
      like, since liking too often would result in getting bombarded with too
      many men to feasibly chat with. Men on the other hand as the majority get
      much less attention, and are thus incentivized to cast as wide of a net as
      possible in order to have a chance of getting a match.
    </p>

    <p>
      When we look at the actual numbers we see that whatever the cause is, men
      like women's profiles on average about 46% of the time, and women like
      men's profiles on average 14% of the time. How does this affect our
      simulation? Try running it to find out, and feel free to play with the
      sliders to further explore how different like rates can change the
      distributions, or how they work in tandem with different gender ratios.
    </p>
  </div>

  <div style="display: flex; justify-content: center;">
    <div
      style="position: relative; z-index: 1; margin-bottom: -50px; text-align: center;"
    >
      <button
        style="padding: 10px 20px; font-size: 16px;"
        on:click={() =>
          simulate(
            3,
            wAverageLikeRate[3] / 100,
            wAverageLikeRate[3] / 100,
            mAverageLikeRate[3] / 100,
            mAverageLikeRate[3] / 100,
            false,
            [slider2, slider3, slider4]
          )}>Simulate</button
      >
    </div>
    <div
      style="position: relative; z-index: 1; margin-bottom: -50px; text-align: center;"
    >
      <button
        style="padding: 10px 20px; font-size: 16px;"
        on:click={() =>
          simulate(
            3,
            wAverageLikeRate[3] / 100,
            wAverageLikeRate[3] / 100,
            mAverageLikeRate[3] / 100,
            mAverageLikeRate[3] / 100,
            true,
            [slider2, slider3, slider4]
          )}>Fast Simulate</button
      >
    </div>
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

  <div class="sliders-wrapper">
    <div class="slider-container">
      <span class="slider-label">Percentage Male:</span>
      <input
        type="range"
        min="20"
        max="80"
        bind:value={malePercentage[3]}
        bind:this={slider2}
        class="slider"
        on:input={() => updateCircles(3)}
      />
      <span>{malePercentage[3]}%</span>
    </div>
  </div>
  <div class="sliders-wrapper" style="margin-top: 20px;">
    <div class="slider-container">
      <span class="slider-label">Like Rate of Men:</span>
      <input
        type="range"
        min="0"
        max="60"
        bind:value={mAverageLikeRate[3]}
        bind:this={slider3}
        class="slider"
      />
      <span>{mAverageLikeRate[3]}%</span>
    </div>
  </div>
  <div class="sliders-wrapper" style="margin-top: 20px;">
    <div class="slider-container">
      <span class="slider-label">Like Rate of Women:</span>
      <input
        type="range"
        min="0"
        max="60"
        bind:value={wAverageLikeRate[3]}
        bind:this={slider4}
        class="slider"
      />
      <span>{wAverageLikeRate[3]}%</span>
    </div>
  </div>

  <div class="text">
    <p>
      Notice how using the same Hinge ratio of 65% male, women now receive
      roughly 11x as many likes as men, and the average number of matches has
      gone down for both genders compared to when we were using the 30% like
      rate across the board.
    </p>

    <p>
      But this has all been assuming everyone has an equal chance of being
      liked, what happens when we account for the fact that some profiles are on
      average more desirable than others?
    </p>
  </div>

  <h2 class="reason-title">Reason 3: Attractiveness</h2>

  <div class="text">
    <p>
      According to Hinge’s now deleted blog post, the top 25% of women receive
      half of all likes that go to women, and the top 15% of men receive half of
      all likes that go to men. This makes sense as an intuitive next step for
      reason 2, women have higher standards: therefore they tend to go for more
      desirable men. So once again let's simulate the effect of this. Here we
      have marked the top 15% of men and 25% of women with black outlines, and
      adjusted the like rates such that the averages stay the same, but half of
      the likes go to the top of their respective gender. Try comparing it with
      the simulation from reason 2 and seeing what changes.
    </p>
  </div>

  <div style="display: flex; justify-content: center;">
    <div
      style="position: relative; z-index: 1; margin-bottom: -50px; text-align: center;"
    >
      <button
        style="padding: 10px 20px; font-size: 16px;"
        on:click={() =>
          simulate(
            4,
            wAverageLikeRate[4] / 30,
            wAverageLikeRate[4] / 170,
            mAverageLikeRate[4] / 50,
            mAverageLikeRate[4] / 150,
            false,
            [slider5, slider6, slider7]
          )}>Simulate</button
      >
    </div>
    <div
      style="position: relative; z-index: 1; margin-bottom: -50px; text-align: center;"
    >
      <button
        style="padding: 10px 20px; font-size: 16px;"
        on:click={() =>
          simulate(
            4,
            wAverageLikeRate[4] / 30,
            wAverageLikeRate[4] / 170,
            mAverageLikeRate[4] / 50,
            mAverageLikeRate[4] / 150,
            true,
            [slider5, slider6, slider7]
          )}>Fast Simulate</button
      >
    </div>
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

  <div class="sliders-wrapper">
    <div class="slider-container">
      <span class="slider-label">Percentage Male:</span>
      <input
        type="range"
        min="20"
        max="80"
        bind:value={malePercentage[4]}
        bind:this={slider5}
        class="slider"
        on:input={() => updateCircles(4)}
      />
      <span>{malePercentage[4]}%</span>
    </div>
  </div>
  <div class="sliders-wrapper" style="margin-top: 20px;">
    <div class="slider-container">
      <span class="slider-label">Like Rate of Men:</span>
      <input
        type="range"
        min="0"
        max="60"
        bind:value={mAverageLikeRate[4]}
        bind:this={slider6}
        class="slider"
      />
      <span>{mAverageLikeRate[4]}%</span>
    </div>
  </div>
  <div class="sliders-wrapper" style="margin-top: 20px;">
    <div class="slider-container">
      <span class="slider-label">Like Rate of Women:</span>
      <input
        type="range"
        min="0"
        max="60"
        bind:value={wAverageLikeRate[4]}
        bind:this={slider7}
        class="slider"
      />
      <span>{wAverageLikeRate[4]}%</span>
    </div>
  </div>

  <div class="text">
    <p>
      Looking at the graphs alone it may look like not much has changed, but
      paying closer attention to the like counts underneath the circles reveals
      a different story. Notice that using the 65% male, 46% male like rate, 14%
      female like rate stats from before, top men receive a little over 5x as
      many likes as average men, whereas top women receive around 3x as many
      likes as average women. We see that top women receive over 30x as many
      likes as average men.
    </p>

    <p>
      It is worth noting that here we assumed everyone was either “top” or
      “average” when in reality everyone is likely to exist somewhere on a
      gradient between extremely desirable and extremely not desirable, but
      since we have no stats aside from that hinge blog post we can only
      speculate on how people are distributed over said gradient.
    </p>
  </div>

  <h2 class="reason-title">Conclusion</h2>
  <div class="text">
    <p>Dating Apps Suck Because:</p>
    <ol>
      <li>Too Many Men</li>
      <li>Differences in like rates between genders</li>
      <li>
        You are not hot (or you are hot and you are getting swarmed by likes)
      </li>
    </ol>
  </div>

  <h2 class="reason-title">Sources</h2>

  <div class="text">
    <p>
      https://en.lab.appa.pe/2020-02/which-dating-apps-are-reigning-in-the-usa.html
    </p>

    <p>https://techreport.com/statistics/dating-apps-statistics/</p>

    <p>https://datingzest.com/tinder-statistics/</p>

    <p>
      https://www.statista.com/statistics/975984/us-bumble-user-ratio-gender/
    </p>

    <p>
      https://www.netimperative.com/2019/04/05/online-dating-trends-men-outnumber-women-on-tinder-by-9-to-1-while-grinder-wins-for-age-diversity/
    </p>

    <p>
      https://medium.com/fact-of-the-day-1/inequality-of-dating-app-likes-e8c0aaa0cf4e
    </p>

    <p>
      And a heavy source of inspiration:
      https://www.youtube.com/watch?v=x3lypVnJ0HM&t=431s
    </p>
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

  .container {
    display: inline-block;
    vertical-align: top;
    justify-content: center;
    align-items: center;
    margin-bottom: -80px;
    margin-top: -20px;
  }
  .sliders-wrapper {
    margin-top: -75px; /* Adjust margin-top value to shift the sliders up */
  }
  .slider-container {
    display: flex;
    align-items: center;
    margin-top: 10px; /* Adjust margin as necessary */
  }

  .slider-label {
    margin-right: 10px;
    min-width: 150px; /* Set a minimum width for the label */
  }

  .slider {
    width: calc(100% - 800px); /* Adjust width of the slider */
  }

  .chart-table,
  .chart-table tr,
  .chart-table td {
    border: none;
    border-collapse: collapse;
  }

  .chart-table {
    position: relative;
    top: -20px;
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
