const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("sendLocation", { latitude, longitude });
    },
    (error) => {
      console.log(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}

const map = L.map("map").setView([0, 0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; Nikhil Tyagi",
}).addTo(map);

const marker = {};
socket.on("receiveLocation", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude], 10);
  if (!marker[id]) {
    marker[id] = L.marker([latitude, longitude]).addTo(map);
  }
  marker[id].setLatLng([latitude, longitude]);
});
socket.on("user-disconnected", (id) => {
  if (marker[id]) map.removeLayer(marker[id]);
  delete marker[id];
});
