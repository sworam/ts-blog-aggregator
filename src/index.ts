import { setUser, readConfig } from "./config"
function main() {
    setUser("Marlo");
    const cfg = readConfig();
    console.log(cfg);
}

main();
