// Import Web3.js
let web3;
let contract;

// Smart Contract Information
const CONTRACT_ADDRESS = "0xF6c91F31Ec574aB03302EA35f00697f76c813b7C"; // Replace with your deployed contract address
const CONTRACT_ABI = [ {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "completed",
        "type": "bool"
      }
    ],
    "name": "TaskCompleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "content",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "completed",
        "type": "bool"
      }
    ],
    "name": "TaskCreated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "taskCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "tasks",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "content",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "completed",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_content",
        "type": "string"
      }
    ],
    "name": "createTask",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "toggleCompleted",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  } ]; // Replace with your contract's ABI

// Initialize Web3 and connect to MetaMask
async function initialize() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            // Request MetaMask account access
            await ethereum.request({ method: 'eth_requestAccounts' });
            console.log("MetaMask connected");

            // Get the first account
            const accounts = await web3.eth.getAccounts();
            console.log("Connected account:", accounts[0]);

            // Load the smart contract
            contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
            console.log("Contract loaded:", contract);

            // Display connected account on UI
            document.getElementById("account").innerText = `Connected Account: ${accounts[0]}`;
        } catch (error) {
            console.error("Error connecting to MetaMask:", error);
        }
    } else {
        alert("MetaMask is not installed! Please install it to use this DApp.");
    }
}

// Add a new task to the smart contract
// Add a new task to the smart contract
async function initialize() {
  if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
          // Request MetaMask account access
          await ethereum.request({ method: 'eth_requestAccounts' });
          console.log("MetaMask connected");

          // Get the first account
          const accounts = await web3.eth.getAccounts();
          console.log("Connected account:", accounts[0]);

          // Load the smart contract
          contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
          console.log("Contract loaded:", contract);

          // Display connected account on UI
          document.getElementById("account").innerText = `Connected Account: ${accounts[0]}`;
      } catch (error) {
          console.error("Error connecting to MetaMask:", error);
      }
  } else {
      alert("MetaMask is not installed! Please install it to use this DApp.");
  }
}

// Add a new task to the smart contract
async function addTask() {
  const taskInput = document.getElementById("taskInput").value;
  if (!taskInput) {
      alert("Task cannot be empty!");
      return;
  }

  try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.createTask(taskInput).send({ from: accounts[0] });
      alert("Task added successfully!");
      loadTasks(); // Refresh the task list
  } catch (error) {
      console.error("Error adding task:", error);
  }
}

// Toggle task completion in the smart contract
async function toggleCompletion(taskId) {
  try {
      const accounts = await web3.eth.getAccounts();
      // Call the toggleCompleted function from the smart contract
      await contract.methods.toggleCompleted(taskId).send({ from: accounts[0] });
      alert(`Task ${taskId} toggled successfully!`);
      loadTasks(); // Refresh the task list after toggling completion
  } catch (error) {
      console.error("Error toggling task completion:", error);
  }
}

// Load all tasks from the contract
async function loadTasks() {
  try {
      // Get the number of tasks
      const taskCount = await contract.methods.taskCount().call();
      const taskList = document.getElementById("taskList");
      taskList.innerHTML = ""; // Clear the list

      // Loop through tasks
      for (let i = 1; i <= taskCount; i++) {
          const task = await contract.methods.tasks(i).call();
          const listItem = document.createElement("li");

          // Display task information
          listItem.innerHTML = `
              ${task.id}. ${task.content} - ${task.completed ? "Completed" : "Incomplete"}
              <button onclick="toggleCompletion(${task.id})">
                  ${task.completed ? "Mark Incomplete" : "Mark Completed"}
              </button>
          `;
          taskList.appendChild(listItem);
      }
  } catch (error) {
      console.error("Error loading tasks:", error);
  }
}

// Connect MetaMask when the page loads
window.onload = initialize;