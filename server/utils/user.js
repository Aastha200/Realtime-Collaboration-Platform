const users = [];

// Function to add a user to the chat
const userJoin = (id, username, room, host, presenter) => {
  // Creating a user object with the provided parameters
  const user = { id, username, room, host, presenter };

  // Adding the user to the users array
  users.push(user);
  // Returning the user object
  return user;
};

// Function to remove a user from the chat
const userLeave = (id) => {
  // Finding the index of the user in the users array
  const index = users.findIndex((user) => user.id === id);

  // If the user is found, remove them from the users array
  if (index !== -1) {
    // The splice method modifies the array in place and returns a new array containing the elements that have been removed
    return users.splice(index, 1)[0];
  }
};

// Function to get all users in a room
const getUsers = (room) => {
  // Creating an empty array to store the users in the room
  const RoomUsers = [];
  // Looping through the users array
  users.map((user) => {
    // If the user is in the room, add them to the RoomUsers array
    if (user.room == room) {
      RoomUsers.push(user);
    }
  });

  // Returning the RoomUsers array
  return RoomUsers;
};

// Exporting the functions to be used in other files
module.exports = {
  userJoin,
  userLeave,
  getUsers,
};
