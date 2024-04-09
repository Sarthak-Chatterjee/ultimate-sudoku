from django.db import models
from user.models import User

class Sudoku(models.Model):
    DIFFICULTY_CHOICES = [
        ('Easy', 'Easy'),
        ('Medium', 'Medium'),
        ('Hard', 'Hard'),
        ('Expert', 'Expert'),
        ('Evil', 'Evil'),
        ('Nightmare', 'Nightmare'),
    ]
    
    block_rows = models.PositiveSmallIntegerField()
    block_columns = models.PositiveSmallIntegerField()
    problem = models.BinaryField(max_length=160, editable=True) # maxlength = 160 B * 8 b/B = 1280 b
    solution = models.BinaryField(max_length=160, editable=True) # maxlength = 160 Bytes *8 = 1280 bits
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    creation_datetime = models.DateTimeField(auto_now_add=True)
    difficulty_level = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)

    def __str__(self):
        return f"Sudoku #{self.id} - Creator: {self.creator.username}"


class Sudoku_User(models.Model):
    sudoku = models.ForeignKey(Sudoku, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    completion_datetime = models.DateTimeField(auto_now_add=True)
    time_taken = models.DurationField()
    wrong_moves = models.PositiveIntegerField()
    
    class Meta:
        # Define a unique constraint to ensure each user can solve each sudoku only once
        unique_together = ('sudoku', 'user')
    
    def str(self):
        return f"{self.user} solved {self.link}"