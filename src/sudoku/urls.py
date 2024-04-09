from django.urls import path
from .views import create_sudoku_view, play_sudoku_view

urlpatterns = [
    path("create/", create_sudoku_view, name='create_sudoku'),
    path("play/<int:block_rows>x<int:block_cols>/<int:id>", play_sudoku_view, name='play_sudoku')
    # Add other URL patterns as needed
]
