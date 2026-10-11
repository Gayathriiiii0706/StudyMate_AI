from rest_framework import serializers
from .models import Subject, StudyTask


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'


class StudyTaskSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(
        source='subject.name',
        read_only=True
    )

    class Meta:
        model = StudyTask
        fields = '__all__'