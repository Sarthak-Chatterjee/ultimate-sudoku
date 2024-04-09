from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django_countries.fields import CountryField
from django.core.validators import RegexValidator


# Custom validator for user_name field
username_validator = RegexValidator(
    regex=r'^[a-zA-Z0-9](?:[a-zA-Z0-9_]{2,12}[a-zA-Z0-9])?$',
    message='User name must contain only alphanumeric characters and underscores, and be between 4 and 14 characters long. Underscores are not allowed at the beginning or end.'
)

class User(AbstractUser):
    DEFAULT_USER_IMAGE = 'user_images/default_abstract_user.svg'

    user_name = models.CharField(max_length=14, unique=True, validators=[username_validator])
    first_name = models.CharField(max_length=50, blank=True)
    middle_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    user_image = models.ImageField(upload_to='user_images/', default=DEFAULT_USER_IMAGE)
    user_country = CountryField(blank_label="(select country)")
    sudo_coins = models.PositiveIntegerField(default=2000)
    user_streak = models.PositiveIntegerField(default=0)
    speedrun_rating = models.PositiveIntegerField(default=1000)
    marathon_rating = models.PositiveIntegerField(default=1000)
    pvp_rating = models.PositiveIntegerField(default=1000)
    user_rating = models.PositiveIntegerField(default=1000)
    community_contributions = models.PositiveIntegerField(default=1000)
    is_banned = models.BooleanField(default=False)

    # solved_sudokus = models.ManyToManyField('Sudoku', related_name='solvers')

    def __str__(self):
        return self.username
