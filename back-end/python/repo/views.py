# coding:utf-8
from django.http import HttpResponse

from repo.models import User
from repo.models import Record

from django.core.exceptions import ObjectDoesNotExist

import uuid
import json
import hashlib
import requests
 
def index(request):
    return render(request, 'index.html')

# [POST] /query
# Param:
#      token: string
#      user: string
#
# Return:
#      {
#          "state": Integer,
#          "description": String,
#          "info": object,
#      }
def query(request):
    _uuid = request.POST.get('token',"0")
    _githubuser = request.POST.get('user',"0")
    if _githubuser == "0" or _uuid == '0':
        data = {
            'state' : 3,
            "description" : "Param incomplete"
        }
        return HttpResponse(json.dumps(data))
    # Check existence of user
    try:
        user = User.objects.get(uuid=_uuid)
    except ObjectDoesNotExist:
        data = {
            'state' : 2,
            "description" : "User not exist"
        }
        return HttpResponse(json.dumps(data))
    # Get user info
    _username = user.username
    _repos = requests.get("https://api.github.com/users/"+ _githubuser +"/repos")

    _repoResult = _repos.json()

    _repoList = []

    for i in range(len(_repoResult)):
        temp = {
            'name' : "Default",
            'description' : "Default",
            'watcher' : 0,
            'id' : 0
        }
        for key, value in _repoResult[i].items():
            if key == "name" or key == "description" or key == "watchers" or key == "id":
                temp[key] = value
        temp["star"] = 0
        if temp["id"] != 0:
            try:
                record = Record.objects.get(searcher=_username, githubid=temp["id"])
                temp["star"] = record.star
            except ObjectDoesNotExist:
                Record.objects.create(
                    name=temp["name"],
                    description=str(temp["description"])+" ",
                    watcher=temp["watcher"],
                    searcher=_username,
                    star=temp["star"],
                    githubid=temp["id"]
                )
        _repoList.append(temp)
    data = {
        'state' : 0,
        "description" : "OK",
        "info" : _repoList
    }
    return HttpResponse(json.dumps(data))


# [POST] /api/register
# Param:
#      username: string
#      password: string
#
# Return:
#      {
#          "state": Integer,
#          "description": String
#      }
def register(request):
    _password = request.POST.get('password',"0")
    _username = request.POST.get('username',"0")
    if _username == "0" or _password == '0':
        data = {
            'state' : 3,
            "description" : "Param incomplete"
        }
        return HttpResponse(json.dumps(data))
    # Check user existance
    try:
        User.objects.get(username=_username)
        data = {
            'state' : 2,
            "description" : "User exist"
        }
        return HttpResponse(json.dumps(data))
    except ObjectDoesNotExist:
        # MD5
        md5Password = hashlib.md5(_password.encode('utf-8')).hexdigest()
        User.objects.create(username=_username, password=md5Password, uuid="")
        data = {
                'state' : 0,
                "description" : "OK"
            }
        return HttpResponse(json.dumps(data))

# [POST] /api/login
# Param:
#      username: string
#      password: string
#
# Return:
#      {
#          "state": Integer,
#          "description": String
#      }
def login(request):
    _password = request.POST.get('password',"0")
    _username = request.POST.get('username',"0")
    if _username == "0" or _password == '0':
        data = {
            'state' : 3,
            "description" : "Param incomplete"
        }
        return HttpResponse(json.dumps(data))
    # Check user existance
    try:
        user = User.objects.get(username=_username)
        # MD5
        if user.password == _password:
            uuid1 = uuid.uuid1()
            user.uuid = str(uuid1)
            user.save()
            data = {
                'state' : 0,
                "description" : str(uuid1)
            }
            return HttpResponse(json.dumps(data))
        else:
            data = {
                'state' : 1,
                "description" : "Password Incorrect"
            }
            return HttpResponse(json.dumps(data))
    except ObjectDoesNotExist:
        data = {
            'state' : 2,
            "description" : "User not exist"
        }
        return HttpResponse(json.dumps(data))

def logout(request):
    _uuid = request.POST.get('token',"0")
    if _uuid == "0":
        data = {
            'state' : 3,
            "description" : "Param incomplete"
        }
        return HttpResponse(json.dumps(data))
    # Check user existance
    try:
        user = User.objects.get(uuid=_uuid)
        user.uuid = "0"
        user.save()
        data = {
            'state' : 0,
            "description" : "OK"
        }
        return HttpResponse(json.dumps(data))
    except ObjectDoesNotExist:
        data = {
            'state' : 2,
            "description" : "User not exist"
        }
        return HttpResponse(json.dumps(data))


