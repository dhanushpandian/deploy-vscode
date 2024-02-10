// extension.js

const vscode = require('vscode');
const { window } = vscode;
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

// Function to deploy webpage to S3
async function deployToS3() {
  const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
  const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
  const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

  const s3 = new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  });

  // Get the active editor
  const activeEditor = window.activeTextEditor;
  if (!activeEditor) {
    window.showErrorMessage('No active editor found.');
    return;
  }

  // Get the HTML content from the active editor
  const htmlContent = activeEditor.document.getText();

  // Upload the HTML content to S3
  const uploadParams = {
    Bucket: S3_BUCKET_NAME,
    Key: `webpage_${Date.now()}.html`, // You may want to use a more meaningful key
    Body: htmlContent,
  };

  try {
    const data = await s3.upload(uploadParams).promise();
    window.showInformationMessage(`Webpage deployed successfully. URL: ${data.Location}`);
  } catch (error) {
    window.showErrorMessage(`Error deploying to S3: ${error.message}`);
  }
}

// Register the command
context.subscriptions.push(vscode.commands.registerCommand('extension.deployToS3', deployToS3));
