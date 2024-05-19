import c from "config";

function config() {
  if (!c.get("jwtPrivateKey")) 
    throw new Error("jwtPrivateKey environment value is not set");
}

export default config;
