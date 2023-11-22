import React from "react";

import {
  Typography,
  Card,
  CardHeader,
  CardBody, Input, Avatar, IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import { AnimationMessage } from "@/widgets/cards"
import { Configuration, OpenAIApi } from 'openai';
import 'dotenv'


export function Chatbot() {


  const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  const configuration = new Configuration({
    apiKey: API_KEY,
  });

  console.log('API_KEY>>>', API_KEY);

  const openai = new OpenAIApi(configuration);

  const [question, setQuestion] = React.useState("")
  const [storedValues, setStoredValues] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleSubmit = async (e, t) => {
    e.preventDefault();
    if (!question) {
      alert("email required")
      return;
    }
    let options = {
      model: 'gpt-3.5-turbo',
      temperature: 0,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ['/'],
    };

    let completeOptions = {
      ...options,
      messages: [{ role: 'user', content: t + question }],
    };
    setLoading(true);
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${t}${question}`,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });

    if (response.data.choices[0].text) {
      setStoredValues([
        ...storedValues,

        {
          question: question,
          answer: response.data.choices[0].text,
        },
      ]);
      setQuestion("");
    }
    setLoading(false)
  }

  const handleMic = () => {
    alert("clicked Mic!!!");
  }

  return (
    <div className={`${loading ? "cursor-wait" : ""} mt-6 flex  flex-col gap-8 h-full`}>
      <Card className="h-full">
        <CardHeader
          color="transparent"
          floated={false}
          shadow={false}
          className="m-0 p-4"
        >
          <Typography variant="h4" color="blue-gray">
            ChatGPT
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4 py-4 px-6 lg:px-10 grow">
          <div className="overflow-y-auto grow">
            {
              storedValues.length == 0 ?
                <div className="text-xl bg-blue-gray-800 mt-2 py-2 px-4 rounded-r-3xl rounded-bl-3xl text-white">I'm a ChatGPT, How can I assist you?</div>
                :
                storedValues.map((value, index) => {
                  return (
                    <div className="mt-2 pr-3" key={index}>
                      <div className="flex flex-col items-end">
                        <div className="flex flex-row">
                          <div className="text-right text-xl bg-blue-400 text-white p-3 rounded-l-2xl rounded-br-2xl">
                            {value.question}
                          </div>
                          <Avatar
                            src={'/img/user.jpg'}
                            alt={'user'}
                            size="md"
                            variant="circular"
                            className={`cursor-pointer border-2 border-white`}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex flex-row">
                          <Avatar
                            src={'/img/bot.jpg'}
                            alt={'user'}
                            size="xl"
                            variant="circular"
                            className={`cursor-pointer border-2 border-white`}
                          />
                          <div className="text-xl bg-gray-200 mt-2 p-3 rounded-r-3xl rounded-bl-3xl flex flex-row">
                            <div>
                              <AnimationMessage text= {value.answer} />
                            </div>
                            <IconButton
                              variant="text"
                              size="lg"
                              onClick={() => copyText(value.answer)}
                            >
                              <i className="fa-solid fa-copy"></i>
                            </IconButton >
                          </div>

                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
          <div className="flex flex-row gap-4 items-center">
            <div className="basis-11/12 relative">
              <Input
                className="aboslute"
                type="text"
                label="Question"
                size="lg"
                disabled={loading}
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => e.keyCode == 13 ? handleSubmit(e, "") : ""}
              />
              <button
                className="bg-blue-gray-800 rounded-3xl border-l-[1px] text-white text-center p-2 absolute top-0.5 right-2"
                onClick={handleMic}
              >
                <i className="fas fa-microphone" />
              </button>
            </div>
            <div className="basis-1/12 flex items-end">
              <Button variant="gradient" className={loading ? "cursor-not-allowed bg-blue-500 h-full rounded-l-3xl text-white text-center px-3" : "bg-blue-500 rounded-l-3xl text-white text-center px-3"} fullWidth onClick={(e) => handleSubmit(e, "")}>
                <i className="fas fa-paper-plane"></i>
              </Button>
              <Menu className="h-full">
                <MenuHandler>
                  <button className="bg-blue-500 rounded-r-3xl border-l-[1px] text-white text-center p-2">
                    <i className="fas fa-arrow-down" />
                  </button>
                </MenuHandler>
                <MenuList>
                  <MenuItem
                    onClick={(e) => handleSubmit(e, "Correct Write")}
                  >
                    Grammer
                  </MenuItem>

                  <MenuItem
                    onClick={(e) => handleSubmit(e, "Explain it")}
                  >
                    Explain
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => handleSubmit(e, "Create a list of 8 questions for my interview with a ")}
                  >
                    Interview
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => handleSubmit(e, "Translate to chinese")}
                  >
                    Chinese
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => handleSubmit(e, "Translate to english")}
                  >
                    English
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
          </div>
        </CardBody>
      </Card>

    </div>
  );
}

export default Chatbot;
