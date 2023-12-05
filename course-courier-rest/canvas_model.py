# Author: Megan Wooley
# GitHub username: megw-school
# Date: 10/12/2023
# Description: Access courses and assignments in Canvas through the Canvas API.

import datetime
import json

import dotenv
import requests


class Canvas:
    """Represents user interacting with their Canvas account."""

    def __init__(self):
        """
        Initialize session with Canvas API token.
        """
        self._base_url = "https://canvas.oregonstate.edu/api/v1"
        self._headers = {'Authorization': ''}
        self.authenticated = False

    def authenticate(self, auth_type, token=None, client_id=None, client_secret=None):
        """
        Authenticate for REST session.

        :param auth_type: either 'oauth' or 'token'
        :param token: personal token or authorization token
        :param client_id: app registered client ID
        :param client_secret: app registered client secret
        :return: None
        """
        if not (token or (client_id and client_secret)):
            raise PermissionError('No credentials provided')

        if auth_type == 'oauth' and client_id and client_secret:
            raise Exception('Not yet implemented')
            # token = self._oauth_flow(client_id, client_secret)

        elif auth_type != 'token' or not token:
            raise PermissionError("Missing token.")

        self._headers['Authorization'] = f'Bearer 	 {token}'
        self.authenticated = True

    def _get(self, endpoint, per_page=50):
        """
        Make a GET request to Canvas.

        :param endpoint: request endpoint
        :param per_page: results per page
        :return: full result
        """
        url = ''.join([self._base_url, endpoint, f'?per_page={str(per_page)}'])
        output = []
        while url:
            res = requests.request('GET', url, headers=self._headers)
            output.extend(json.loads(res.text))

            url = None
            if 'next' in res.links:
                url = res.links['next']['url']

        return output

    def get_courses(self):
        """
        Get all courses for current user.

        :return: courses for current user
        """
        courses = self._get("/courses")

        output = []
        for course in courses:
            if 'name' in course:
                desc = course['name'].split('(')

                name = desc[0].strip()
                code = None
                term = None
                if len(desc) > 1:
                    desc = desc[1].split('_')
                    code = ' '.join(desc[0:2])
                    term = desc[-1][:-1]

                output.append(
                    {
                        'id': course['id'],
                        'name': name,
                        'code': code,
                        'term': term,
                    }
                )

        return output

    def get_assignment_types(self, course_id):
        """
        Get all assignment types for a given course.

        :param course_id: Canvas internal ID for course
        :return: assignment types for the course
        """
        types = self._get(f"/courses/{str(course_id)}/assignment_groups")

        output = {}
        for typ in types:
            output[typ['id']] = typ['name']

        return output

    def get_assignments(self, course_id, assignment_type_id=None, course_name=None, assignment_type_lookup=None):
        """
        Get all assignments for a course. Optionally, provide the assignment type and limit by course and type.

        :param course_id: Canvas internal ID for course
        :param assignment_type_id: optional, Canvas internal ID for assignment type (specific to course)
        :param course_name: optional, course name for readability in output
        :param assignment_type_lookup: optional, assignment type look up dictionary for readability in output
        :return: assignments for course
        """
        if assignment_type_id:
            assignments = self._get(
                f"/courses/{str(course_id)}/assignment_groups/{str(assignment_type_id)}/assignments")
        else:
            assignments = self._get(f"/courses/{str(course_id)}/assignments")

        output = []
        for assignment in assignments:
            unlock_date = None
            if assignment['unlock_at']:
                unlock_date = assignment['unlock_at']
            elif 'lock_info' in assignment:
                if 'unlock_at' in assignment['lock_info']:
                    unlock_date = assignment['lock_info']['unlock_at']
                elif 'context_module' in assignment['lock_info'] and 'unlock_at' in assignment['lock_info'][
                    'context_module']:
                    unlock_date = assignment['lock_info']['context_module']['unlock_at']

            if assignment['due_at']:
                week_number = datetime.datetime.fromisoformat(assignment['due_at']).isocalendar().week - 1
            else:
                week_number = -99

            temp = {
                'id': assignment['id'],
                'name': assignment['name'],
                'due_date': assignment['due_at'],
                'unlock_date': unlock_date,
                'url': assignment['html_url'],
                'type_id': assignment['assignment_group_id'],
                'course_id': assignment['course_id'],
                'week_id': week_number,
                'week': f'Week {week_number}',
            }

            if course_name:
                temp['course'] = course_name

            if assignment_type_lookup:
                temp['type'] = assignment_type_lookup[assignment['assignment_group_id']]

            output.append(temp)

        return output


if __name__ == "__main__":
    canvas = Canvas()
    canvas.authenticate(
        'token',
        token=dotenv.get_key(".env.secret", "CANVAS_TOKEN")
    )
    courses = canvas.get_courses()

    term = 'F2023'  # 'all', 'F2023', 'S2023', 'U2023', 'W2023'
    course_name_lookup = {}
    assignments = []
    assignment_type_lookup = {}
    for course in courses:
        if term == 'all' or course['term'] == term:
            course_name_lookup[course['id']] = course['name']
            assignment_type_lookup[course['id']] = canvas.get_assignment_types(course['id'])

            assignments.extend(canvas.get_assignments(course['id'], course_name=course['name'],
                                                      assignment_type_lookup=assignment_type_lookup[course['id']]))

    courseTree = {}
    for idd in assignment_type_lookup:
        courseTree[course_name_lookup[idd]] = set(assignment_type_lookup[idd].values())
