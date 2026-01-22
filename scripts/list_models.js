const dotenv = require("dotenv");
const path = require("path");

// Carrega o arquivo usando o caminho absoluto
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
console.log("Chave carregada:", API_KEY ? "Sim (Inicia com " + API_KEY.substring(0, 5) + ")" : "Não");

async function listModels() {
    if (!API_KEY) {
        console.error("API Key not found");
        return;
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
        );
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", data.error);
            return;
        }

        console.log("Available Models (v1beta):");
        data.models?.forEach(m => {
            console.log(`- ${m.name} (${m.displayName})`);
        });

        const responseV1 = await fetch(
            `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`
        );
        const dataV1 = await responseV1.json();
        console.log("\nAvailable Models (v1):");
        dataV1.models?.forEach(m => {
            console.log(`- ${m.name} (${m.displayName})`);
        });

    } catch (err) {
        console.error("Fetch Error:", err);
    }
}

listModels();
