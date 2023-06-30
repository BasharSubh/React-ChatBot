const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');

const app = express();
app.use(cors());

app.get('/data', async (req, res) => {
    const url = 'https://api.openai.com/v1/chat/completions';
    
    const question = req.query.question

  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.VITE_KEY}`,
    },
    data: {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: question,
        },
      ],
    },
  };

  try {
    const response = await axios.post(url, options.data, {
      headers: options.headers,
    });
    const result = response.data;
    console.log(result);
      res.send(result);
      console.log(req)
  } catch (error) {
    console.error(error);
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Server started on port ' + port);
});
