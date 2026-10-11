from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    SubjectViewSet,
    StudyTaskViewSet,
    generate_study_plan,
)

router = DefaultRouter()
router.register('subjects', SubjectViewSet)
router.register('tasks', StudyTaskViewSet)

urlpatterns = [
    path('ai-study-plan/', generate_study_plan, name='ai-study-plan'),
] + router.urls