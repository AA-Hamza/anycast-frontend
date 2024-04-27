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
    responseDiv.textContent = responseData.message; // Assuming the API response has a message property
  } catch (error) {
    console.error(error);
    responseDiv.textContent = "Error: Something went wrong.";
  }
});
