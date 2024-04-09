from django.shortcuts import render, get_object_or_404, redirect
from django.http import Http404
from random import randint, random

# Create your views here.
def home_view(request):
    context = {}
    return render(request, "home.html", context=context)
