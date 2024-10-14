// Function to extract the content of the currently opened email
async function extractEmailContent() {
    // Implement logic to extract email content from the Gmail DOM
    // For example, using document.querySelector or similar methods to get subject and body
    const emailSubject = document.querySelector('h1').innerText; // Example selector
    const emailBody = document.querySelector('.ii.gt').innerText; // Example selector
  
    if (emailSubject && emailBody) {
      return { subject: emailSubject, body: emailBody };
    } else {
      console.error('Email content not found.');
      return null;
    }
  }
  
  // Function to extract the currently typed reply content
  async function extractReplyContent() {
    const replyTextarea = document.getElementById('replyContent');
    return replyTextarea.value;
  }
  
  // Function to send the Gmail reply using the API
  async function sendGmailReply(replyContent) {
    try {
      const response = await fetch('https://gmail.googleapis.com/upload/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${yourAccessToken}`, // Replace with actual access token
        },
        body: JSON.stringify({
          raw: btoa(replyContent) // Encode the reply content
        }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error sending reply:', error);
      return false;
    }
  }
  
  // Function to summarize the email and display it
  async function summarizeEmail(emailContent) {
    try {
      const response = await fetch('https://api.yourgoogleai.com/summarize', { // Replace with actual API URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${yourAccessToken}`, // Replace with actual access token
        },
        body: JSON.stringify({ text: emailContent.body }),
      });
      const data = await response.json();
      document.getElementById('summary').innerText = data.summary; // Display the summary
    } catch (error) {
      console.error('Error summarizing email:', error);
    }
  }
  
  // Event listener for summarize button
  document.getElementById('summarizeBtn').addEventListener('click', async () => {
    const emailContent = await extractEmailContent();
    if (emailContent) {
      await summarizeEmail(emailContent);
    }
  });
  
  // Event listener for auto reply button
  document.getElementById('autoReplyBtn').addEventListener('click', async () => {
    const emailContent = await extractEmailContent();
    if (emailContent) {
      const autoReply = `Thank you for your email regarding "${emailContent.subject}". I will get back to you shortly.`;
      document.getElementById('replyContent').value = autoReply; // Set auto reply in the reply textarea
    }
  });
  
  // Event listener for edit reply button
  document.getElementById('editReplyBtn').addEventListener('click', async () => {
    const currentReply = await extractReplyContent();
    document.getElementById('replyContent').value = currentReply; // Load the current reply into the textarea
  });
  
  // Event listener for send reply button
  document.getElementById('sendReplyBtn').addEventListener('click', async () => {
    const replyContent = document.getElementById('replyContent').value;
    const success = await sendGmailReply(replyContent);
    if (success) {
      alert('Reply sent successfully!');
    } else {
      alert('Error sending reply. Please try again.');
    }
  });
  
  // Theme toggle functionality
  const themeSwitch = document.getElementById('themeSwitch');
  const themeStylesheet = document.getElementById('theme-stylesheet');
  
  themeSwitch.addEventListener('change', () => {
    if (themeSwitch.checked) {
      themeStylesheet.setAttribute('href', 'styles-dark.css'); // Dark theme stylesheet
    } else {
      themeStylesheet.setAttribute('href', 'styles.css'); // Light theme stylesheet
    }
  });
  