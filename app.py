import cv2
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import keras
import numpy as np

# Load your ML model here
IMG_SIZE = 32
model = keras.models.load_model("my_model.h5")
my_dict = { 0:'а', 1:'ә', 2:'з', 3:'и', 4:'й', 5:'к', 
            6:'қ', 7:'л', 8:'м', 9:'н', 10:'ң', 11:'о',
            12:'б', 13:'ө', 14:'п', 15:'р', 16:'с', 17:'т',
            18:'у', 19:'ұ', 20:'ү', 21:'ф', 22:'х', 23:'в',
            24:'ц', 25:'ч', 26:'ш', 27:'щ', 28:'һ', 29:'ъ',
            30:'ы', 31:'і', 32:'ь', 33:'э', 34:'г', 35:'ю',
            36:'я', 37:'ғ', 38:'д', 39:'е', 40:'ё', 41:'ж'}

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    image_data = request.get_json().get('image')
    image_data = image_data.replace('data:image/png;base64,', '')
    
    # Decode base64 image data and convert to NumPy array
    image = base64.b64decode(image_data)
    image = np.frombuffer(image, dtype=np.uint8)
    image = cv2.imdecode(image, cv2.IMREAD_UNCHANGED)

    # Resize and grayscale image
    resized_image = cv2.resize(image, (IMG_SIZE, IMG_SIZE))
    gray_image = cv2.cvtColor(resized_image, cv2.COLOR_BGR2GRAY)

    img_array = np.array(gray_image)
    img_array = img_array / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    prediction = model.predict(img_array)

    prediction_class = np.argmax(prediction)
    prediction_class = int(prediction_class)
    
    return jsonify({ 'prediction': my_dict[prediction_class] })

if __name__ == '__main__':
    app.run()
