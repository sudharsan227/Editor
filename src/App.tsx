import axios from 'axios';
import React, { BaseSyntheticEvent, useState } from 'react';

function App  ()  {
  const [image, setImage] = useState<string>();
  const [speechToText, setSpeechToText] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [outputImage, setOutputImage] = useState<string>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(URL.createObjectURL(file));
    }
  };

  const handleVoiceRecording = () => {
    alert("Placeholder for voice recording functionality.");
    const dummySpeechResult = "This is a sample voice transcription.";
    setSpeechToText(dummySpeechResult);
    translateText(dummySpeechResult);
  };

  const translateText = (text: string) => {
    axios.post('http://localhost:5000/translate-text', { text })
    .then(response => {
      setTranslatedText(response.data.translatedText);
    })
    .catch(error => {
      console.error('There was an error translating the text:', error);
      setTranslatedText("Failed to translate text.");
    });

  };

  const handleSubmit = (event:BaseSyntheticEvent) => {
    console.log("helloooo")
    event.preventDefault();
  
    // Assuming image holds a file selected by the user
    // First, we need to create FormData to send as multipart/form-data
    const formData = new FormData();
    formData.append('file', event.target); // Adjust this depending on how you're capturing the file
  
    axios.post('http://localhost:5000/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      alert("Image uploaded successfully.");
      // You might want to do something with the response here,
      // such as setting another image URL based on the response
      // For demo purposes, let's assume the server returns the URL of the uploaded image
      setOutputImage(response.data.filename);
    })
    .catch(error => {
      console.error("Error uploading image:", error);
    });
  
  };

  return (
    <div>

      <form onSubmit={handleSubmit}>
        <h1>React TypeScript App with Vite</h1>
        <input type="file" onChange={handleImageChange} />
        {image && <img src={image} alt="Uploaded" style={{ width: "100px" }} />}
        <button onClick={handleVoiceRecording}>Record Voice</button>
        <textarea value={speechToText} readOnly />
        <textarea value={translatedText} readOnly />
        <button type='submit'>Submit</button>
      </form>
      {outputImage && <img src={outputImage} alt="Output" style={{ width: "100px" }} />}
    </div>
  );
};

export default App;