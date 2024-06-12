# Steganography Server



## Table of Contents

- [Steganography Server](#steganography-server)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Usage](#usage)

## Prerequisites

- Python 3.x installed on your machine
- Flask framework installed (`pip install flask`)

## Installation

1. Clone the repository: `git clone https://github.com/your-username/your-repo.git`
2. Navigate to the project directory: `cd your-repo`
3. Create a virtual environment: `python3 -m venv venv`
4. Activate the virtual environment:
    - For Windows: `venv\Scripts\activate`
    - For macOS/Linux: `source venv/bin/activate`
5. Install the required dependencies: `pip install -r requirements.txt`

## Configuration

1. Create a `.env` file in the project root directory.
2. Add the following configuration variables to the `.env` file:
    ```
    FLASK_APP=app.py
    FLASK_ENV=development
    ```
    You can customize these variables based on your needs.

## Usage

1. Start the Flask server:
    ```
    python app.py
    ```
2. Open your web browser and navigate to `http://localhost:5000` to access the server.

