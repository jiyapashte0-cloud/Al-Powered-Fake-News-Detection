# AI Fake News Detection - Component Explanation

## Client Layer
This is the user interface of the fake news detection system.

Functions:
- User enters news headline or article
- Sends data to server
- Displays prediction result

Input: News Article / Headline  
Output: Fake or Real

---

## Server Layer
This layer handles communication between client and AI model.

Functions:
- Receives news text from client
- Cleans and preprocesses data
- Sends data to AI model
- Returns result to client

---

## AI Model Layer
This is the main intelligence of the system.

Functions:
- Analyze news text
- Extract important features
- Predict whether news is fake or real

Output:
- Fake News
- Real News

---

## Database Layer
Stores important system data.

Functions:
- Store news dataset
- Store user search history
- Store prediction results
- Store model logs

---

## Working Flow
1. User enters news article in application
2. Client sends request to server
3. Server processes text
4. AI model predicts fake or real
5. Result stored in database
6. Output shown to user
