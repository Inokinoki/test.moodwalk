# Generated by Django 2.0 on 2017-12-21 21:15

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Record',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128)),
                ('description', models.CharField(max_length=1024)),
                ('watcher', models.IntegerField()),
                ('searcher', models.CharField(max_length=64)),
                ('star', models.IntegerField()),
                ('githubid', models.CharField(max_length=32)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=64)),
                ('password', models.CharField(max_length=128)),
                ('uuid', models.CharField(max_length=32)),
            ],
        ),
    ]
