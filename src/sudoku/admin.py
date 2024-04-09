from django.contrib import admin
from .models import Sudoku, Sudoku_User

# Register your models here.
admin.site.register(Sudoku)
admin.site.register(Sudoku_User)