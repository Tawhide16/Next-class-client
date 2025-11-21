import React, { useState } from 'react';

// Gemini component
export default function Gemini() {
  // State variables
  const [isOpen, setIsOpen] = useState(false); // Controls chat window visibility
  const [prompt, setPrompt] = useState(''); // User's input
  const [messages, setMessages] = useState([]); // Chat history
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Function to handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const newUserMessage = { role: 'user', text: prompt };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    
    setIsLoading(true);
    setError(null);
    const currentPrompt = prompt;
    setPrompt('');

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error("API Key khuje paoa jacche na. .env file e VITE_GEMINI_API_KEY set kora ache kina check korun.");
      }

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const payload = {
        contents: [{ parts: [{ text: currentPrompt }] }]
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Something went wrong');
      }

      const data = await response.json();
      
      // *** ERROR HANDLING IMPROVEMENT ***
      // Check if the response has the expected structure before accessing it
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        const newAiMessage = { role: 'ai', text: aiResponse };
        setMessages(prevMessages => [...prevMessages, newAiMessage]);
      } else {
        // Handle cases where the response is valid but doesn't contain content (e.g., safety blocks)
        console.error("Invalid response structure from API:", data);
        if (data.promptFeedback) {
             throw new Error(`Apnar proshno-ti policy karone block kora hoyeche. Reason: ${data.promptFeedback.blockReason}`);
        }
        throw new Error('API theke kono valid content paoa jayni.');
      }

    } catch (err) {
      console.error(err);
      setError(err.message);
      const errorMessage = { role: 'ai', text: `Oops! Kono ekta shomoshsha hoyeche: ${err.message}` };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 bg-cyan-600 text-white p-4 rounded-full shadow-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-transform duration-200 ease-in-out hover:scale-110 z-50"
        aria-label="Toggle chat"
      >
        {isOpen ? (
          // Close Icon
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-8 w-[calc(100vw-4rem)] max-w-md h-[70vh] bg-gray-800 text-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out z-40 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-center text-cyan-400">My School ChatBot</h2>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {messages.length === 0 && (
                <div className="text-center text-gray-500">
                    Kono proshno jiggesh korun...
                </div>
            )}
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-lg px-5 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-cyan-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-lg px-5 py-3 rounded-2xl bg-gray-700 rounded-bl-none">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Form */}
        <div className="p-4 border-t border-gray-700">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ekhane type korun..."
              className="flex-1 bg-gray-700 text-white placeholder-gray-400 px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold p-3 rounded-full transition-colors duration-300 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </form>
          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        </div>
      </div>
    </>
  );
}
