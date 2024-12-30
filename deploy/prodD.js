import { execSync } from "child_process";

// Obtener la fecha y hora actual con JavaScript nativo
const date = new Date();
const dateTime = `${date.getDate().toString().padStart(2, "0")}/` +
  `${(date.getMonth() + 1).toString().padStart(2, "0")}/` +
  `${date.getFullYear()} ` +
  `${date.getHours().toString().padStart(2, "0")}:` +
  `${date.getMinutes().toString().padStart(2, "0")}:` +
  `${date.getSeconds().toString().padStart(2, "0")}`;

try {
  execSync(
    `cd ../p-frontend-cimsa-deploy && git checkout master && cp -r ../p-frontend-cimsa/dist/. ./ && git add . && git commit -m "Deploy: At date, ${dateTime}" && git push origin master --force`,
    { stdio: [0, 1, 2] }
  );
  console.log("Envio Correcto");
} catch (err) {
  console.log("Error desplegando", err);
}

