from django.conf import settings
from django.contrib import admin
from django.urls import path, include

_app_patterns = [
    path('admin/', admin.site.urls),
    path('', include('app.urls')),
]

if settings.URL_PREFIX:
    urlpatterns = [
        path(f'{settings.URL_PREFIX}/', include(_app_patterns)),
    ]
else:
    urlpatterns = _app_patterns
