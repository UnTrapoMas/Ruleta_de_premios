from flask import Flask, render_template, jsonify, send_from_directory

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/girar', methods=['POST'])
def girar():
    try:
        # Simulamos la respuesta que el frontend espera
        # En realidad, el frontend ya maneja toda la lógica
        return jsonify({
            'success': True,
            'premio': 'Simulación',
            'rotacion': 0  # El frontend calculará la rotación
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/favicon.ico')
def favicon():
    return send_from_directory('static/images', 'favicon.ico')

if __name__ == '__main__':
    app.run(debug=True, port=5001)
