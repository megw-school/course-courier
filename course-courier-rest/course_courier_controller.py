# Author: Megan Wooley
# GitHub username: megw-school
# Date 10/28/2023
# Description: This script provides all endpoints for course-courier.


import datetime

import dotenv
from flask import Flask, jsonify, request

from canvas_model import Canvas
from clickup_model import ClickUp

ENV_SECRET = ".env.secret"
ENV_SHARED = ".env.shared"

memo = {'CANVAS': {'auth_type': 'token'}, 'CLICKUP': {'auth_type': 'token'}}
clickup = ClickUp()
canvas = Canvas()
app = Flask(__name__)


def build_clickup_task(workspace, space, listt, task):
    """
    Create a ClickUp task. Checks if the workspace, space, and list already exist or need to be created.

    :param workspace: name of workspace
    :param space: name of space
    :param listt: name of list
    :param task: task object
    :return: ID of created task and True if successful, False otherwise
    """
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
        start_date=None if not task.get('unlock_date', None) else datetime.datetime.fromisoformat(
            task['unlock_date']).strftime('%m/%d/%Y'),
        description=None if not task.get('url', None) else task['url'],
        tags=None if not task.get('tag', None) else [task['tag']],
    )

    return task_id, True


def build_clickup_workspaces():
    """
    Find the ClickUp workspace and add it to memo.

    :return: None
    """
    if 'clickup_workspaces' not in memo:
        workspaces = clickup.get_workspaces()
        data = {}
        for workspace in workspaces:
            data[workspace['name']] = workspace['id']

        memo['clickup_workspaces'] = data


def build_course_tree(term):
    """
    Build tree that organizes assignments by course and add to memo.

    :param term: university term
    :return: None
    """
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
    """
    Get assignments for each course and add to memo.

    :param term: university term
    :return: None
    """
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


def service_auth(service_name):
    """
    Handle authentication for a given service.

    :param service_name: name of service in all caps
    :return: None
    """
    auth_type = memo[service_name]['auth_type']
    if service_name == 'CLICKUP':
        clickup.authenticate(
            auth_type,
            dotenv.get_key(ENV_SECRET, 'CLICKUP_TOKEN'),
            dotenv.get_key(ENV_SECRET, 'CLICKUP_CLIENT_ID'),
            dotenv.get_key(ENV_SECRET, 'CLICKUP_CLIENT_SECRET')
        )
    elif service_name == 'CANVAS':
        canvas.authenticate(
            auth_type,
            dotenv.get_key(ENV_SECRET, 'CANVAS_TOKEN'),
            dotenv.get_key(ENV_SECRET, 'CANVAS_CLIENT_ID'),
            dotenv.get_key(ENV_SECRET, 'CANVAS_CLIENT_SECRET')
        )


@app.get("/")
def index():
    """
    Check that service is running.

    :return: validation message
    """
    return 'Course Courier service is running...'


@app.route("/credentials/<service>", methods=['PUT', 'GET'])
def get_credentials(service):
    """
    Endpoint for GET or PUT credentials. If PUT, updates the credentials locally.

    :param service: name of service in all caps
    :return: If PUT, returns Success. If GET, returns the credential data from local env.
    """
    service = service.upper()
    task_managers = ['CLICKUP']
    if service not in task_managers and service != 'CANVAS':
        return "Invalid parameter. Service not supported.", 400

    if request.method == 'GET':

        data = {
            'auth_type': memo[service]['auth_type'],
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
        memo[service] = {'auth_type': data['auth_type']}

        service_auth(service)

        return "Success", 200


@app.get("/canvas-course-tree")
def get_canvas_course_tree():
    """
    Get the canvas course tree which organizes assignments by course. Optionally provide the term as a query parameter.

    :return: Tree as JSON object
    """
    if not canvas.authenticated:
        service_auth("CANVAS")

    # return as a selection tree format
    term = request.args.get('term')  # 'all', 'F2023', 'S2023', 'U2023', 'W2023'
    if not term:
        term = 'all'

    build_course_tree(term)

    return jsonify(memo['course_tree'][term])


@app.get("/canvas-assignments")
def get_canvas_assignments():
    """
    Get all assignments on canvas. Optionally, provide the term as a query parameter.

    :return: assignments as a JSON object
    """
    if not canvas.authenticated:
        service_auth("CANVAS")

    # return as a selection tree format
    term = request.args.get('term')  # 'all', 'F2023', 'S2023', 'U2023', 'W2023'
    if not term:
        term = 'all'

    build_assignments(term)

    return jsonify(memo['assignments'][term])


@app.get("/clickup-workspaces")
def get_clickup_workspaces():
    """
    Get all ClickUp workspaces.

    :return: workspaces as a JSON object
    """
    if not clickup.authenticated:
        service_auth("CLICKUP")

    build_clickup_workspaces()

    if request.args.get('name'):
        return memo['clickup_workspaces'][request.args.get('name')]

    return jsonify(list(memo['clickup_workspaces'].keys()))


@app.post("/clickup-task")
def create_clickup_task():
    """
    Create a ClickUp task provided and provide the task object in the POST body.

    :return: Success if task was created, otherwise the ID of what failed.
    """
    if not clickup.authenticated:
        service_auth("CLICKUP")

    data = request.get_json()
    task_id, success = build_clickup_task(data.get('workspace', None), data.get('space', None), data.get('list', None),
                                          data.get('task', None))

    print(task_id)
    if not success:
        return task_id, 400

    return "Success", 200


if __name__ == "__main__":
    app.run(host=dotenv.get_key(ENV_SHARED, "HOST"), port=dotenv.get_key(ENV_SHARED, "PORT"), debug=True)
