from django.db import models

# Create your models here.

class User(models.Model):
    username = models.CharField(max_length = 64)
    password = models.CharField(max_length = 128)
    uuid = models.CharField(max_length = 32)

class Record(models.Model):
    name = models.CharField(max_length = 128)
    description = models.CharField(max_length = 1024)
    watcher = models.IntegerField()
    searcher = models.CharField(max_length = 64)
    star = models.IntegerField()
    githubid = models.CharField(max_length = 32)
