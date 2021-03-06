const aws_iot_device_sdk_v2_1 = require("aws-iot-device-sdk-v2");
const am = require('am')
const util_1 = require("util");

// Use MQTT
let certPath = './certs/device.pem.crt';
let keyPath = './certs/private.pem.key';
let caPath = './certs/Amazon-root-CA-1.pem';
let myDeviceEndpoint = 'a1jgrydl5depqs-ats.iot.ap-southeast-1.amazonaws.com';
let myCustomTopic = 'hieu/testTopic'
let myCustomPayload = {
  'IP': '192.168.10.1',
  'message_type': 'DEVICE_IP',
  'owner': 'Hieu dep try',
}
let myCountMessage = 10;

const __awaiter = function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

function execute_session(connection) {
  return __awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
      try {
        for (let op_idx = 0; op_idx < myCountMessage; ++op_idx) {
          const publish = () => __awaiter(this, void 0, void 0, function* () {
            const json = JSON.stringify(myCustomPayload);
            connection.publish(myCustomTopic, json, aws_iot_device_sdk_v2_1.mqtt.QoS.AtLeastOnce);
            console.log('Publish message ', op_idx)
          });
          setTimeout(publish, op_idx * 1000);
        }

        resolve();
      } catch (error) {
        reject(error);
      }
    }));
  });
}

function main() {
  return __awaiter(this, void 0, void 0, function* () {
    const client_bootstrap = new aws_iot_device_sdk_v2_1.io.ClientBootstrap();
    let config_builder = null;

    config_builder = aws_iot_device_sdk_v2_1.iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(certPath, keyPath);

    config_builder.with_clean_session(false);
    config_builder.with_client_id("test-" + Math.floor(Math.random() * 100000000));
    config_builder.with_endpoint(myDeviceEndpoint);
    // force node to wait 60 seconds before killing itself, promises do not keep node alive
    const timer = setTimeout(() => {
    }, 60 * 1000);
    const config = config_builder.build();
    const client = new aws_iot_device_sdk_v2_1.mqtt.MqttClient(client_bootstrap);
    const connection = client.new_connection(config);
    yield connection.connect();
    yield execute_session(connection);
    // Allow node to die if the promise above resolved
    clearTimeout(timer);
  });
}

// This is not a promise
main();