# Author: Megan Wooley
# GitHub username: megw-school
# Date 10/27/2023
# Description: Access and create tasks in ClickUp through the ClickUp API

import requests
import json
import datetime
import pytz
from selenium.webdriver.support import expected_conditions as EC
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

import dotenv
ENV_SECRET = ".env.secret"






class ClickUp:
    """Represents user interacting with their ClickUp account."""

    def __init__(self, token=None, client_id=None, client_secret=None, timezone='America/Chicago'):
        """
        Initialize session with ClickUp API token.

        :param token: generated API token
        """

        if not (token or (client_id and client_secret)):
            raise PermissionError('Invalid credentials provided')

        self._base_url = "https://api.clickup.com/api/v2"

        if client_secret != None or client_secret != "":
            token = self._oauth_flow(client_id, client_secret)

        self._headers = {'Authorization': token}
        self._canvas_timezone = pytz.timezone('America/Los_Angeles')
        self._timezone = pytz.timezone(timezone)

    def _oauth_flow(self, client_id, client_secret):
        body = {
            'client_id': client_id,
            'client_secret': client_secret
        }
        res = requests.post(f"https://muddy-voice-7929.fly.dev/api/oauth", json=body, allow_redirects=True)

        if res.ok:
            driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
            wait = WebDriverWait(driver, 5 * 60)

            driver.get(res.url)
            wait.until(EC.url_contains("https://muddy-voice-7929.fly.dev/?code="))

            callback = driver.current_url
            driver.close()

            start_ind = callback.find('=') + 1
            code = callback[start_ind:]

            res = requests.post(f"{self._base_url}/oauth/token?client_id={client_id}&client_secret={client_secret}&code={code}")
            data = json.loads(res.text)

            return data['access_token']

        raise Exception('Error in clickup microservice: Could not get access token')

    def _post(self, endpoint, body):
        """
        Make a POST request to ClickUp.

        :param endpoint: request endpoint
        :param body: request body
        :return: full result
        """
        url = ''.join([self._base_url, endpoint])
        res = requests.request('POST', url, headers=self._headers, data=body)

        return json.loads(res.text)

    def _get(self, endpoint):
        """
        Make a GET request to ClickUp.

        :param endpoint: request endpoint
        :return: full result
        """
        url = ''.join([self._base_url, endpoint])
        res = requests.request('GET', url, headers=self._headers)

        return json.loads(res.text)

    def get_workspaces(self):
        """
        Get the workspaces in an account.

        :return: list of workspaces
        """
        endpoint = f"/team"
        workspaces = self._get(endpoint)

        output = []
        for workspace in workspaces["teams"]:
            output.append(
                {
                    'id': workspace['id'],
                    'name': workspace['name']
                }
            )

        return output

    def create_space(self, workspace_id, space_name):
        """
        Create a space in a workspace.

        :param workspace_id: the ID of the workspace
        :param space_name: name of the space to create
        :return: ID of the space created
        """
        data = {
            "name": space_name,
            "features": {
                "due_dates": {
                    "enabled": True,
                    "start_date": True,
                },
                "time_tracking": {
                    "enabled": True
                },
                "tags": {
                    "enabled": True
                },
                "time_estimates": {
                    "enabled": True
                },
                "checklists": {
                    "enabled": True
                },
                "custom_fields": {
                    "enabled": True
                },
                "remap_dependencies": {
                    "enabled": True
                },
                "dependency_warning": {
                    "enabled": True
                },
            }
        }

        endpoint = f"/team/{workspace_id}/space"
        space = self._post(endpoint, data)
        print(space)
        if not space:
            return "Could not create space.", False
        elif 'err' in space:
            return space['err'], False

        return space['id'], True

    def create_list(self, space_id, list_name):
        """
        Create a list in a space.

        :param space_id: the ID of the space
        :param list_name: name of the list to create
        :return: ID of the list created
        """
        data = {
            "name": list_name,
        }

        endpoint = f"/space/{space_id}/list"
        task_list = self._post(endpoint, data)
        if not task_list:
            return "Could not create list.", False
        elif 'err' in task_list:
            return task_list['err'], False

        return task_list['id'], True

    def create_task(self, list_id, task_name, due_date, start_date=None, description=None, tags=None):
        """
        Create a task in a list.

        :param list_id: the ID of the list
        :param task_name: name of the task to create
        :param due_date: date task is due in the format MM/DD/YYYY
        :param start_date: optional, date the task is started in the format MM/DD/YYYY
        :param tags: list of strings that will be tags for the task
        :param description: optional, description of the task
        :return: ID of the task created
        """
        # date input is in posix
        data = {
            "name": task_name,
        }

        if due_date:
            data.update(
                {
                    'due_date': int(self._canvas_timezone.localize(datetime.datetime.strptime(due_date, "%m/%d/%Y")).
                                      replace(tzinfo=datetime.timezone.utc).
                                      timestamp() * 1000)
                })

        if start_date:
            data.update(
                {'start_date': int(self._canvas_timezone.localize(datetime.datetime.strptime(start_date, "%m/%d/%Y")).
                                   replace(tzinfo=datetime.timezone.utc).
                                   timestamp() * 1000)
                 })

        if description:
            data.update({'description': description})

        if tags:
            data.update({'tags': tags})

        endpoint = f"/list/{list_id}/task"
        task = self._post(endpoint, data)
        if not task:
            return "Could not create task.", False
        elif 'err' in task:
            return task['err'], False

        return task['id'], True


if __name__ == "__main__":
    clickup = ClickUp(
        dotenv.get_key(ENV_SECRET, 'CLICKUP_TOKEN'),
        dotenv.get_key(ENV_SECRET, 'CLICKUP_CLIENT_ID'),
        dotenv.get_key(ENV_SECRET, 'CLICKUP_CLIENT_SECRET')
    )
    workspace_name = "CS361 Project Test"

    workspaces = clickup.get_workspaces()
    for workspace in workspaces:
        if workspace['name'] == workspace_name:
            workspace_id = workspace['id']

    new_space = clickup.create_space(workspace_id, "ClickUp Model Test Space")
    new_list = clickup.create_list(new_space[0], "ClickUp Model Test List")
    new_task1 = clickup.create_task(new_list[0], "ClickUp Model Test Task 1", "10/29/2023")
    new_task2 = clickup.create_task(new_list[0], "ClickUp Model Test Task 2", "10/30/2023", "10/20/2023",
                                   ["Test Tag 1", "Test Tag 2"],
                                   "This is a test task created using the Python ClickUp Model.")
