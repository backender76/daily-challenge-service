/**
 * При запуске nodemon/tsc из .Dockerfile были проблемы с корректным завершением процесса. Поэтому
 * появился этот скрипт. Также в контейнер можно пробросить docker.sock и тут вызывать АПИ Docker-а,
 * например для получения ID контейнера, чтобы выполнять разный набор команд для разных контейнеров.
 */
const child_process = require("child_process");

(async () => {
  console.log("dev.js", process.env.HOSTNAME, process.argv);

  const buildWatch = "tsc -w --project backend/tsconfig.json";
  const startWatch = "nodemon --delay 1s -w backend backend/dist/main.js";
  const clear = "rm -rf backend/dist/*";
  const build = "tsc --project backend/tsconfig.json";

  let commands = [
    { command: buildWatch, name: "0" },
    { command: startWatch, name: "1" },
  ];
  console.log(await spawn(clear));
  console.log(await spawn(build));

  const concurrently = require("concurrently");
  const { result } = concurrently(commands, { killOthers: ["failure", "success"] });
  result.then(success, failure);

  function success(commands) {
    console.log("success:", JSON.stringify(map(commands)));
  }
  function failure(commands) {
    console.log("failure:", JSON.stringify(map(commands)));
  }
  function map(commands) {
    return commands.map((i) => ({
      command: i.command.command,
      killed: i.command.killed,
      exited: i.command.exited,
      state: i.command.state,
      exitCode: i.exitCode,
      killed: i.killed,
      index: i.index,
    }));
  }
})();

function spawn(command, options) {
  return new Promise(function (resolve, reject) {
    let result = "";

    const cmd = child_process.spawn(command, options, { shell: true });

    cmd.stdout.on("data", (data) => {
      result += String(data);
    });

    cmd.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    cmd.on("close", (code) => {
      code === 0 ? resolve(result) : reject({ code, result });
    });

    cmd.on("error", (error) => {
      console.error(`error: ${error}`);
    });
  });
}
