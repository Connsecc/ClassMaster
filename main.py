from flask import Flask, request
from flask_socketio import SocketIO, send, emit

app = Flask(__name__, static_url_path='')
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

databaseFile = open("database.txt", "a+")

class Course:
    def __init__(self, name, period):
        self.name = name
        self.period = period
        self.as_list = []

    def create(self, name, due_date, points, category, description):
        assignment = Assignments(name, due_date, points, category, description)
        self.as_list.append(assignment)

    def delete(self, name):
        for assignment in self.as_list:
            if assignment.name == name:
                self.as_list.remove(assignment)
                break

    def complete(self, name):
        self.delete(name)

class Assignments:
    def __init__(self, name, due_date, points, category, description):
        self.name = name
        self.due_date = due_date
        self.points = points
        self.category = category
        self.description = description

    def getName(self):
        return self.name
    
    def getDueDate(self):
        return self.due_date
    
    def getPoints(self):
        return self.points
    
    def getCategory(self):
        return self.category
    
    def getDescription(self):
        return self.description

    

@app.route("/")
def indexFile():
    return app.send_static_file("index.html")

@app.route("/calendar")
def calendarFile():
    return app.send_static_file("calender.html")

@app.route("/createEvent", methods=["POST"])
def createEvent():
    eventName = str(request.args.get("name"))
    eventDate = str(request.args.get("date"))

    print(f"{eventName} {eventDate}")
    databaseFile.write(f"{eventName} {eventDate}\n")
    databaseFile.flush()

    return ""

@app.route("/getEvents", methods=["GET"])
def getEvents():
    databaseFile.seek(0)
    return databaseFile.read()

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=4443, debug=True)
