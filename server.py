from flask import Flask, request, render_template, jsonify
import json

import os

from Sol_prob import get_response

app = Flask(__name__)

@app.route('/')
def login():
    return render_template('index.html')
    
@app.route('/predict', methods=['POST'])
def predict():
    text = request.get_json().get("message")
    response = get_response(text)
    print(response)
    print(type(response))
    message = {"answer": response}
    return jsonify(message)
    
if __name__ == '__main__':
    port = os.environ.get("PORT", 5000)
    app.run(debug=False, host="0.0.0.0", port=port)