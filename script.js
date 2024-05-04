const ipForm = document.getElementById("ip-port-form");
const ipInput = document.getElementById("ip");
const portInput = document.getElementById("port");
const responseDiv = document.getElementById("response");

ipForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const ip = ipInput.value;
  const port = portInput.value;

  const data = {
    dest: ip,
    port: port,
  };

  try {
    const response = await fetch(
      "https://ux5jcd4wbc.execute-api.eu-central-1.amazonaws.com/v1/api/anycast",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    const responseData = await response.json();

    const successDiv = document.createElement("div");
    successDiv.classList.add("success");

    if (responseData.success) {
      const { dest, port, anycast } = responseData.result;
      successDiv.innerHTML = `<b>Destination:</b> ${dest}`;

      // Highlight Anycast status
      const anycastSpan = document.createElement("span");
      anycastSpan.classList.add("anycast");
      anycastSpan.textContent = anycast ? " (Anycast)" : " (Not anycast)";
      successDiv.appendChild(anycastSpan);

      const detailsContainer = document.createElement("div");
      detailsContainer.classList.add("details-container");

      if (responseData.result.details) {
        responseData.result.details.forEach((details) => {
          const detailsDiv = document.createElement("div");
          detailsDiv.innerHTML = `<h3>Connection Details</h3>`;
          detailsDiv.classList.add("details");
          const detailItem = document.createElement("p");
          detailItem.innerHTML = `This: ${details.this.toFixed(
            2,
          )} ms<br>Remote: ${details.remote.toFixed(
            2,
          )} ms<br>Theoretical Latency: ${details.theortical_latency.toFixed(
            2,
          )} ms<br>Port: ${port}`;
          detailsDiv.appendChild(detailItem);
          detailsContainer.appendChild(detailsDiv);
        });
      } else {
        detailsContainer.textContent =
          "No details available for this destination.";
      }

      successDiv.appendChild(detailsContainer);
      responseDiv.appendChild(successDiv);
    } else {
      successDiv.textContent =
        responseData.message || responseData.err || "Error: Unknown response.";
      responseDiv.appendChild(successDiv);
    }
  } catch (error) {
    console.error(error);
    responseDiv.textContent = "Error: Something went wrong.";
  }
});
