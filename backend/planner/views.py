import json
import urllib.request
from rest_framework.decorators import api_view

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Subject, StudyTask
from .serializers import SubjectSerializer, StudyTaskSerializer


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer


class StudyTaskViewSet(viewsets.ModelViewSet):
    queryset = StudyTask.objects.select_related('subject').all()
    serializer_class = StudyTaskSerializer

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        task = self.get_object()
        new_status = request.data.get('status')

        allowed_statuses = [
            choice[0] for choice in StudyTask.STATUS_CHOICES
        ]

        if new_status not in allowed_statuses:
            return Response(
                {
                    'error': 'Invalid status.',
                    'allowed_statuses': allowed_statuses
                },
                status=400
            )

        task.status = new_status
        task.save(update_fields=['status'])

        return Response(self.get_serializer(task).data)
@api_view(['POST'])
def generate_study_plan(request):
    subject = request.data.get('subject', '').strip()
    days = request.data.get('days', 7)
    hours_per_day = request.data.get('hours_per_day', 2)

    if not subject:
        return Response(
            {'error': 'Please provide a subject to study.'},
            status=400
        )

    try:
        days = int(days)
        hours_per_day = float(hours_per_day)

        if not 1 <= days <= 30 or not 0 < hours_per_day <= 12:
            return Response(
                {'error': 'Use 1–30 days and 0–12 study hours per day.'},
                status=400
            )

        prompt = (
            f"Create a practical {days}-day study plan for {subject}. "
            f"The student can study {hours_per_day} hours per day. "
            "Give a day-by-day plan with topics, activities, and short breaks. "
            "Use simple English and clear headings."
        )

        payload = json.dumps({
            'model': 'llama3.2:3b',
            'prompt': prompt,
            'stream': False
        }).encode('utf-8')

        ollama_request = urllib.request.Request(
            'http://localhost:11434/api/generate',
            data=payload,
            headers={'Content-Type': 'application/json'},
            method='POST'
        )

        with urllib.request.urlopen(
            ollama_request, timeout=180
        ) as response:
            result = json.loads(response.read().decode('utf-8'))

        return Response({
            'subject': subject,
            'days': days,
            'hours_per_day': hours_per_day,
            'study_plan': result.get('response', '')
        })

    except (ValueError, TypeError):
        return Response(
            {'error': 'Days must be a whole number and study hours must be numeric.'},
            status=400
        )

    except Exception:
        return Response(
            {'error': 'Could not generate a study plan. Check that Ollama is running.'},
            status=503
        )