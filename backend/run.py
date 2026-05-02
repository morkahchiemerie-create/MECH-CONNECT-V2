from backend import create_app

# create the flask app using factory
app = create_app()

# run server
if __name__ == "__main__":
    app.run(debug=True)