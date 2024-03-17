import axios from 'axios';
import React, { BaseSyntheticEvent, useState } from 'react';

function App  ()  {
  const [image, setImage] = useState<any>();
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined); // For image preview
  const [speechToText, setSpeechToText] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [outputImage, setOutputImage] = useState<string>();

  const handleImageChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl); // Update the state to hold the preview URL
    }

  };

  const handleVoiceRecording = () => {
    alert("Placeholder for voice recording functionality.");
    // const dummySpeechResult = "This is a sample voice transcription.";
    //setSpeechToText(dummySpeechResult);
    voiceRecord();
  };

  const voiceRecord = () => {
    axios.get('http://localhost:5000/speech-text')
    .then(response => {
      console.log("tamil");
      console.log(response.data.tamil_text);
      console.log(typeof(response.data.tamil_text))
      setSpeechToText(response.data.tamil_text);
      console.log(speechToText);
      translateText(response.data.tamil_text)
    })
    .catch(error => {
      console.error('There was an error converting spech to text:', error);
      setSpeechToText("Failed to translate text.");
    });

  };

  const translateText = (text : string) => {
    axios.post('http://localhost:5000/translate-text', text, {
      headers: {
        'Content-Type': 'application/json'      }
    })
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
    formData.append('text',translatedText)
    formData.append('file', image);
    console.log(translatedText)
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  
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

  const handleTextChange = (event : any) => {
    setTranslatedText(event.target.value);
  };

  return (
    <div>

      <form onSubmit={handleSubmit}>
        <h1>Guided Image Enhancement through Human Instructions</h1>
        <input type="file" onChange={handleImageChange} />
        {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: "100px" }} />}
        <button type="button" onClick={handleVoiceRecording}>Record Voice</button>
        <h1 style={{ fontSize: '20px' }}>{speechToText}</h1>
        <textarea style={{ fontSize: '20px', width: '100%', height: '200px' }} value={translatedText} onChange={handleTextChange}  />
        <button type='submit'>Submit</button>
      </form>
      {outputImage && <img src={outputImage} alt="Output" style={{ width: "100px" }} />}
    </div>
  );
};

export default App;