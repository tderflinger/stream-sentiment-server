import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { StreamChat } from "stream-chat";
import { fromSSO } from "@aws-sdk/credential-provider-sso";
import {
  ComprehendClient,
  DetectSentimentCommand,
} from "@aws-sdk/client-comprehend";

const LANGUAGE_CODE = "en";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const comprehendClient = new ComprehendClient({
  region: process.env.AWS_REGION,
  credentials: fromSSO({ profile: process.env.AWS_PROFILE }),
});

const serverSideClient = new StreamChat(
  process.env.STREAM_API_KEY,
  process.env.STREAM_APP_SECRET
);

app.post("/sentiment", async (req, res) => {
  const { text } = req.body;
  const input = {
    Text: text,
    LanguageCode: LANGUAGE_CODE,
  };
  const command = new DetectSentimentCommand(input);
  const response = await comprehendClient.send(command);

  let emoji = "";

  switch (response?.Sentiment) {
    case "POSITIVE":
      emoji = "🌞";
      break;
    case "NEGATIVE":
      emoji = "😔";
      break;
    case "NEUTRAL":
      emoji = "😐";
      break;
    case "MIXED":
      emoji = "🌈";
      break;
  }

  const data = {
    text,
    sentiment: emoji,
  };
  res.json(data);
});

app.post("/join", async (req, res) => {
  const { username } = req.body;
  let token;

  try {
    token = serverSideClient.createToken(username);
    await serverSideClient.updateUser(
      {
        id: username,
        name: username,
      },
      token
    );

    const admin = { id: "admin" };
    const channel = serverSideClient.channel("messaging", "discuss", {
      name: "Discussion",
      created_by: admin,
    });

    await channel.create();
    await channel.addMembers([username, "admin"]);
  } catch (err) {
    console.log(err);
    return res.status(500).end();
  }

  return res
    .status(200)
    .json({ user: { username }, token, api_key: process.env.STREAM_API_KEY });
});

const server = app.listen(process.env.PORT || 5500, () => {
  const { port } = server.address();
  console.log(`Server running on PORT ${port}`);
});
