# Author: Megan Wooley
# GitHub username: megw-school
# Date 10/28/2023
# Description: *


import dotenv
from flask import Flask, jsonify, request
from canvas_model import Canvas
from clickup_model import ClickUp
import datetime

ENV_SECRET = ".env.secret"
ENV_SHARED = ".env.shared"

memo = {}

clickup = ClickUp(
    dotenv.get_key(ENV_SECRET, 'CLICKUP_TOKEN'),
    dotenv.get_key(ENV_SECRET, 'CLICKUP_CLIENT_ID'),
    dotenv.get_key(ENV_SECRET, 'CLICKUP_CLIENT_SECRET')
)

canvas = Canvas(
    dotenv.get_key(ENV_SECRET, 'CANVAS_TOKEN'),
    dotenv.get_key(ENV_SECRET, 'CANVAS_CLIENT_ID'),
    dotenv.get_key(ENV_SECRET, 'CANVAS_CLIENT_SECRET')
)

app = Flask(__name__)


def build_clickup_task(workspace, space, listt, task):
    if 'clickup_workspaces' not in memo:
        return "Could not find workspace.", False

    if 'clickup_workspace' not in memo:
        memo['clickup_workspace'] = {}

    if space not in memo['clickup_workspace']:
        space_id, success = clickup.create_space(memo['clickup_workspaces'][workspace], space)
        if not success:
            return space_id, False

        memo['clickup_workspace'][space] = {'id': space_id}

    if listt not in memo['clickup_workspace'][space]:
        list_id, success = clickup.create_list(memo['clickup_workspace'][space]['id'], listt)
        if not success:
            return list_id, False

        memo['clickup_workspace'][space][listt] = {'id': list_id}

    task_id = clickup.create_task(
        memo['clickup_workspace'][space][listt]['id'],
        task['name'],
        None if not task['due_date'] else datetime.datetime.fromisoformat(task['due_date']).strftime('%m/%d/%Y'),
        None if 'unlock_date' not in task or not task['unlock_date'] else datetime.datetime.fromisoformat(task['unlock_date']).strftime('%m/%d/%Y'),
        None if 'url' not in task else task['url'],
        None if 'tag' not in task else [task['tag']],
    )

    return task_id, True


def build_clickup_workspaces():
    if 'clickup_workspaces' not in memo:
        workspaces = clickup.get_workspaces()
        data = {}
        for workspace in workspaces:
            data[workspace['name']] = workspace['id']

        memo['clickup_workspaces'] = data


def build_course_tree(term):
    if 'canvas_courses' in memo and term in memo['canvas_courses']:
        return memo['course_tree'][term]

    courses = canvas.get_courses()

    course_name_lookup = {}
    assignment_type_lookup = {}
    for course in courses:
        if term == 'all' or course['term'] == term:
            course_name_lookup[course['id']] = course['name']
            assignment_type_lookup[course['id']] = canvas.get_assignment_types(course['id'])

    course_tree = {}
    for idd in assignment_type_lookup:
        course_tree[course_name_lookup[idd]] = list(set(assignment_type_lookup[idd].values()))

    memo['canvas_courses'] = {term: courses}
    memo['course_name_lookup'] = {term: course_name_lookup}
    memo['assignment_type_lookup'] = {term: assignment_type_lookup}
    memo['course_tree'] = {term: course_tree}


def build_assignments(term):
    if 'assignments' in memo and term in memo['assignments']:
        return memo['assignments'][term]

    if not ('canvas_courses' in memo and term in memo['canvas_courses']):
        build_course_tree(term)

    courses = memo['canvas_courses'][term]
    assignment_type_lookup = memo["assignment_type_lookup"][term]
    assignments = []
    for course in courses:
        if term == 'all' or course['term'] == term:
            assignments.extend(canvas.get_assignments(course['id'], course_name=course['name'],
                                                      assignment_type_lookup=assignment_type_lookup[course['id']]))

    memo['assignments'] = {term: assignments}


@app.get("/")
def index():
    return 'course courier service'


@app.route("/credentials/<service>", methods=['PUT', 'GET'])
def get_credentials(service):
    service = service.upper()
    task_managers = ['CLICKUP']
    if service not in task_managers and service != 'CANVAS':
        return "Invalid parameter. Service not supported.", 400

    if request.method == 'GET':
        data = {
            'token': dotenv.get_key(ENV_SECRET, f'{service}_TOKEN'),
            'client_id': dotenv.get_key(ENV_SECRET, f'{service}_CLIENT_ID'),
            'client_secret': dotenv.get_key(ENV_SECRET, f'{service}_CLIENT_SECRET')
        }

        return jsonify(data)

    else:
        data = request.get_json()
        dotenv.set_key(ENV_SECRET, f'{service}_TOKEN', data['token'])
        dotenv.set_key(ENV_SECRET, f'{service}_CLIENT_ID', data['client_id'])
        dotenv.set_key(ENV_SECRET, f'{service}_CLIENT_SECRET', data['client_secret'])

        return "Success", 200


@app.get("/canvas-course-tree")
def get_canvas_course_tree():
    # return as a selection tree format
    term = request.args.get('term')  # 'all', 'F2023', 'S2023', 'U2023', 'W2023'
    if not term:
        term = 'all'

    build_course_tree(term)

    return jsonify(memo['course_tree'][term])


@app.get("/canvas-assignments")
def get_canvas_assignments():
    # return as a selection tree format
    term = request.args.get('term')  # 'all', 'F2023', 'S2023', 'U2023', 'W2023'
    if not term:
        term = 'all'

    build_assignments(term)

    return jsonify(memo['assignments'][term])


@app.get("/clickup-workspaces")
def get_clickup_workspaces():
    build_clickup_workspaces()

    if request.args.get('name'):
        return memo['clickup_workspaces'][request.args.get('name')]

    return jsonify(list(memo['clickup_workspaces'].keys()))


@app.post("/clickup-task")
def create_clickup_task():
    data = request.get_json()
    task_id, success = build_clickup_task(data['workspace'], data['space'], data['list'], data['task'])

    if not success:
        return task_id, 400

    return "Success", 200


if __name__ == "__main__":
    app.run(host=dotenv.get_key(ENV_SHARED, "HOST"), port=dotenv.get_key(ENV_SHARED, "PORT"), debug=True)
#     build_clickup_workspaces()
#     build_clickup_task("CS361 Project Test", 'test-space', 'test-list', task={})
