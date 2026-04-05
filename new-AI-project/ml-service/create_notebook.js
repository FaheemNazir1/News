const fs = require('fs');
const content = fs.readFileSync('c:\\vibe coding\\ai-news-aggregator\\ml-service\\train.py', 'utf-8');
const lines = content.split('\n').map(line => line + '\n');
const notebook = {
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "# Fake News DistilBERT Trainer\n",
    "Run the cells sequentially to install dependencies and train the model! Make sure you go to **Runtime > Change runtime type > T4 GPU** before starting."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "!pip install transformers accelerate torch pandas scikit-learn datasets pyarrow\n",
    "!mkdir -p data\n"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": lines
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3",
   "language": "python",
   "name": "python3"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 4
};
fs.writeFileSync('c:\\vibe coding\\ai-news-aggregator\\ml-service\\DistilBERT_Trainer.ipynb', JSON.stringify(notebook, null, 1));
console.log('Notebook created successfully.');
