const ewelink = require("ewelink-api");
require("dotenv").config();

(async () => {
  const connection = new ewelink({
    email: process.env.email,
    password: process.env.password,
  });

  await connection.getCredentials();

  let count = 0;

  await connection.openWebSocket(async (data) => {
    if (count === 0) {
      console.log("Connection started!");
    }

    if (data.deviceid) {
      const status = await connection.getDevicePowerState(data.deviceid);

      if (
        status.error === 503 &&
        status.msg === "Service Temporarily Unavailable or Device is offline"
      ) {
        const device = await connection.getDevice(data.deviceid);
        console.log(device.name + " is offline!");
      } else {
        const device = await connection.getDevice(data.deviceid);
        console.log(
          device.name +
            ": " +
            "status: " +
            status.status +
            "  state: " +
            status.state
        );
      }
    }

    count = count + 1;
  });
})();
