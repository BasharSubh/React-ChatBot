import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import botimg from './assets/icons8-bot-100.png';
import userimg from './assets/icons8-user-80.png';

function App() {
  const [chat, setChat] = useState([]);
  const [question, setQuestion] = useState('');
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false);
  const [offlineQuestion, setOfflineQuestion] = useState('');

  const [oldChat, setOldChat] = useState([])
  const [activeChat, setActiveChat] = useState(null)

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://react-chatbot-server.onrender.com/data?question=${question}`);
      const data = response.data; 
      const newTitle = !title ? question : title; 
      if (!title) {
        setTitle(question); 
      }
      const newChatEntry = {
        title: newTitle,
        question: question,
        role: 'user',
      };
      const newBotEntry = {
        title: newTitle, 
        answer: data.choices[0].message.content,
        role: 'bot',
      };
      setChat(prevChat => [...prevChat, newChatEntry, newBotEntry]);
      setOldChat(prevOldChat => [...prevOldChat, newChatEntry, newBotEntry]) 
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.setItem('oldChat', JSON.stringify(oldChat));
      setLoading(false);
      setQuestion('');
    }
  };

  useEffect(() => {
    const savedOldChat = localStorage.getItem('oldChat');
    if (savedOldChat) {
      setOldChat(JSON.parse(savedOldChat));
    }
  }, []);

  const handleChange = (e) => {
    setQuestion(e.target.value);
    setOfflineQuestion(e.target.value)
  };

  const handleClick = (e) => {
    if (!loading && question.trim() !== '') {
      e.preventDefault();
      fetchData();   
    }
  };

  const handleKeyPress = (e) => {
    if (!loading && question.trim() !== '') {
      if (e.keyCode === 13) {
        e.preventDefault();
        fetchData();
      }
    }
  };

  const handleNewChatClick = (e) => {
    e.preventDefault()
    setChat([])
    setTitle('')
    setLoading(false)
    setActiveChat(null)

  }

  const WaitingComponent = () => {
    const [dots, setDots] = useState('');

    useEffect(() => {
      const timer = setInterval(() => {
        setDots((prevDots) => (prevDots.length < 3 ? prevDots + '.' : '.'));
      }, 500);

      return () => {
        clearInterval(timer);
      };
    }, []);

    return <pre className="answer" style={{height: "15px"}}>{dots}</pre>;
  };


  const uniqueTitle = Array.from(new Set(oldChat.map(title => title.title)))

  const handleClickOldChats = (title) => {
    const filteredChat = oldChat.filter(entry => entry.title === title);
    setChat(filteredChat);
    setTitle(title);
    setLoading(false)
    setActiveChat(title)
  }
  
  const handleDeleteItem = (title) => {
    const updatedOldChat = oldChat.filter(item => item.title !== title);
    setOldChat(updatedOldChat);
    localStorage.setItem('oldChat', JSON.stringify(updatedOldChat));
  };
  console.log(chat)


  return (
    <div className="container">
      <div className="sidebar">
        <div className="sidebar-header">
        <button className='sidebar-btn' onClick={handleNewChatClick}>
          New Chat
        </button>
        </div>
        <div className='sidebar-oldchat'>
          {uniqueTitle?.map((title, index) => (
            <div key={index} className="oldchat-container">
              <div className='oldchat' onClick={() => handleClickOldChats(title)} style={activeChat === title ? {backgroundColor : "grey"} : {backgroundColor : ""}}>
                {title}
              </div>
              <button className="oldchat-close-btn" onClick={() => handleDeleteItem(title)}>x</button>
            </div>
          ))}
        </div>
        <p>
        Developed by Bashar Subh, Follow Me on <a href="https://github.com/BasharSubh/React-ChatBot" target="_blank" rel="noopener noreferrer"> GitHub</a>.
        </p>      </div>
      <div className="chatbox">
        <div className="chatbox-header">
          <h2>React ChatBot</h2>
        </div>
        <div className="chatbox-body">
          {chat.map((message, index) => (
            <div key={index}>
              {message.role === 'user' && (
                <div className='chatbox-question'>
                  <img src={userimg} alt='' className='chatbox-img' />
                  <pre className="question">{message.question}</pre>
                </div>
              )}
              {message.role === 'bot' && (
                <div className='chatbox-answer'>
                  <img src={botimg} alt='' className='chatbox-img' />
                  <pre  className="answer">{message.answer}</pre >
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className='chatbox-question'>
              <img src={userimg} alt='' className='chatbox-img' />
              <pre className="question">{offlineQuestion}</pre>
            </div>
          )}
          {loading && (
            <div className='chatbox-answer'>
              <img src={botimg} alt='' className='chatbox-img' />
              <WaitingComponent />
            </div>
          )}
        </div>
        <div className="chatbox-footer">
          <input
            type="text"
            value={question}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            disabled={loading}
          />
          <button onClick={handleClick} disabled={loading}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
  
}

export default App;
